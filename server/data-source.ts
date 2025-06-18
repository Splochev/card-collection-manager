import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { typeOrmConfig } from './src/database/typeorm.config';
import { join } from 'path';

const dsOptions = {
  ...typeOrmConfig,
  entities: [join(__dirname, '../**/entities/*.entity{.ts,.js}')],
  migrations: ['src/database/migrations/*.ts'],
} as DataSourceOptions;

export const AppDataSource = new DataSource(dsOptions);
