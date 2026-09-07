import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsQueryDto } from './dto/ai-analytics.dto';

@Injectable()
export class AiAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async overview(tenantId: string, query: AnalyticsQueryDto) {
    const days = query.days ?? 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const where: any = {
      tenantId,
      createdAt: { gte: since },
    };
    if (query.feature) where.feature = query.feature;

    const [total, success, failed, tokens, features, cost] = await Promise.all([
      this.prisma.aIUsageLog.count({ where }),
      this.prisma.aIUsageLog.count({ where: { ...where, status: 'success' } }),
      this.prisma.aIUsageLog.count({ where: { ...where, status: 'failed' } }),
      this.prisma.aIUsageLog.aggregate({
        where,
        _sum: { inputTokens: true, outputTokens: true },
      }),
      this.prisma.aIUsageLog.groupBy({
        by: ['feature'],
        where,
        _count: { _all: true },
        _sum: { inputTokens: true, outputTokens: true },
        orderBy: { _count: { feature: 'desc' } },
      }),
      this.prisma.aIUsageLog.aggregate({
        where,
        _sum: { cost: true },
      }),
    ]);

    return {
      period: { days, since: since.toISOString() },
      totals: {
        requests: total,
        success,
        failed,
        successRate: total ? Number(((success / total) * 100).toFixed(2)) : 0,
        inputTokens: tokens._sum.inputTokens ?? 0,
        outputTokens: tokens._sum.outputTokens ?? 0,
        estimatedCost: cost._sum.cost ?? 0,
      },
      topFeatures: features.map((f) => ({
        feature: f.feature,
        requests: f._count._all,
        inputTokens: f._sum.inputTokens ?? 0,
        outputTokens: f._sum.outputTokens ?? 0,
      })),
    };
  }

  async dailyBreakdown(tenantId: string, query: AnalyticsQueryDto) {
    const days = query.days ?? 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const logs = await this.prisma.aIUsageLog.findMany({
      where: { tenantId, createdAt: { gte: since }, ...(query.feature ? { feature: query.feature } : {}) },
      select: { createdAt: true, status: true, latencyMs: true },
      orderBy: { createdAt: 'asc' },
    });

    const buckets = new Map<string, { requests: number; success: number; failed: number; totalLatency: number }>();
    for (const log of logs) {
      const day = log.createdAt.toISOString().slice(0, 10);
      const bucket = buckets.get(day) ?? { requests: 0, success: 0, failed: 0, totalLatency: 0 };
      bucket.requests += 1;
      if (log.status === 'success') bucket.success += 1;
      if (log.status === 'failed') bucket.failed += 1;
      bucket.totalLatency += log.latencyMs ?? 0;
      buckets.set(day, bucket);
    }

    return Array.from(buckets.entries()).map(([day, b]) => ({
      day,
      requests: b.requests,
      success: b.success,
      failed: b.failed,
      avgLatencyMs: b.requests ? Math.round(b.totalLatency / b.requests) : 0,
    }));
  }
}
