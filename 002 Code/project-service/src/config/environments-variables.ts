import { IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';

import { Type } from 'class-transformer';
import { Environment } from './environment.enum';

export class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(65535)
    PORT: number;

    @IsString()
    DB_NAME: string;

    @IsString()
    DB_USER: string;

    @IsString()
    DB_PASSWORD: string;

    @IsString()
    DB_HOST: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(65535)
    DB_PORT: number;
}
