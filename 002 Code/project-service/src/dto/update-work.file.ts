import { CreateWorkFile } from '@/dto/create-work.file';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWorkFile extends PartialType(CreateWorkFile) {}
