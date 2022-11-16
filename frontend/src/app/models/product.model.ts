import { CategoryProperties } from './category.model';
import { User } from './user.model';

export enum Delivery {
   personal = 'personal',
   mail = 'mail',
   other = 'other',
}

export enum Condition {
   new = 'new',
   used = 'used',
   other = 'other',
}
export interface Product {
   id: number;
   description: string;
   name: string;
   price: number;
   isBidding: boolean;
   minBid?: number;
   owner: User;
}

export interface CreateProductDto {
   name: string;
   description: string;
   price: number;
   isAuction: boolean;
   minBid?: number;
   minPrice?: number;
   deliveryOptions: Delivery[];
   condition: Condition;
   weight?: number;
   pictures: string[];
   expiration?: Date;
   properties: CategoryProperties;
   sellerId: number;
   categoryId: number;
}
