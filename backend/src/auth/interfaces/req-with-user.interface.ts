import { Request } from 'express';
import { User } from 'src/user/user.entity';

export type ReqWithUser = Request & { user: User };
