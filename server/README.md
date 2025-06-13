# Documentation for card-collection-manager Server

## Overview
The `card-collection-manager` server is a backend application built using the NestJS framework. It provides APIs and database management functionalities for managing card collections.

## Features
- User authentication and management.
- Database migrations and seeding.
- Modular architecture for scalability.
- API documentation using Swagger, accessible at [http://localhost:3000/api](http://localhost:3000/api).

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- PostgreSQL database

### Installation
1. Navigate to the server directory:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Configuration
1. Create a `.env` file in the `server` directory by copying the `.env.example` file and configure environment variables:
2. Update the `typeorm.config.ts` file in the `src/config` directory if needed.

## Running the Server
To start the server in development mode:
```sh
npm run start:dev
```

To build and start the server in production mode:
```sh
npm run build
npm run start:prod
```

## Database Management

### Migrations
Migrations are used to manage database schema changes.

#### Create a Migration
```sh
npm run migrate:create --name=<migration-name>
```

#### Generate a Migration Connected to Entities
```sh
npm run migrate:generate --name=<migration-name>
```

#### Run Migrations
```sh
npm run migrate:run
```

### Seeds
Seeds are used to populate the database with initial or test data.

#### Create a Seed
```sh
npm run seed:create --name=<seed-name>
```

#### Run Seeds
```sh
npm run seed:run
```

This structure can be generated using the following command:
```sh
tree -I 'node_modules|.git|dist'
```


### structure goal:
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
└── utils/  