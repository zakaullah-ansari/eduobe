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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AcademicYearService } from './academic-year.service';
import { CreateAcademicYearDto, UpdateAcademicYearDto, AcademicYearQueryDto } from './dto/academic-year.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('Academic Years')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('academic-years')
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) {}

  @Post()
  @Permissions('academic-year:create')
  @ApiOperation({ summary: 'Create academic year' })
  @ApiResponse({ status: 201, description: 'Academic year created' })
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateAcademicYearDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.academicYearService.create(tenantId, dto, userId);
  }

  @Get()
  @Permissions('academic-year:read')
  @ApiOperation({ summary: 'Get all academic years' })
  findAll(@TenantId() tenantId: string, @Query() query: AcademicYearQueryDto) {
    return this.academicYearService.findAll(tenantId, query);
  }

  @Get(':id')
  @Permissions('academic-year:read')
  @ApiOperation({ summary: 'Get academic year by ID' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.academicYearService.findOne(tenantId, id);
  }

  @Patch(':id')
  @Permissions('academic-year:update')
  @ApiOperation({ summary: 'Update academic year' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAcademicYearDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.academicYearService.update(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @Permissions('academic-year:delete')
  @ApiOperation({ summary: 'Archive academic year' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.academicYearService.remove(tenantId, id, userId);
  }

  @Post(':id/set-current')
  @Permissions('academic-year:update')
  @ApiOperation({ summary: 'Set academic year as current' })
  setCurrent(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.academicYearService.setCurrent(tenantId, id, userId);
  }
}
