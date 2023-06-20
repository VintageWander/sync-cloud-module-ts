import {
  CallHandler,
  ConsoleLogger,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: ConsoleLogger = new ConsoleLogger('LOG'),
  ) {
    this.logger.setContext('LOG');
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const { logger } = this;

    const { method, url, body } = context.switchToHttp().getRequest<Request>();

    const now = Date.now();

    const logContext = `${method} - ${url}`;

    logger.log(`Time taken ${Date.now() - now}ms.`, logContext);

    if (method !== 'GET') {
      logger.log('Request Body:', logContext);
      console.log(body);
    }

    return next.handle().pipe(
      tap({
        next: (response: Response) => {
          logger.log(`[${response.statusCode}]`, logContext);
        },
        error: (exception: unknown) => {
          let status = 500;
          let message = 'Unknown error occured';
          let cause: string | object = 'Internal server error';

          if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
            // @ts-ignore
            cause = exception.response.error;
          }

          logger.error(`[${status}] Response body:`, logContext);
          console.error({ status, message, data: null, cause });
        },
      }),
    );
  }
}
