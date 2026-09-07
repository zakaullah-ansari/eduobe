import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  BadGatewayException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AiGatewayResult {
  feature: string;
  action: string;
  result: Record<string, any>;
  model?: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
  metadata?: Record<string, any>;
  latencyMs?: number;
}

export interface AiGatewayInvokeOptions {
  timeoutMs?: number;
}

/**
 * Maps the API feature names used by the NestJS modules to the exact
 * FastAPI route of the Python AI microservice.
 */
export const AI_FEATURE_ROUTES: Record<string, string> = {
  chatbot: '/api/v1/ai/chatbot/chat',
  recommender: '/api/v1/ai/recommender/recommend',
  sentiment: '/api/v1/ai/sentiment/analyze',
  contentgeneration: '/api/v1/ai/content/generate',
  summarization: '/api/v1/ai/summarization/summarize',
  dropoutprediction: '/api/v1/ai/dropout/predict',
  smartsearch: '/api/v1/ai/smart-search/query',
  studyplan: '/api/v1/ai/study-plan/generate',
  learningpath: '/api/v1/ai/study-plan/learning-path',
  skillgap: '/api/v1/ai/skill-gap/analyze',
  answerevaluation: '/api/v1/ai/evaluation/evaluate',
  questiongeneration: '/api/v1/ai/questions/generate',
  atrisk: '/api/v1/ai/dropout/predict',
  insights: '/api/v1/ai/insights/analyze',
};

/**
 * Thin HTTP gateway between the NestJS API and the Python FastAPI
 * AI microservice (apps/ai-service).
 *
 * The Python service is stateless and exposes deterministic fallbacks,
 * so the gateway degrades gracefully when OPENAI_API_KEY is not set.
 */
@Injectable()
export class AiGatewayService {
  private readonly logger = new Logger(AiGatewayService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>(
      'ai.gatewayUrl',
      'http://localhost:8000',
    );
    this.apiKey = this.config.get<string>('ai.serviceApiKey', '');
  }

  get isEnabled(): boolean {
    return this.config.get<boolean>('ai.enabled', false);
  }

  async invoke(
    feature: string,
    payload: Record<string, any>,
    options: AiGatewayInvokeOptions = {},
  ): Promise<AiGatewayResult> {
    const startedAt = Date.now();
    const route = AI_FEATURE_ROUTES[feature] ?? `/api/v1/ai/${feature}`;
    const url = `${this.baseUrl}${route}`;
    const timeoutMs = options.timeoutMs ?? this.config.get<number>('ai.gatewayTimeout', 30000);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) {
      headers['X-AI-Service-Key'] = this.apiKey;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const body = (await response.json().catch(() => ({}))) as Record<string, any>;

      if (!response.ok) {
        this.logger.warn(`AI service ${url} responded ${response.status}: ${JSON.stringify(body)}`);
        throw new BadGatewayException({
          message: `AI service request failed (${response.status})`,
          statusCode: 502,
          details: body,
        });
      }

      const latencyMs = Date.now() - startedAt;
      this.logger.debug(`AI invoke ${feature} ok in ${latencyMs}ms`);

      return {
        feature,
        action: payload.action ?? 'invoke',
        result: body,
        model: body.model,
        usage: body.usage,
        metadata: body.metadata,
        latencyMs,
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new ServiceUnavailableException('AI service timed out');
      }
      if (error instanceof BadGatewayException || error instanceof ServiceUnavailableException) {
        throw error;
      }
      this.logger.error(`AI gateway error calling ${url}: ${error.message}`);
      throw new ServiceUnavailableException({
        message: 'AI service is unavailable',
        cause: error.message,
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  async health(): Promise<Record<string, any>> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: this.apiKey ? { 'X-AI-Service-Key': this.apiKey } : {},
        signal: AbortSignal.timeout(5000),
      });
      const body = await response.json().catch(() => ({}));
      return { reachable: response.ok, status: response.status, body };
    } catch {
      return { reachable: false };
    }
  }
}
