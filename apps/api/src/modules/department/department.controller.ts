import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentQueryDto } from './dto/department.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('Departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Permissions('department:create')
  @ApiOperation({ summary: 'Create department' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateDepartmentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.departmentService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('department:read')
  @ApiOperation({ summary: 'Get all departments' })
  findAll(@TenantId() tenantId: string, @Query() query: DepartmentQueryDto) {
    return this.departmentService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('department:read')
  @ApiOperation({ summary: 'Get department by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.departmentService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('department:update')
  @ApiOperation({ summary: 'Update department' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.departmentService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('department:delete')
  @ApiOperation({ summary: 'Archive department' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.departmentService.remove(tenantId, id, userId);
  }
}
