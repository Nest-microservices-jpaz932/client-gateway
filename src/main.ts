import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { envs } from './config/envs';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {
    const logger = new Logger('Main GateWay');
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    app.useGlobalFilters(new RpcCustomExceptionFilter());

    await app.listen(envs.port);
    logger.log(`Server is running on ${envs.port}`);
}
void bootstrap();
