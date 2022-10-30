import type RedisStore from 'connect-redis';

export const REDIS = 'REDIS';
export const SESSION_STORE = 'SESSION_STORE';
export type SessionStore = RedisStore.RedisStore;
