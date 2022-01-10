import { registerAs } from '@nestjs/config';
import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { join } from 'path';

export default registerAs('serveStatic', (): ServeStaticModuleOptions[] => [
   {
      rootPath: join(__dirname, '../../../frontend/dist/frontend'),
      serveRoot: '',
      exclude: ['api-doc'],
   },
]);
