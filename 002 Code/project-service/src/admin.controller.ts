import { AppService } from '@/app.service';
import {
    CreateWorkBody,
    CreateWorkDto,
    CreateWorkFile,
    RemoveWorkDto,
    UpdateWorkBody,
    UpdateWorkDto,
    UpdateWorkFile,
} from '@/dto';
import { FormDataOnlyGuard } from '@/guard';
import {
    CreateWorkFileValidationPipe,
    UpdateWorkFileValidationPipe,
} from '@/pipe';
import type { GetDetailWorkResponse, GetWorksResponse } from '@/responses';
import { getWorkFileFields } from '@/utils';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('admin/works')
export class AdminController {
    private readonly logger = new Logger(AdminController.name);

    constructor(private readonly service: AppService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<GetWorksResponse> {
        this.logger.debug('findAll');
        const works = await this.service.findAll();

        return {
            works,
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(
        @Param('id', new ParseUUIDPipe()) id: string,
    ): Promise<GetDetailWorkResponse> {
        this.logger.debug('findById');
        const work = await this.service.findById(id);

        return {
            work,
        };
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(FormDataOnlyGuard)
    @UseInterceptors(FileFieldsInterceptor(getWorkFileFields()))
    async create(
        @Body() createWorkBody: CreateWorkBody,
        @UploadedFiles(new CreateWorkFileValidationPipe())
        creatWorkFile: CreateWorkFile,
    ) {
        this.logger.debug('create');
        this.logger.debug(creatWorkFile);

        const dto = new CreateWorkDto(createWorkBody, creatWorkFile);

        await this.service.create(dto);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(FormDataOnlyGuard)
    @UseInterceptors(FileFieldsInterceptor(getWorkFileFields()))
    async update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateWorkBody: UpdateWorkBody,
        @UploadedFiles(new UpdateWorkFileValidationPipe())
        updateWorkFile: UpdateWorkFile,
    ) {
        this.logger.debug('update');
        this.logger.debug(updateWorkFile);

        const dto = new UpdateWorkDto(id, updateWorkBody, updateWorkFile);

        await this.service.update(dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        this.logger.debug('remove');
        const dto = new RemoveWorkDto(id);

        await this.service.remove(dto);
    }
}
