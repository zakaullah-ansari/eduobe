import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export enum DomainEvent {
  // User events
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',

  // Student events
  STUDENT_CREATED = 'student.created',
  STUDENT_UPDATED = 'student.updated',
  STUDENT_DELETED = 'student.deleted',
  STUDENT_PROMOTED = 'student.promoted',

  // Faculty events
  FACULTY_CREATED = 'faculty.created',
  FACULTY_UPDATED = 'faculty.updated',
  FACULTY_DELETED = 'faculty.deleted',

  // Attendance events
  ATTENDANCE_MARKED = 'attendance.marked',
  ATTENDANCE_SESSION_CREATED = 'attendance.session.created',
  ATTENDANCE_SESSION_LOCKED = 'attendance.session.locked',

  // Marks events
  MARKS_ENTERED = 'marks.entered',
  MARKS_UPDATED = 'marks.updated',
  MARKS_LOCKED = 'marks.locked',

  // Attainment events
  ATTAINMENT_CALCULATED = 'attainment.calculated',
  CO_ATTAINMENT_CALCULATED = 'attainment.co.calculated',
  PO_ATTAINMENT_CALCULATED = 'attainment.po.calculated',

  // Assessment events
  ASSESSMENT_CREATED = 'assessment.created',
  ASSESSMENT_PUBLISHED = 'assessment.published',

  // Report events
  REPORT_GENERATED = 'report.generated',
  REPORT_FAILED = 'report.failed',

  // Notification events
  NOTIFICATION_CREATED = 'notification.created',
  NOTIFICATION_SENT = 'notification.sent',

  // Academic year events
  ACADEMIC_YEAR_CREATED = 'academic-year.created',
  ACADEMIC_YEAR_UPDATED = 'academic-year.updated',
  ACADEMIC_YEAR_ARCHIVED = 'academic-year.archived',

  // Department events
  DEPARTMENT_CREATED = 'department.created',
  DEPARTMENT_UPDATED = 'department.updated',
  DEPARTMENT_ARCHIVED = 'department.archived',

  // Feedback / survey events
  FEEDBACK_RECEIVED = 'feedback.received',
  SURVEY_RESPONSE_SUBMITTED = 'survey.response.submitted',

  // AI events (PR #2)
  AI_CONVERSATION_STARTED = 'ai.conversation.started',
  AI_MESSAGE_SENT = 'ai.message.sent',
  AI_RECORD_CREATED = 'ai.record.created',
  AI_RECORD_UPDATED = 'ai.record.updated',
  AI_RECORD_DELETED = 'ai.record.deleted',
  AI_FEEDBACK_RECEIVED = 'ai.feedback.received',
  AI_JOB_CREATED = 'ai.job.created',
  AI_JOB_UPDATED = 'ai.job.updated',
  AI_USAGE_LOGGED = 'ai.usage.logged',
}

@Injectable()
export class EventService {
  constructor(private eventEmitter: EventEmitter2) {}

  emit<T>(event: DomainEvent, payload: T): void {
    this.eventEmitter.emit(event, payload);
  }

  emitAsync<T>(event: DomainEvent, payload: T): Promise<any[]> {
    return this.eventEmitter.emitAsync(event, payload);
  }
}
