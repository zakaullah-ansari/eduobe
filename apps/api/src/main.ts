import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import compression from 'compression';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Get config service
  const configService = app.get(ConfigService);

  // Use Pino logger
  app.useLogger(app.get(Logger));

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('EduOBE API')
      .setDescription('Outcome-Based Education & NBA Accreditation Platform API')
      .setVersion('2.0.0')
      .addBearerAuth()
      .addApiKey({ type: 'apiKey', name: 'X-Tenant-ID', in: 'header' }, 'tenant-id')
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management')
      .addTag('academic', 'Academic structure (years, departments, programs, etc.)')
      .addTag('students', 'Student management')
      .addTag('faculty', 'Faculty management')
      .addTag('courses', 'Course management')
      .addTag('attendance', 'Attendance tracking')
      .addTag('assessments', 'Assessment and marks management')
      .addTag('attainment', 'Attainment calculation and reporting')
      .addTag('reports', 'Report generation')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  // Start server
  const port = configService.get<number>('PORT', 4000);
  await app.listen(port);

  console.log(`🚀 EduOBE API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  console.log(`🏥 Health check: http://localhost:${port}/api/v1/health`);
}

bootstrap();
