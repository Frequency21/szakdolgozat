import { User } from './user.model';

export interface Product {
   id: number;
   name: string;
   price: number;
   isBidding: boolean;
   minBid?: number;
   owner: User;
}
