import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { CreateWorkFile } from '@/dto';

@Injectable()
export class CreateWorkFileValidationPipe implements PipeTransform {
    transform(value: CreateWorkFile) {
        const errors: string[] = [];
        const { thumbnail, pdf } = value;

        if (!thumbnail) {
            errors.push('thumbnail file is required');
        }

        if (!thumbnail || !thumbnail[0].mimetype.startsWith('image/')) {
            errors.push('thumbnail must be an image file');
        }

        if (!pdf) {
            errors.push('pdf file is required');
        }

        if (!pdf || pdf[0].mimetype !== 'application/pdf') {
            errors.push('pdf must be a PDF file');
        }

        if (errors.length > 0) throw new BadRequestException(errors);

        return {
            thumbnail: thumbnail[0],
            pdf: pdf[0],
        };
    }
}
