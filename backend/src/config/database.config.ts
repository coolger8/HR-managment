import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'better-sqlite3',
  database: join(__dirname, '..', '..', 'hr_management.db'),
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  synchronize: true, // Only for development
  logging: true,
};