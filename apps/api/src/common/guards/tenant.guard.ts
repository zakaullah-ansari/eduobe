import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Extract tenant from user (JWT) or header
    const tenantId = user?.tenantId || request.headers['x-tenant-id'];

    if (!tenantId) {
      throw new BadRequestException('Tenant ID is required');
    }

    // Attach tenant to request
    request.tenantId = tenantId;

    return true;
  }
}
