import { Category, CategoryProperties } from './category.model';
import { User } from './user.model';

export enum Delivery {
   personal = 'personal',
   mail = 'mail',
   other = 'other',
}

export const DISPLAY_DELIVERY: Record<Delivery, string> = {
   [Delivery.personal]: 'Személyes átvétel',
   [Delivery.mail]: 'Postázás',
   [Delivery.other]: 'Egyéb',
};

export enum Condition {
   new = 'new',
   used = 'used',
   other = 'other',
}

export const DISPLAY_CONDITION: Record<Condition, string> = {
   [Condition.new]: 'Új',
   [Condition.used]: 'Használt',
   [Condition.other]: 'Egyéb',
};

export interface Product {
   id: number;
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
   seller: User;
   sellerId: number;
   buyer?: User;
   buyerId?: number;
   basketOwners?: User[];
   category: Category;
   categoryId: number;
}

export interface ProductSimple {
   id: number;
   condition: Condition;
   name: string;
   price: number;
   pictures: string[];
   isAuction: boolean;
   seller: User;
   expiration?: Date;
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
