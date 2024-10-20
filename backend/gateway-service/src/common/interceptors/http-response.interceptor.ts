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
export class HttpResponseInterceptor<T> implements NestInterceptor {
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
        const statusCode =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        // Custom handling for BadRequestException
        let message = 'Internal Server Error';
        if (statusCode === HttpStatus.BAD_REQUEST) {
          if (Array.isArray(error.response?.message)) {
            message = error.response.message.join(', ');
          } else {
            message = error.response.message || 'Validation Error';
          }
        } else {
          message = error.message || 'Internal Server Error';
        }
        const response = {
          statusCode,
          message,
        };

        return throwError(() => response);
      }),
    );
  }
}
