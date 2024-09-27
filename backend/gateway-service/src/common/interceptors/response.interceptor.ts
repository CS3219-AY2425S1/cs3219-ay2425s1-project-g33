import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface ResponseFormat<T> {
  statusCode: number;
  message: string;
  data?: T;
  error?: { [key: string]: any };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: HttpStatus.OK,
        message: 'Success',
        data,
      })),
      catchError((error) => {
        // Handle errors and format the response
        const statusCode =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = error.message || 'Internal Server Error';

        const response = {
          statusCode,
          message,
          error: error.response || error.stack || null,
        };

        return throwError(() => response);
      }),
    );
  }
}
