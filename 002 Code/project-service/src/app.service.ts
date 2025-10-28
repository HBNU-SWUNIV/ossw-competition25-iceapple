import { Injectable, Logger } from '@nestjs/common';

import { AppRepository } from '@/app.repository';
import type {
    CreateWorkDto,
    PreviewWorkDto,
    RemoveWorkDto,
    UpdateWorkDto,
    WorkDto,
} from '@/dto';
import { WorkNotFoundException } from '@/exceptions';
import type { WorkService } from '@/interfaces';
import { AppMapper } from '@/utils';
import { FileManager } from '@/utils/file';

@Injectable()
export class AppService implements WorkService {
    private readonly logger = new Logger(AppService.name);

    constructor(
        private readonly mapper: AppMapper,
        private readonly repository: AppRepository,
        private readonly fileManager: FileManager,
    ) {}

    async create(createWorkDto: CreateWorkDto): Promise<void> {
        this.logger.debug('create');
        this.logger.debug(createWorkDto);
        const entity = this.mapper.toInsert(createWorkDto);
        this.logger.debug(entity);
        await this.repository.create(entity);
    }

    async findAll(): Promise<PreviewWorkDto[]> {
        this.logger.debug('findAll');
        const works = await this.repository.findAll();

        return works.map((work) => this.mapper.toPreviewDto(work));
    }

    async findById(id: string): Promise<WorkDto> {
        this.logger.debug('findById');
        const work = await this.repository.findById(id);

        if (!work) throw new WorkNotFoundException(id);

        return this.mapper.toDto(work);
    }

    async update(updateWorkDto: UpdateWorkDto): Promise<void> {
        this.logger.debug('update');
        this.logger.debug(updateWorkDto);
        const entity = await this.repository.findById(updateWorkDto.id);
        if (!entity) throw new WorkNotFoundException(updateWorkDto.id);

        const updatedEntity = this.mapper.toUpdate(updateWorkDto);
        this.logger.debug(updatedEntity);

        const targetFileNames: string[] = [];

        if (updatedEntity.thumbnail) targetFileNames.push(entity.thumbnail);
        if (updatedEntity.pdf_url) targetFileNames.push(entity.pdf_url);

        const promises: Promise<void>[] = targetFileNames.map(async (name) =>
            this.fileManager.deleteFile(name),
        );

        await Promise.all(promises);

        await this.repository.update(updatedEntity);
    }

    async remove(removeWorkDto: RemoveWorkDto): Promise<void> {
        this.logger.debug('remove');
        const entity = await this.repository.findById(removeWorkDto.id);
        if (!entity) throw new WorkNotFoundException(removeWorkDto.id);

        const targetFileNames = [entity.pdf_url, entity.thumbnail];

        const promises = targetFileNames.map(async (name) =>
            this.fileManager.deleteFile(name),
        );

        await Promise.allSettled(promises);

        await this.repository.remove(entity.id);
    }
}
