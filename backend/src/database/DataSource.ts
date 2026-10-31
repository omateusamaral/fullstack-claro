import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [__dirname + '/../**/*.entity{.js,.ts}'],
    migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
    synchronize: false,
    migrationsRun: true,
    migrationsTableName: 'migrations',
    migrationsTransactionMode: 'each',
});
