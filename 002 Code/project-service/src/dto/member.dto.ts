import { IsString } from 'class-validator';

export class MemberDto {
    @IsString()
    name: string;

    @IsString()
    extra: string;

    static from(member: MemberDto): MemberDto {
        const newMember = new MemberDto();

        newMember.name = member.name;
        newMember.extra = member.extra;

        return newMember;
    }
}

export type MemberLike = Pick<MemberDto, 'name' | 'extra'>;
