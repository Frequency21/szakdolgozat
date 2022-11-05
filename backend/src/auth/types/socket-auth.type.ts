import { Request } from 'express';
import { Socket } from 'socket.io';

export type SocketAuth = Socket & { request: Request } & { userId: number };
