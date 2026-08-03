import { PrismaClient } from '@prisma/client';

/**
 * PrismaService - Base database service
 * Handles connection lifecycle and cleanup
 */
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async cleanDatabase(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('cleanDatabase is only available in test environment');
    }

    // Delete in order of dependencies
    const models = [
      'notification',
      'auditLog',
      'surveyResponse',
      'survey',
      'document',
      'contentBeyondSyllabus',
      'advancedLearner',
      'remedialSession',
      'slowLearner',
      'psoAttainment',
      'poAttainment',
      'coAttainment',
      'attainmentConfig',
      'marks',
      'questionPaper',
      'questionBank',
      'assessment',
      'assessmentType',
      'practicalPlan',
      'teachingPlan',
      'attendanceRecord',
      'attendanceSession',
      'academicCalendar',
      'coPSOMapping',
      'coPOMapping',
      'programSpecificOutcome',
      'programOutcome',
      'courseOutcome',
      'courseEnrollment',
      'labBatch',
      'courseOffering',
      'section',
      'batch',
      'course',
      'semester',
      'curriculum',
      'courseType',
      'academicYear',
      'program',
      'department',
      'student',
      'faculty',
      'userRole',
      'rolePermission',
      'refreshToken',
      'role',
      'permission',
      'user',
      'tenant',
    ] as const;

    for (const model of models) {
      // @ts-expect-error - Dynamic model access
      await this[model].deleteMany();
    }
  }
}
