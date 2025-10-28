import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from '@/app.module';
import {
    APP_PREFIX,
    Environment,
    EnvironmentVariables,
    FILE_SERVE_PREFIX,
    FILE_UPLOAD_PATH,
} from '@/config';
import { CustomExceptionFilter } from '@/filter';
import { serveFileMiddleware } from '@/middleware';
import { requestLogMiddleware } from '@/middleware/request-log-middleware';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const configService =
        app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

    const port = configService.get<number>('PORT');

    let STATIC_ASSET_PREFIX: string = FILE_SERVE_PREFIX;

    if (configService.get<Environment>('NODE_ENV') === 'production') {
        app.setGlobalPrefix(APP_PREFIX);
        STATIC_ASSET_PREFIX = `/${APP_PREFIX}${FILE_SERVE_PREFIX}/`;
    }

    app.enableCors({
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Accept'],
    });
    app.use(requestLogMiddleware);
    app.use(STATIC_ASSET_PREFIX, serveFileMiddleware);
    app.useStaticAssets(FILE_UPLOAD_PATH, {
        prefix: STATIC_ASSET_PREFIX,
    });

    app.useGlobalFilters(new CustomExceptionFilter());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
    await app.listen(port);
}

void bootstrap();
