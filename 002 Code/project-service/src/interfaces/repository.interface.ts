import { InsertWork, SelectWork, UpdateWork } from '@/database/table';

export interface WorkRepository {
    findAll(): Promise<SelectWork[]>;
    findById(id: string): Promise<SelectWork | null>;
    isExist(id: string): Promise<boolean>;
    create(entity: InsertWork): Promise<void>;
    update(entity: UpdateWork): Promise<void>;
    remove(id: string): Promise<void>;
}
