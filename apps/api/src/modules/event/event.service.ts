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
