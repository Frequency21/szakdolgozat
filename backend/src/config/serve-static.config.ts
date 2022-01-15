import { join } from 'path';

export const staticServeConfig = {
   rootPath: join(__dirname, '../../../frontend/dist/frontend'),
   serveRoot: '',
   exclude: ['api-doc'],
};
