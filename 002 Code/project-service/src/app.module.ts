import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { KyselyModule } from 'nestjs-kysely';

import { AppController } from '@/app.controller';
import { AppRepository } from '@/app.repository';
import { AppService } from '@/app.service';
import {
    MulterConfigService,
    configValidate,
    kyselyConfigFactory,
} from '@/config';
import { AppMapper, FileManager } from '@/utils';
import {AdminController} from '@/admin.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: configValidate,
        }),
        KyselyModule.forRootAsync({
            inject: [ConfigService],
            useFactory: kyselyConfigFactory,
        }),
        MulterModule.registerAsync({
            useClass: MulterConfigService,
        }),
    ],
    controllers: [AppController, AdminController],
    providers: [AppService, AppRepository, AppMapper, FileManager],
})
export class AppModule {}
