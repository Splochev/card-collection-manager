# Documentation for card-collection-manager Server

## Overview
The `card-collection-manager` server is a backend application built using the NestJS framework. It provides APIs and database management functionalities for managing card collections.

## Features
- User authentication and management.
- Database migrations and seeding.
- Modular architecture for scalability.

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- PostgreSQL database

### Installation
1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the server directory:
   ```sh
   cd server
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

### Configuration
1. Create a `.env` file in the `server` directory and configure the following environment variables:
   ```env
   DATABASE_HOST=<your-database-host>
   DATABASE_PORT=<your-database-port>
   DATABASE_USER=<your-database-user>
   DATABASE_PASSWORD=<your-database-password>
   DATABASE_NAME=<your-database-name>
   ```
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
