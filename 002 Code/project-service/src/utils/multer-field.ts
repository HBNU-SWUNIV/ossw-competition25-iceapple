import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export function getWorkFileFields(): MulterField[] {
    return [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'pdf', maxCount: 1 },
    ];
}
