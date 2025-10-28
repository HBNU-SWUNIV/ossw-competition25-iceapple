import { Injectable, Logger } from '@nestjs/common';
import { Kysely } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';

import { Database } from '@/database';
import { InsertWork, UpdateWork } from '@/database/table';
import { SelectWork } from '@/database/table/work';
import type { WorkRepository } from '@/interfaces';

@Injectable()
export class AppRepository implements WorkRepository {
    private readonly logger = new Logger(AppRepository.name);

    constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

    async create(entity: InsertWork): Promise<void> {
        this.logger.debug('create');
        this.logger.debug(entity);
        await this.db.insertInto('work').values(entity).execute();
    }

    async findAll(): Promise<SelectWork[]> {
        this.logger.debug('findAll');
        const workSelects = await this.db
            .selectFrom('work')
            .selectAll()
            .orderBy('created_at', 'desc')
            .execute();
        this.logger.debug(workSelects);
        return workSelects;
    }

    async findById(id: string): Promise<SelectWork | null> {
        this.logger.debug('findById');
        const workSelect = await this.db
            .selectFrom('work')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();

        if (!workSelect) return null;

        return workSelect;
    }

    async isExist(id: string): Promise<boolean> {
        this.logger.debug('isExist');

        const result = await this.db
            .selectFrom('work')
            .select((eb) =>
                eb
                    .exists(
                        eb.selectFrom('work').select('id').where('id', '=', id),
                    )
                    .as('exists'),
            )
            .executeTakeFirst();

        return Boolean(result?.exists);
    }

    async remove(id: string): Promise<void> {
        this.logger.debug('remove');

        await this.db.deleteFrom('work').where('id', '=', id).execute();
    }

    async update(entity: UpdateWork): Promise<void> {
        this.logger.debug('update');

        await this.db
            .updateTable('work')
            .set(entity)
            .where('id', '=', entity.id)
            .execute();
    }
}
