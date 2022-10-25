import { Product } from './product.model';

export type User = {
   id: number;
   email: string;
   name: string;
   picture?: string;
   barionEmail?: string;
   barionPosKey?: string;
   products?: Product[];
};

export type UpdateUserDto = Partial<User> & Pick<User, 'id'>;
