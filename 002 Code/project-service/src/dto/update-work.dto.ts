import { CreateWorkDto, type UpdateWorkBody, type UpdateWorkFile } from '@/dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWorkDto extends PartialType(CreateWorkDto) {
    id: string;

    constructor(id: string, body: UpdateWorkBody, file: UpdateWorkFile) {
        super();
        this.id = id;
        this.name = body.name;
        this.members = body.members;
        this.description = body.description;
        this.year = body.year;
        this.thumbnail = file.thumbnail;
        this.pdf = file.pdf;
    }
}
