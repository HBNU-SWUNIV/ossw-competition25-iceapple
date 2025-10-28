import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { FILE_UPLOAD_PATH } from '@/config';

@Injectable()
export class FileManager {
    private readonly logger = new Logger(FileManager.name);
    private readonly UPLOAD_PATH = path.join(path.resolve(), FILE_UPLOAD_PATH);

    async deleteFile(fileName: string): Promise<void> {
        const filePath = path.join(this.UPLOAD_PATH, fileName);

        try {
            await fs.unlink(filePath);
            this.logger.debug(`File Deleted Successfully - ${filePath}`);
        } catch (error) {
            if (this.isErrnoException(error) && error.code === 'ENOENT')
                return this.logger.warn(`file Not Exists - ${filePath}`);
            throw new InternalServerErrorException();
        }
    }

    private isErrnoException(error: unknown): error is NodeJS.ErrnoException {
        return typeof error === 'object' && error !== null && 'code' in error;
    }
}
