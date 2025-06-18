import { DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

if (
  !process.env.DB_HOST ||
  !process.env.DB_PORT ||
  !process.env.DB_USERNAME ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_NAME
) {
  throw new Error('Database configuration environment variables are not set');
}

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    join(__dirname, '../database/entities/*.entity{.ts,.js}'),
    join(__dirname, '../modules/**/entities/*.entity{.ts,.js}'),
  ],
  synchronize: process.env.IS_DEVELOPMENT === 'true',
  // logging: true,
  // logger: 'advanced-console',
};
