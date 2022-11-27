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

export interface Product extends ProductSimple {
   description: string;
   isAuction: boolean;
   minBid?: number;
   minPrice?: number;
   deliveryOptions: Delivery[];
   weight?: number;
   properties: CategoryProperties;
   sellerId: number;
   buyer?: User;
   buyerId?: number;
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
   expiration?: string;
   highestBidder?: User;
   sellerRating?: {
      id: number;
   };
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
   expiration?: string | null;
   properties: CategoryProperties;
   sellerId: number;
   categoryId: number;
}

export type ProductProperties = {
   isAuction?: boolean;
   price?: number;
   priceUntil?: number;
   expireUntil?: Date;
   startedFrom?: Date;
};

export interface SellerRatingDto extends BuyerRatingDto {
   quality: string;
}

export interface BuyerRatingDto {
   id?: number;
   productId: number;
   transaction: string;
   delivery: string;
   communication: string;
}
