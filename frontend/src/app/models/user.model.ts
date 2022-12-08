import { Notification } from './notification.model';
import { Product, ProductSimple } from './product.model';

export enum Role {
   admin = 'admin',
   customer = 'customer',
}

export type User = {
   id: number;
   name: string;
   picture?: string | null;
   email: string;
};

export type LoginData = {
   id: number;
   email: string;
   idp?: string | null;
   name: string;
   picture?: string;
   barionEmail?: string | null;
   role: Role;
   products?: Product[];
   baskets: ProductSimple[];
   notifications: Notification[];
};

export type UpdateUserDto = Partial<
   Omit<LoginData, 'idp' | 'password' | 'role'>
> &
   Pick<LoginData, 'id'>;
