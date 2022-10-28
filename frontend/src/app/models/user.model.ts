import { Product } from './product.model';

export enum Role {
   admin = 'admin',
   customer = 'customer',
}

export type User = {
   id: number;
   email: string;
   idp?: string;
   name: string;
   picture?: string;
   barionEmail?: string;
   barionPosKey?: string;
   role: Role;
   products?: Product[];
};

export type UpdateUserDto = Partial<Omit<User, 'idp' | 'password' | 'role'>> &
   Pick<User, 'id'>;
