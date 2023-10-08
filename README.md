<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

API Rest devloped using `Nest` and `Prisma` with PostgreSQL.

## Installation

```bash
$ pnpm install
```

## Developing environment

1. Clonate the file `.env.template` and rename the copy to `.env`
2. Set the environment variables defined `.env`
3. Start the `PostgreSQL` database

```bash
# You can use the docker-compose to run the db
docker-compose up -d
```

4. Synchronize the `Prisma` schema with the `PostgreSQL` schema
```bash
npx prisma db push
```

5. Seed the database with mock data
```bash
npx prisma db seed
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
