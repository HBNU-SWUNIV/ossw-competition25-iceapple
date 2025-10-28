import { MemberLike } from '@/dto';
import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
} from 'kysely';

export interface WorkTable {
    id: Generated<string>;

    name: string;

    team_name: string;

    members: JSONColumnType<MemberLike[]>;

    thumbnail: string;

    pdf_url: string;

    description: string;

    main_url: string;

    year: number;

    created_at: ColumnType<Date, string | undefined, never>;
}

export type SelectWork = Selectable<WorkTable>;
export type InsertWork = Insertable<WorkTable>;
export type UpdateWork = Updateable<WorkTable> & { id: string };
