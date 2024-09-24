import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface ResponseFormat<T> {
  statusCode: number;
  message: string;
  data?: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: 200,
        message: 'Success',
        data,
      })),
      catchError((error) => {
        // Handle errors and format the response
        const response = {
          statusCode: error instanceof HttpException ? error.getStatus() : 500,
          message: error.message || 'Internal Server Error',
        };
        return throwError(() => response);
      }),
    );
  }
}
