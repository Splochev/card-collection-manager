// src/config/typeorm.config.ts
import { DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'card-collection-manager',
  entities: [
    join(__dirname, '../modules/**/entities/*.entity{.ts,.js}'), // 👈 fix path here
  ],
  synchronize: true,
};
