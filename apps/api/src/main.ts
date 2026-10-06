import 'reflect-metadata';
import { mkdirSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { config } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  mkdirSync(config.uploadDir, { recursive: true });
  app.useStaticAssets(config.uploadDir, { prefix: '/api/uploads', maxAge: '30d', immutable: true });

  if (!config.isProduction) {
    const doc = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('IC Klima Service API').setVersion('1.0').build(),
    );
    SwaggerModule.setup('api/docs', app, doc);
  }

  await app.listen(config.port, '0.0.0.0');
  console.log(`API listening on http://localhost:${config.port}/api`);
}

bootstrap();
