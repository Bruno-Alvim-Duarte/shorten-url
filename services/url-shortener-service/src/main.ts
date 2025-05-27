import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { validateEnv } from './config/env';
import * as YAML from 'yamljs';

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setDescription('API para encurtar URLs')
    .setVersion('1.0')
    .addTag('urls')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const swaggerDocument = YAML.load('./public/openapi.yaml');
  SwaggerModule.setup('api-gateway/docs', app, swaggerDocument);

  await app.listen(process.env.PORT);
}
bootstrap();
