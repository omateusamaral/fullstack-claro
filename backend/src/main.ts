import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomLogger } from './commons/logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new CustomLogger(),
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('Claro API')
        .setDescription('Documentação da API da Claro')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
