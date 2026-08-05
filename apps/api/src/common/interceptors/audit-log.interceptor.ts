import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EventService, DomainEvent } from '../../modules/event/event.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private eventService: EventService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;

    // Only log mutations (POST, PUT, PATCH, DELETE)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap((response) => {
          this.eventService.emit(DomainEvent.USER_UPDATED, {
            action: method,
            url,
            body: this.sanitizeBody(body),
            userId: user?.id,
            tenantId: user?.tenantId,
            timestamp: new Date().toISOString(),
          });
        }),
      );
    }

    return next.handle();
  }

  private sanitizeBody(body: any): any {
    if (!body) return {};

    // Remove sensitive fields
    const sanitized = { ...body };
    delete sanitized.password;
    delete sanitized.passwordHash;
    delete sanitized.twoFactorSecret;
    delete sanitized.refreshToken;

    return sanitized;
  }
}
