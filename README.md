# card-collection-manager

## Desired folder structure
src/
├── app.module.ts           # Root module
├── main.ts                 # Application entry point
├── common/                 # Shared utilities, guards, interceptors, pipes, filters
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── decorators/
├── config/                 # Configuration files and environment setup
├── modules/                # Feature modules (group by domain)
│   ├── users/
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entities/       # Database entities / models
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── auth/
│   ├── products/
│   └── ...
├── database/               # Database connection, migrations, seeds
│   ├── entities/
│   ├── migrations/
│   └── seeds/
├── shared/                 # Shared domain logic or utilities specific to your business logic
├── middleware/             # Middleware functions
├── interfaces/             # Interfaces or types
└── utils/                  # General utility functions

=======================================
|-- README.md
|-- data-source.ts
|-- eslint.config.mjs
|-- nest-cli.json
|-- package-lock.json
|-- package.json
|-- src
|   |-- app.module.ts
|   |-- config
|   |   `-- typeorm.config.ts
|   |-- database
|   |   |-- database.module.ts
|   |   |-- entities
|   |   |   `-- user.entity.ts
|   |   |-- migrations
|   |   |   `-- 1749675209864-users.ts
|   |   |-- run-seeds.ts
|   |   `-- seeds
|   |       `-- 1749675347730-default-user.ts
|   `-- main.ts
|-- tsconfig.build.json
`-- tsconfig.json

# package.json
{
  "name": "server",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "migrate:create": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create src/database/migrations/%npm_config_name%",
    "migrate:down": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert --dataSource data-source.ts",
    "migrate:run":  "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run --dataSource data-source.ts",
    "seed:create": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create src/database/seeds/%npm_config_name%",
    "seed:run": "ts-node -r tsconfig-paths/register ./src/database/run-seeds.ts"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/config": "^4.0.2",
    "@nestjs/core": "^11.0.1",
    "@nestjs/mapped-types": "*",
    "@nestjs/platform-express": "^11.0.1",
    "@nestjs/typeorm": "^11.0.0",
    "pg": "^8.16.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "typeorm": "^0.3.24"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@eslint/js": "^9.18.0",
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.1",
    "@swc/cli": "^0.6.0",
    "@swc/core": "^1.10.7",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.14",
    "@types/node": "^22.10.7",
    "@types/supertest": "^6.0.2",
    "eslint": "^9.18.0",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-prettier": "^5.2.2",
    "globals": "^16.0.0",
    "jest": "^29.7.0",
    "prettier": "^3.4.2",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.20.0"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}

# data-source.ts
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { typeOrmConfig } from './src/config/typeorm.config';

const dsOptions = {
  ...typeOrmConfig,
  entities: ['src/database/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
} as DataSourceOptions;

export const AppDataSource = new DataSource(dsOptions);

# typeorm.config.ts
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
  entities: [join(__dirname, '../database/entities/*.entity{.ts,.js}')],
  synchronize: true,
};

# user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// TODO delete this
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;
}

# database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig)],
})
export class DatabaseModule {}

# run-seeds.ts
import { AppDataSource } from '../../data-source';
import { DefaultUser1749675347730 } from './seeds/1749675347730-default-user';

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    const seed = new DefaultUser1749675347730();
    await seed.up(AppDataSource.createQueryRunner());

    console.log('Seed executed successfully!');
  } catch (error) {
    console.error('Error during seed execution:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeds();

# app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

# main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
