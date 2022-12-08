import {
   BadRequestException,
   ConflictException,
   HttpException,
   HttpStatus,
   Injectable,
   NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Payment } from 'src/barion/entities/payment.entity';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/constants/db/postgresql.error.codes';
import { Notification } from 'src/notification/entities/notification.entity';
import { Product } from 'src/product/entities/product.entity';
import { BuyerRatingStatisticsDto } from 'src/rating/dto/buyer-rating-statistics.dto';
import { BuyerRating } from 'src/rating/entities/buyer-rating.entity';
import { SellerRating } from 'src/rating/entities/seller-rating.entity';
import { EntityManager, Repository } from 'typeorm';
import { SellerRatingStatisticsDto } from '../rating/dto/seller-rating-statistics.dto';
import { RegisterWithPasswordDto } from './dto/register-with-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GoogleUser, User } from './entities/user.entity';

@Injectable()
export class UserService {
   constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      private em: EntityManager,
   ) {}

   /**
    * @throws {@link NotFoundException} if email doesn't exist
    * @param email
    * @returns user with email or throws error
    */
   async getByEmail(
      email: string,
      fetchPassword = false,
   ): Promise<User> | never {
      const qb = this.usersRepository.createQueryBuilder('u');

      if (fetchPassword) {
         qb.addSelect(['u.password']);
      }

      qb.addSelect(['u.barionEmail', 'u.idp']);
      qb.where('u.email = :email', { email });
      const user = await qb.getOne();

      if (user) return user;
      throw new NotFoundException({
         message: 'User with this email does not exist',
      });
   }

   async getById(id: number) {
      let user: User | null = null;
      try {
         user = await this.usersRepository
            .createQueryBuilder('u')
            .addSelect(['u.barionEmail', 'u.idp'])
            .where('u.id = :id', { id })
            .getOne();
      } catch (err: any) {
         if (err?.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
            throw new HttpException(
               'User with that id does not exist',
               HttpStatus.NOT_FOUND,
            );
         }
      }
      return user;
   }

   async create(userData: RegisterWithPasswordDto) {
      const newUser = this.usersRepository.create(userData);
      try {
         await this.usersRepository.save(newUser);
         return newUser;
      } catch (err: any) {
         if (err?.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
            throw new ConflictException({
               message: 'User with that email already exists',
            });
         }
         return null;
      }
   }

   async registerGoogleUser(googleUser: GoogleUser) {
      const newUser = this.usersRepository.create(googleUser);
      try {
         await this.usersRepository.save(newUser);
         return newUser;
      } catch (err: any) {
         if (err?.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
            throw new ConflictException({
               message: 'User with that email already exists',
            });
         }
         return null;
      }
   }

   updateUser(id: number, updateUserDto: UpdateUserDto) {
      const { email } = updateUserDto;

      return this.em.transaction(async (manager) => {
         const user = await manager.findOne(User, {
            select: {
               id: true,
               idp: true,
               email: true,
            },
            where: { id },
            lock: { mode: 'pessimistic_write' },
         });

         if (!user) throw new NotFoundException();

         if (user.idp != null && email && user.email !== email) {
            throw new BadRequestException({
               message: 'Nem módosítható az email cím!',
            });
         }

         return await manager.save(User, { ...user, ...updateUserDto });
      });
   }

   getAllUser() {
      return this.usersRepository.find();
   }

   async getBasket(user: User): Promise<Product[]> {
      const userEntity = await this.usersRepository.findOne({
         select: ['baskets'],
         relations: ['baskets', 'baskets.seller'],
         where: { id: user.id },
      });

      return userEntity!.baskets;
   }

   async addProductToBasket(user: User, productId: number) {
      const [userEntity, product] = await Promise.all([
         this.em.findOne(User, {
            where: { id: user.id },
            relations: ['baskets'],
         }),
         this.em.findOne(Product, {
            where: {
               id: productId,
            },
         }),
      ]);

      if (!userEntity || !product) {
         throw new NotFoundException();
      }

      if (product.transactionId != null) {
         throw new BadRequestException();
      }

      if (!userEntity.baskets.find((p) => p.id === productId)) {
         userEntity.baskets.push(product);
         await this.em.save(User, userEntity);
      }
   }

   async removeProductFromBasket(user: User, productId: number) {
      const userEntity = await this.em.findOne(User, {
         where: { id: user.id },
         relations: ['baskets'],
      });

      if (!userEntity) {
         throw new NotFoundException();
      }

      const index = userEntity.baskets.findIndex((p) => p.id === productId);
      if (index === -1) return;

      userEntity.baskets.splice(index, 1);
      await this.em.save(User, userEntity);
   }

   /**
    * Returns user with products in basket, and unseen notification
    */
   async getLoginData(user: User) {
      const userQuery = this.usersRepository
         .createQueryBuilder('u')
         .leftJoin('user_baskets', 'b', 'u.id = b.userId')
         .leftJoinAndMapMany('u.baskets', Product, 'bp', 'b.productId = bp.id')
         .leftJoinAndMapOne('bp.seller', User, 'bps', 'bp.sellerId = bps.id')
         // ügyfél adatok
         .select(['u.id', 'u.name', 'u.email', 'u.picture', 'u.role'])
         .addSelect(['u.barionEmail', 'u.idp'])
         // kosár adatok
         .addSelect(['b'])
         .addSelect([
            'bp.id',
            'bp.name',
            'bp.condition',
            'bp.price',
            'bp.pictures',
            'bp.isAuction',
         ])
         .addSelect(['bps.id', 'bps.name'])
         .where('u.id = :id', { id: user.id })
         .getOne();
      const notificationsQuery = this.em
         .createQueryBuilder(Notification, 'n')
         .leftJoinAndMapOne('n.product', Product, 'p', 'n.productId = p.id')
         .select(['n.id', 'p.id', 'p.name', 'p.price', 'p.pictures'])
         .where('n.userId = :id', { id: user.id })
         .andWhere('n.seen = false')
         .getMany();

      const [userEntity, notifications] = await Promise.all([
         userQuery,
         notificationsQuery,
      ]);
      userEntity!.notifications = notifications;

      return userEntity;
   }

   async getStatisticsForUser(id: number) {
      const sellerRatingStatisticsQuery = this.em
         .createQueryBuilder(SellerRating, 'sr')
         .select([
            'count(*) as "sum"',
            'avg(sr.communication::integer) as "communication"',
            'avg(sr.delivery::integer) as "delivery"',
            'avg(sr.transaction::integer) as "transaction"',
            'avg(sr.quality::integer) as "quality"',
         ])
         .leftJoin(Product, 'p', 'sr.productId = p.id')
         .leftJoin(User, 'u', 'p.sellerId = u.id')
         .where('u.id = :id', { id })
         .getRawOne()
         .then((result) =>
            result.sum === '0'
               ? undefined
               : plainToClass(SellerRatingStatisticsDto, result, {
                    enableImplicitConversion: true,
                 }),
         );

      const buyerRatingStatisticsQuery = this.em
         .createQueryBuilder(BuyerRating, 'br')
         .select([
            'count(*) as "sum"',
            'avg(br.communication::integer) as "communication"',
            'avg(br.delivery::integer) as "delivery"',
            'avg(br.transaction::integer) as "transaction"',
         ])
         .leftJoin(Product, 'pr', 'br.productId = pr.id')
         .leftJoin(Payment, 'pa', 'pa.id = pr.transactionId')
         .leftJoin(User, 'u', 'pa.buyerId = u.id')
         .where('u.id = :id', { id })
         .getRawOne()
         .then((result) =>
            result.sum === '0'
               ? undefined
               : plainToClass(BuyerRatingStatisticsDto, result, {
                    enableImplicitConversion: true,
                 }),
         );

      const profileDataQuery = this.em.findOne(User, {
         select: {
            name: true,
            email: true,
            picture: true,
         },
         where: { id },
      });

      const [sellerRatingStatistics, buyerRatingStatistics, profileData] =
         await Promise.all([
            sellerRatingStatisticsQuery,
            buyerRatingStatisticsQuery,
            profileDataQuery,
         ]);

      return {
         sellerRatingStatistics,
         buyerRatingStatistics,
         profileData: profileData!,
      };
   }
}
