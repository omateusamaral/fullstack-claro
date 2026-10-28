import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomLogger } from './commons/logger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './commons/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new CustomLogger(),
    });
    const config = new DocumentBuilder()
        .setTitle('Claro API')
        .setDescription('Documentação da API da Claro')
        .setVersion('1.0')
        .build();

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.setGlobalPrefix('api');

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
