import {
   ConflictException,
   Injectable,
   InternalServerErrorException,
   Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import Barion from 'node-barion';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { EntityManager, In } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class BarionService {
   logger = new Logger(BarionService.name);
   private readonly barion!: Barion;
   private readonly callbackUrl: string;
   private readonly redirectUrl: string;

   constructor(
      private em: EntityManager,
      private configService: ConfigService,
   ) {
      const poskey = this.configService.get<string>('BARION_POSKEY');
      this.callbackUrl = this.configService.get<string>('BARION_CALLBACK_URL')!;
      const nodeEnv = this.configService.get<string>('NODE_ENV');
      this.redirectUrl =
         nodeEnv === 'development'
            ? this.configService.get<string>('BARION_LOCAL_REDIRECT_URL')!
            : this.configService.get<string>('BARION_REDIRECT_URL')!;

      if (!poskey || !this.callbackUrl || !this.redirectUrl) {
         throw new Error('missing env variables');
      }

      this.barion = new Barion({
         POSKey: poskey,
      });
   }

   initializePayment(user: User, productIds: number[]) {
      return this.em.transaction(
         // specify isolation level
         'SERIALIZABLE',
         async (transaction) => {
            // find and lock products
            const products = await transaction.find(Product, {
               where: { id: In(productIds) },
               lock: { mode: 'pessimistic_write' },
            });

            const sellers = await transaction
               .createQueryBuilder(User, 'u')
               .select(['u.id', 'u.barionEmail', 'u.name'])
               .leftJoin(Product, 'p', 'p.sellerId = u.id')
               .where('p.id in (:...productIds)', { productIds })
               .getMany();

            const sellersMap = new Map<
               number,
               { seller: User; products: Product[] }
            >();
            for (const product of products) {
               if (product.transactionId) {
                  this.logger.error(`Conflicting product (${product.id})`);
                  throw new ConflictException({
                     message: `A (${product.name}) terméket már megvették, vagy fizetés alatt áll!`,
                  });
               }

               const seller = sellers.find((s) => s.id === product.sellerId)!;
               if (!seller.barionEmail) {
                  this.logger.error(
                     `Missing barion email for user (${product.sellerId}).`,
                  );
                  throw new InternalServerErrorException(
                     `A '${seller.name}' nevű eladó, még nem tud fizetéseket fogadni`,
                  );
               }

               const mappedSeller = sellersMap.get(seller.id);
               if (!mappedSeller) {
                  sellersMap.set(product.sellerId, {
                     seller,
                     products: [product],
                  });
               } else {
                  sellersMap.set(product.sellerId, {
                     seller,
                     products: [...mappedSeller.products, product],
                  });
               }
            }

            const randomId = `${Math.floor(Math.random() * 100)}`.padStart(
               3,
               '0',
            );
            const paymentRequestId = `DM-${Date.now()}-${randomId}`;

            const transactions = [...sellersMap.values()].map((seller, i) => {
               const transaction: any = {
                  POSTransactionId: `${paymentRequestId}-${i}`,
                  Payee: seller.seller.barionEmail!,
               };

               transaction.Total = seller.products.reduce(
                  (prev, curr) => prev + curr.price,
                  0,
               );
               transaction.Items = seller.products.map((p) => ({
                  Name: p.name,
                  Description: p.description.slice(0, 500),
                  Quantity: 1,
                  Unit: 'db',
                  UnitPrice: p.price,
                  ItemTotal: p.price,
               }));

               return transaction;
            });

            let response: {
               PaymentId: string;
               Status: number;
               GatewayUrl: any;
            };

            try {
               response = await this.barion.startPayment({
                  PaymentType: 'Immediate',
                  PaymentRequestId: paymentRequestId,
                  Transactions: transactions,
                  CallbackUrl: await this.ngrokTransformedUrl(this.callbackUrl),
                  RedirectUrl: this.redirectUrl,
               });
            } catch (err) {
               this.logger.error(err);
               throw new InternalServerErrorException();
            }

            const status: number = response.Status;
            // ha a fizetés sikertelen
            if ([30, 50, 70].includes(status)) {
               // rollback transaction
               throw new Error();
            }

            const payment = transaction.create(Payment, {
               paymentId: response.PaymentId,
               buyer: user,
               products,
            });
            products.forEach((p) => {
               p.transaction = payment;
            });

            await transaction.save(payment);
            await transaction.save(products);

            return response.GatewayUrl;
         },
      );
   }

   async processPayment(paymentId: string) {
      const { Status: status } = await this.barion.getPaymentState({
         PaymentId: paymentId,
      });

      if (status === 'Prepared') {
         return {
            message: 'A fizetés előkészítve, a tranzakció elkezdésre vár.',
         };
      }

      if (status === 'Started') {
         return {
            message: 'A fizetési folyamat el lett kezdve.',
         };
      }

      if (status === 'Succeeded') {
         await this.em.query(
            `delete from user_baskets ub where ub."userId" in (
            select "userId" from payment p where p."paymentId" = $1
         )`,
            [paymentId],
         );
         return {
            message: 'A fizetési sikeres volt.',
         };
      }

      let message: string;

      if (status === 'Canceled') {
         message = 'A fizetést félbeszakították.';
      } else if (status === 'Failed') {
         message = 'A fizetés sikertelen volt.';
      } else if (status === 'Expired') {
         message = 'A fizetés határideje lejárt.';
      } else {
         message = `Ismeretlen hiba, státusz kód: ${status}.`;
      }

      this.logger.debug(`Delete payment (${paymentId})`);
      // ha a fizetés sikertelen volt
      await this.em.delete(Payment, { paymentId });

      return { message };
   }

   private readonly ngrokPattern = '{{ngrok}}';

   private async ngrokTransformedUrl(url: string) {
      if (this.configService.get('NODE_ENV') !== 'development') {
         return url;
      }
      if (url.match(this.ngrokPattern) == null) {
         return url;
      }
      try {
         const ngrokRes = await axios('http://127.0.0.1:4040/api/tunnels');
         const tunnels: { public_url: string; proto: string }[] =
            ngrokRes.data.tunnels;
         const tunnel = tunnels.find((t) => t.proto === 'https');
         if (!tunnel) throw new Error('Ngrok - No https tunnel found!');
         return url.replace(this.ngrokPattern, tunnel.public_url);
      } catch (e) {
         Logger.error(`Could not substitute Ngrok URL - ${e}`);
         throw e;
      }
   }
}
