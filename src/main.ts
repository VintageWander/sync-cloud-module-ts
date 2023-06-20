import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { Environment, envConsts } from './env/env.entity';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { envLog, logLevel } from './env/env.logger';
import { initSwagger } from './swagger/swagger.init';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: envLog,
  });

  const config = app.get(EnvService);
  const log = config.get(envConsts.LOG);

  const logger = new ConsoleLogger('LOG', {
    logLevels: log ? logLevel : [],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
    }),
  );

  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  const node_env = config.get(envConsts.ENVIRONMENT);

  if (node_env === Environment.Development) {
    const swagger = initSwagger();
    const document = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup('docs', app, document);
  }

  const port = config.get(envConsts.PORT);

  await app.listen(port);
}
bootstrap();
