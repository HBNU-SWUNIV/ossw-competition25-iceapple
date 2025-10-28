import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import { ServiceExceptionResponse } from '@/responses';
import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

type NestJsExceptionResponse = {
    message: string | string[];
    statusCode: number;
    error: string;
};

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger('ExceptionFilter');

    async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        let error: string;
        let status: HttpStatus;
        let message: string | string[];

        if (request.files) await this.deleteUploadedFiles(request.files);

        if (exception instanceof HttpException) {
            const response = exception.getResponse() as NestJsExceptionResponse;

            if (exception instanceof BadRequestException)
                message = response.message;
            else message = exception.message;

            status = exception.getStatus();
            error = response.error;
        } else {
            error = 'Internal Server Error';
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
            this.logger.error(exception);
        }

        const body: ServiceExceptionResponse = {
            status,
            message,
            error,
            path: request.url,
        };

        response.status(status).json(body);
    }

    private async deleteUploadedFiles(
        files: Record<string, Express.Multer.File[]> | Express.Multer.File[],
    ) {
        const deletePromises: Promise<void>[] = [];

        if (Array.isArray(files)) {
            for (const file of files)
                deletePromises.push(this.unlinkFile(file.path));
        } else if (typeof files === 'object') {
            for (const fieldName in files) {
                for (const file of files[fieldName])
                    deletePromises.push(this.unlinkFile(file.path));
            }
        }

        await Promise.allSettled(deletePromises);
    }

    private async unlinkFile(filePath: string): Promise<void> {
        try {
            if (fs.existsSync(filePath)) {
                await fsp.unlink(filePath);
                this.logger.debug(
                    `Successfully deleted uploaded file: ${filePath}`,
                );
            } else {
                this.logger.warn(`not exist to delete: ${filePath}`);
            }
        } catch (err) {
            this.logger.error(err);
        }
    }
}
