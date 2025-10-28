import { ConfigService } from '@nestjs/config';
import { KyselyConfig, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { EnvironmentVariables } from '@/config/environments-variables';

export function kyselyConfigFactory(
    configService: ConfigService<EnvironmentVariables, true>,
): KyselyConfig {
    return {
        dialect: new PostgresDialect({
            pool: new Pool({
                database: configService.get('DB_NAME'),
                host: configService.get('DB_HOST'),
                user: configService.get('DB_USER'),
                password: configService.get('DB_PASSWORD'),
                port: configService.get('DB_PORT'),
                max: 10,
            }),
        }),
    };
}
