import { Product } from 'src/product/entities/product.entity';

export const CREATED_PRODUCT_EVENT = 'created_product';
export type CreatedProductPayload = Product;
