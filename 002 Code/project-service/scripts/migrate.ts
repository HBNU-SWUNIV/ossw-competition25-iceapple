import 'dotenv/config';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';
import { configValidate } from '@/config';
import { Database } from '@/database';
import {
    FileMigrationProvider,
    Kysely,
    MigrationResult,
    Migrator,
    PostgresDialect,
} from 'kysely';
import { Pool } from 'pg';

async function migrate() {
    const config = configValidate(process.env);

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({
            pool: new Pool({
                host: config.DB_HOST,
                database: config.DB_NAME,
                port: config.DB_PORT,
                user: config.DB_USER,
                password: config.DB_PASSWORD,
            }),
        }),
    });

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: path.join(path.resolve(), 'migrations'),
        }),
    });

    await migrator.migrateToLatest();

    const { error, results } = await migrator.migrateToLatest();

    if (results) printResults(results);

    if (error) {
        console.error('failed to migrate');
        console.error(error);
        process.exit(1);
    }

    await db.destroy();
}

function printResults(results: MigrationResult[]): void {
    for (const result of results) {
        if (result.status === 'Success')
            console.log(
                `migration "${result.migrationName}" was executed successfully`,
            );
        else if (result.status === 'Error')
            console.error(
                `failed to execute migration "${result.migrationName}"`,
            );
    }
}

migrate()
    .then(() => console.info('successfully migrated'))
    .catch((err) => console.error('migration Error', err));
