import { MemberDto } from '@/dto/member.dto';

export class PreviewWorkDto {
    id: string;
    name: string;
    members: MemberDto[];
    description: string;
    thumbnail: string;
    year: number;
}
