import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  enabled: process.env.AI_ENABLED === 'true',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  model: process.env.AI_MODEL || 'gpt-4o-mini',
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2000', 10),
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  // Python AI microservice gateway
  gatewayUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  gatewayTimeout: parseInt(process.env.AI_GATEWAY_TIMEOUT || '30000', 10),
  serviceApiKey: process.env.AI_SERVICE_API_KEY || '',
  // Redis pub/sub channel used by the Python worker
  redisChannel: process.env.AI_REDIS_CHANNEL || 'eduobe:ai:jobs',
}));
