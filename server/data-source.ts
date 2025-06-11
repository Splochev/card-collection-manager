import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { typeOrmConfig } from './src/config/typeorm.config';

const dsOptions = {
  ...typeOrmConfig,
  entities: ['src/database/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
} as DataSourceOptions;

export const AppDataSource = new DataSource(dsOptions);
