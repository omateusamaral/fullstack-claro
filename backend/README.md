## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Docker

The Docker Compose setup starts the NestJS application and a PostgreSQL 17
database with a persistent volume:

```bash
# start the application and PostgreSQL
$ docker compose up --build

# stop the services (the database volume is preserved)
$ docker compose down
```

The API is available at `http://localhost:3001` and PostgreSQL at
`localhost:5432`. Copy `.env.example` to `.env` to override the default
development credentials and ports. The application currently exposes the
database connection settings as `POSTGRES_HOST`, `POSTGRES_PORT`,
`POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD`.

## Migrations

The project uses TypeORM migrations with `synchronize` disabled. Create an
entity under `src` with the `.entity.ts` suffix, then generate a migration
from the differences between the entities and the database:

```bash
# start PostgreSQL
$ docker compose up -d

# create a migration (the path is appended to the command)
$ npm run migration:generate -- src/database/migrations/CreateTeams

# apply pending migrations manually (the API also applies them on startup)
$ npm run migration:run

# undo the last applied migration
$ npm run migration:revert
```

Generated migrations are stored in `src/database/migrations` and must be
committed. After changing an entity, generate a new migration rather than
editing an already-applied migration. The `DataSource` loads `.env` through
`dotenv` and discovers `*.entity.ts` files automatically.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test


# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
