import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';

// Config
import { loadConfig } from './config';

// Infrastructure modules
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { QueueModule } from './modules/queue/queue.module';
import { StorageModule } from './modules/storage/storage.module';
import { EmailModule } from './modules/email/email.module';
import { EventModule } from './modules/event/event.module';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';

// AI system modules (PR #2)
import { AiEngineModule } from './modules/ai-engine/ai-engine.module';
import { AiHealthModule } from './modules/ai-health/ai-health.module';
import { AiChatbotModule } from './modules/ai-chatbot/ai-chatbot.module';
import { AiConversationModule } from './modules/ai-conversation/ai-conversation.module';
import { AiMessageModule } from './modules/ai-message/ai-message.module';
import { AiChatbotConfigModule } from './modules/ai-chatbot-config/ai-chatbot-config.module';
import { AiFeedbackModule } from './modules/ai-feedback/ai-feedback.module';
import { AiRecommenderModule } from './modules/ai-recommender/ai-recommender.module';
import { AiRecommendationModule } from './modules/ai-recommendation/ai-recommendation.module';
import { AiRecommendationFeedbackModule } from './modules/ai-recommendation-feedback/ai-recommendation-feedback.module';
import { AiLearningPathModule } from './modules/ai-learning-path/ai-learning-path.module';
import { AiLearningPathNodeModule } from './modules/ai-learning-path-node/ai-learning-path-node.module';
import { AiStudyPlanModule } from './modules/ai-study-plan/ai-study-plan.module';
import { AiSkillGapModule } from './modules/ai-skill-gap/ai-skill-gap.module';
import { AiSentimentModule } from './modules/ai-sentiment/ai-sentiment.module';
import { AiContentGenerationModule } from './modules/ai-content-generation/ai-content-generation.module';
import { AiContentRequestModule } from './modules/ai-content-request/ai-content-request.module';
import { AiQuestionGenerationModule } from './modules/ai-question-generation/ai-question-generation.module';
import { AiAnswerEvaluationModule } from './modules/ai-answer-evaluation/ai-answer-evaluation.module';
import { AiDropoutPredictionModule } from './modules/ai-dropout-prediction/ai-dropout-prediction.module';
import { AiAtRiskModule } from './modules/ai-at-risk/ai-at-risk.module';
import { AiSmartSearchModule } from './modules/ai-smart-search/ai-smart-search.module';
import { AiSearchFeedbackModule } from './modules/ai-search-feedback/ai-search-feedback.module';
import { AiSummarizationModule } from './modules/ai-summarization/ai-summarization.module';
import { AiAnalyticsModule } from './modules/ai-analytics/ai-analytics.module';
import { AiUsageModule } from './modules/ai-usage/ai-usage.module';
import { AiJobModule } from './modules/ai-job/ai-job.module';
import { AiWebhookModule } from './modules/ai-webhook/ai-webhook.module';
import { AiEventConsumerModule } from './modules/ai-event-consumer/ai-event-consumer.module';
import { AiPromptModule } from './modules/ai-prompt/ai-prompt.module';
import { AiModelModule } from './modules/ai-model/ai-model.module';
import { AiEmbeddingModule } from './modules/ai-embedding/ai-embedding.module';
import { AiCacheModule } from './modules/ai-cache/ai-cache.module';
import { AiModeratorModule } from './modules/ai-moderator/ai-moderator.module';
import { AiInsightsModule } from './modules/ai-insights/ai-insights.module';

// Common
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: loadConfig,
      envFilePath: ['.env.local', '.env'],
    }),

    // Logging
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                },
              }
            : undefined,
        autoLogging: true,
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            headers: {
              'user-agent': req.headers['user-agent'],
              'x-tenant-id': req.headers['x-tenant-id'],
            },
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),

    // Event emitter
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 200,
      },
    ]),

    // Scheduling
    ScheduleModule.forRoot(),

    // Infrastructure
    PrismaModule,
    RedisModule,
    QueueModule,
    StorageModule,
    EmailModule,
    EventModule,

    // Features
    AuthModule,
    HealthModule,

    // AI system (PR #2)
    AiEngineModule,
    AiHealthModule,
    AiChatbotModule,
    AiConversationModule,
    AiMessageModule,
    AiChatbotConfigModule,
    AiFeedbackModule,
    AiRecommenderModule,
    AiRecommendationModule,
    AiRecommendationFeedbackModule,
    AiLearningPathModule,
    AiLearningPathNodeModule,
    AiStudyPlanModule,
    AiSkillGapModule,
    AiSentimentModule,
    AiContentGenerationModule,
    AiContentRequestModule,
    AiQuestionGenerationModule,
    AiAnswerEvaluationModule,
    AiDropoutPredictionModule,
    AiAtRiskModule,
    AiSmartSearchModule,
    AiSearchFeedbackModule,
    AiSummarizationModule,
    AiAnalyticsModule,
    AiUsageModule,
    AiJobModule,
    AiWebhookModule,
    AiEventConsumerModule,
    AiPromptModule,
    AiModelModule,
    AiEmbeddingModule,
    AiCacheModule,
    AiModeratorModule,
    AiInsightsModule,
  ],
  providers: [
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // Global response transform interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    // Global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
