import { Injectable } from '@nestjs/common';
import { CategoryFilter } from 'src/category/entities/category-filter.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Brackets, EntityManager } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
   constructor(private readonly em: EntityManager) {}

   async findAllSubscriber(product: Product) {
      const qb = this.em
         .createQueryBuilder(CategoryFilter, 'cf')
         .leftJoin(Product, 'p', 'p.categoryId = :categoryId', {
            categoryId: product.categoryId,
         })
         .leftJoin(User, 'u', 'u.id = cf.userId')
         .where('p.id = :productId', { productId: product.id })
         .andWhere('p.properties @> cf.categoryProperties')
         .andWhere(
            new Brackets((qb) => {
               qb.where('cf.isAuction is null').orWhere(
                  'cf.isAuction = p.isAuction',
               );
            }),
         )
         .andWhere(
            new Brackets((qb) => {
               qb.where('cf.price is null').orWhere('cf.price <= p.price');
            }),
         )
         .andWhere(
            new Brackets((qb) => {
               qb.where('cf.priceUntil is null').orWhere(
                  'cf.priceUntil > p.price',
               );
            }),
         )
         .andWhere(
            new Brackets((qb) => {
               qb.where('cf.expireUntil is null').orWhere(
                  'cf.expireUntil > p.expiration',
               );
            }),
         )
         .andWhere(
            new Brackets((qb) => {
               qb.where('cf.startedFrom is null').orWhere(
                  'cf.startedFrom <= p.created_date',
               );
            }),
         );

      const categoryFilters = await qb.getMany();

      const notifications = await this.em.save(
         Notification,
         categoryFilters.map(
            (cf) =>
               ({
                  userId: cf.userId,
                  productId: product.id,
                  seen: false,
               } as Notification),
         ),
      );

      return {
         userIdNotificationIdPair: notifications.map(
            (n) => ['' + n.userId, n.id] as const,
         ),
         product,
      };
   }

   seenNotification(id: number) {
      return this.em.update(Notification, { id }, { seen: true });
   }
}
