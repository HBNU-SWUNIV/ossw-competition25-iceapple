import { CreateWorkBody, CreateWorkFile, MemberDto } from '@/dto';

export class CreateWorkDto {
    name: string;
    team_name: string;
    members: MemberDto[];
    description: string;
    main_url: string;
    year: number;
    thumbnail: Express.Multer.File;
    pdf: Express.Multer.File;

    constructor(body: CreateWorkBody, file: CreateWorkFile) {
        this.name = body.name;
        this.team_name = body.team_name;
        this.members = body.members;
        this.description = body.description;
        this.main_url = body.main_url;
        this.year = body.year;
        this.thumbnail = file.thumbnail;
        this.pdf = file.pdf;
    }
}
