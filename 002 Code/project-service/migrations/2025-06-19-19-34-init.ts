import { Database } from '@/database';
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
    await db.schema
        .createTable('work')
        .addColumn('id', 'uuid', (col) =>
            col.primaryKey().defaultTo(sql`gen_random_uuid()`),
        )
        .addColumn('name', 'varchar(255)', (col) => col.notNull())
        .addColumn('team_name', 'varchar(255)', (col) => col.notNull())
        .addColumn('members', 'jsonb', (col) => col.notNull())
        .addColumn('thumbnail', 'varchar(255)')
        .addColumn('pdf_url', 'varchar(255)')
        .addColumn('description', 'text')
        .addColumn('year', 'integer')
        .addColumn('main_url', 'varchar(255)')
        .addColumn('created_at', 'date', (col) => col.defaultTo(sql`now()`))
        .execute();
}

export async function down(db: Kysely<Database>) {
    await db.schema.dropTable('work').execute();
}
