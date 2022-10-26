import { Product } from './product.model';

export type User = {
   id: number;
   email: string;
   idp?: string;
   name: string;
   picture?: string;
   barionEmail?: string;
   barionPosKey?: string;
   products?: Product[];
};

export type UpdateUserDto = Partial<Omit<User, 'idp' | 'password' | 'role'>> &
   Pick<User, 'id'>;
