import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker, Job } from 'bullmq';
import { RedisService } from '../redis/redis.service';

export enum QueueName {
  REPORTS = 'reports',
  EMAILS = 'emails',
  BULK_IMPORT = 'bulk-import',
  ATTAINMENT = 'attainment',
  ATTENDANCE_ALERT = 'attendance-alert',
}

@Injectable()
export class QueueService {
  private queues: Map<QueueName, Queue> = new Map();

  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
  ) {
    this.initializeQueues();
  }

  private initializeQueues() {
    const connection = this.redisService.getClient();

    Object.values(QueueName).forEach((queueName) => {
      const queue = new Queue(queueName, { connection });
      this.queues.set(queueName, queue);
    });
  }

  getQueue(name: QueueName): Queue {
    const queue = this.queues.get(name);
    if (!queue) {
      throw new Error(`Queue ${name} not found`);
    }
    return queue;
  }

  async addJob<T>(
    queueName: QueueName,
    jobName: string,
    data: T,
    options?: {
      delay?: number;
      priority?: number;
      attempts?: number;
      backoff?: { type: 'exponential' | 'fixed'; delay: number };
    },
  ): Promise<Job<T>> {
    const queue = this.getQueue(queueName);
    return queue.add(jobName, data, {
      attempts: options?.attempts || 3,
      backoff: options?.backoff || { type: 'exponential', delay: 1000 },
      delay: options?.delay,
      priority: options?.priority,
    });
  }

  async getJob(queueName: QueueName, jobId: string): Promise<Job | undefined> {
    const queue = this.getQueue(queueName);
    return queue.getJob(jobId);
  }

  async getJobCounts(queueName: QueueName) {
    const queue = this.getQueue(queueName);
    return queue.getJobCounts();
  }
}
