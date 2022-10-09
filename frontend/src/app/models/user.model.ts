import { Product } from './product.model';

export interface User {
   id: number;
   email: string;
   name: string;
   picture?: string;
   products?: Product[];
}
