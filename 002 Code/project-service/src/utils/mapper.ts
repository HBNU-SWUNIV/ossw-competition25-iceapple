import { Injectable } from '@nestjs/common';

import { InsertWork, SelectWork, UpdateWork } from '@/database/table';
import { CreateWorkDto, PreviewWorkDto, UpdateWorkDto, WorkDto } from '@/dto';
import type { WorkMapper } from '@/interfaces';

@Injectable()
export class AppMapper implements WorkMapper {
    toDto(select: SelectWork): WorkDto {
        return {
            id: select.id,
            name: select.name,
            team_name: select.team_name,
            members: select.members,
            description: select.description,
            main_url: select.main_url,
            pdf_url: select.pdf_url,
            year: select.year,
        };
    }

    toPreviewDto(entity: SelectWork): PreviewWorkDto {
        const dto = new PreviewWorkDto();

        dto.id = entity.id;
        dto.name = entity.name;
        dto.members = entity.members;
        dto.description = entity.description;
        dto.thumbnail = entity.thumbnail;
        dto.year = entity.year;

        return dto;
    }

    toInsert(dto: CreateWorkDto): InsertWork {
        return {
            name: dto.name,
            team_name: dto.team_name,
            members: JSON.stringify(dto.members),
            thumbnail: dto.thumbnail.filename,
            description: dto.description,
            main_url: dto.main_url,
            pdf_url: dto.pdf.filename,
            year: dto.year,
        };
    }

    toUpdate(dto: UpdateWorkDto): UpdateWork {
        return {
            id: dto.id,
            name: dto.name,
            team_name: dto.team_name,
            description: dto.description,
            members: JSON.stringify(dto.members),
            thumbnail: dto.thumbnail?.filename,
            pdf_url: dto.pdf?.filename,
            year: dto.year,
        };
    }
}
