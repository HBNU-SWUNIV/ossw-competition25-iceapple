import { Database } from '@/database';
import { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
    await db.schema
        .alterTable('work')
        .alterColumn('created_at', (col) => col.setDataType('timestamptz(3)'))
        .execute();
}

export async function down(db: Kysely<Database>) {
    await db.schema
        .alterTable('work')
        .alterColumn('created_at', (col) => col.setDataType('date'))
        .execute();
}
