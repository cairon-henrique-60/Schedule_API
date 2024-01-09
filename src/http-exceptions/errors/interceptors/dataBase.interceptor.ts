import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { QueryFailedError } from 'typeorm';

import { DataBaseError } from '../types/DataBaseError';

@Injectable()
export class DataBaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof QueryFailedError) {
          throw new ConflictException(error.message);
        } else if (error instanceof DataBaseError) {
          throw new ConflictException(error.message);
        }
        throw error;
      }),
    );
  }
}
