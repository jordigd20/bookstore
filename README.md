# Bookstore API

<p align="center">
  <a href="https://bookstore-jgd.up.railway.app/api" target="blank"><img src="https://res.cloudinary.com/dtozxzg7o/image/upload/v1703073716/asrm4vdormwpfycguopi.png" width="400" alt="Bookstore Logo" /></a>
</p>

## Description

Bookstore e-commerce API Rest built with `NestJS` and `PostreSQL`. This is a side project developed with the intention of learning and practicing new technologies I have not used before.

You can take a look at the frontend in the [bookstore-angular](https://github.com/jordigd20/bookstore-angular) repository, and the [API Documentation](https://bookstore-jgd.up.railway.app/api) built with Swagger.

> [!NOTE]
> Please note that this project has been developed for educational purposes only and does not support real transactions.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostreSQL](https://www.postgresql.org/)
- **Unit testing**: [Jest](https://jestjs.io/)
- **Payments**: [Stripe](https://stripe.com/)
- **Emails**: [Brevo](https://www.brevo.com/)
- **API Documentation**: [Swagger](https://swagger.io/)
- **Production deployment**: [Railway](https://railway.app/)

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
