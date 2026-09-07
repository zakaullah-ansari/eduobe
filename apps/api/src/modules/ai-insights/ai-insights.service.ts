import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiGatewayService } from '../ai-engine/ai-gateway.service';
import { InsightsQueryDto, SentimentSummaryDto } from './dto/ai-insights.dto';

@Injectable()
export class AiInsightsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AiGatewayService,
  ) {}

  async insights(tenantId: string, query: InsightsQueryDto) {
    const days = query.days ?? 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const where: any = { tenantId, createdAt: { gte: since } };
    if (query.courseOfferingId) where.courseOfferingId = query.courseOfferingId;

    const [sentiments, feedbacks, ratings, mostNegative, mostPositive] = await Promise.all([
      this.prisma.sentimentAnalysis.groupBy({
        by: ['sentiment'],
        where,
        _count: { _all: true },
      }),
      this.prisma.aIFeedback.count({ where: { tenantId, createdAt: { gte: since } } }),
      this.prisma.aIFeedback.aggregate({
        where: { tenantId, createdAt: { gte: since }, rating: { not: null } },
        _avg: { rating: true },
      }),
      this.prisma.sentimentAnalysis.findMany({
        where: { ...where, sentiment: 'negative' },
        orderBy: { analyzedAt: 'desc' },
        take: 5,
      }),
      this.prisma.sentimentAnalysis.findMany({
        where: { ...where, sentiment: 'positive' },
        orderBy: { analyzedAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      sentimentDistribution: sentiments.map((s) => ({
        sentiment: s.sentiment,
        count: s._count._all,
      })),
      feedbackCount: feedbacks,
      averageRating: ratings._avg.rating ?? 0,
      recentNegative: mostNegative,
      recentPositive: mostPositive,
    };
  }

  async sentimentSummary(tenantId: string, dto: SentimentSummaryDto) {
    const rows =
      dto.sentiments ??
      (await this.prisma.sentimentAnalysis.findMany({
        where: { tenantId, ...(dto.context?.courseOfferingId ? { courseOfferingId: dto.context.courseOfferingId } : {}) },
        orderBy: { analyzedAt: 'desc' },
        take: 200,
      }));

    const gatewayResult = await this.gateway.invoke('insights', {
      tenantId,
      action: 'sentiment-summary',
      sentiments: rows,
    });

    return gatewayResult;
  }
}
