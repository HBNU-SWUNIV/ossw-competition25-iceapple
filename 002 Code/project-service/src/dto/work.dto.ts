import { MemberDto } from '@/dto/member.dto';

export class WorkDto {
    id: string;
    name: string;
    team_name: string;
    members: MemberDto[];
    pdf_url: string;
    description: string;
    main_url: string;
    year: number;
}
