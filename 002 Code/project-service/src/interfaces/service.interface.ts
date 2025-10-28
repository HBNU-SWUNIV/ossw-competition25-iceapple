import type {
    CreateWorkDto,
    PreviewWorkDto,
    RemoveWorkDto,
    UpdateWorkDto,
    WorkDto,
} from '@/dto';

export interface WorkService {
    findAll(): Promise<PreviewWorkDto[]>;
    findById(id: string): Promise<WorkDto>;
    create(createWorkDto: CreateWorkDto): Promise<void>;
    update(updateWorkDto: UpdateWorkDto): Promise<void>;
    remove(removeWorkDto: RemoveWorkDto): Promise<void>;
}
