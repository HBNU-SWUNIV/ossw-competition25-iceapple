import { CreateWorkBody } from '@/dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWorkBody extends PartialType(CreateWorkBody) {}
