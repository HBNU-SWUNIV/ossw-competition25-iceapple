import { MemberDto } from '@/dto/member.dto';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
    IsArray,
    IsNumber,
    IsString,
    IsUrl,
    Length,
    MinLength,
    ValidateNested,
} from 'class-validator';

export class CreateWorkBody {
    @IsString()
    @Length(1, 255)
    name: string;

    @IsString()
    @Length(1, 255)
    team_name: string;

    @Transform(({ value }) => {
        try {
            return plainToInstance(MemberDto, JSON.parse(value));
        } catch {
            return [];
        }
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberDto)
    members: MemberDto[];

    @IsString()
    description: string;

    @IsString()
    @IsUrl()
    main_url: string;

    @Type(() => Number)
    @IsNumber()
    year: number;
}
