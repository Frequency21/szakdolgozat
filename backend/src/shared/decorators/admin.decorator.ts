import { SetMetadata } from '@nestjs/common';

export const META_DATA_ADMIN = Symbol('admin');

export const Admin = () => SetMetadata(META_DATA_ADMIN, true);
