import { AppService } from '@/app.service';
import type { GetDetailWorkResponse, GetWorksResponse } from '@/responses';
import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param,
    ParseUUIDPipe,
} from '@nestjs/common';

@Controller('works')
export class AppController {
    private readonly logger = new Logger(AppController.name);

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
}
