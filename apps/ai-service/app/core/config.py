from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """AI microservice configuration (env-driven)."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "EduOBE AI Service"
    app_env: str = "development"
    debug: bool = False

    # Auth
    service_api_key: str = ""  # matches X-AI-Service-Key from the NestJS gateway

    # LLM (optional - deterministic fallbacks are used when unset)
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    openai_base_url: str = "https://api.openai.com/v1"
    llm_timeout: float = 20.0

    # Redis / worker
    redis_url: str = "redis://localhost:6379/0"
    redis_queue_key: str = "eduobe:ai:queue"
    worker_batch_size: int = 10

    # NestJS callback webhook
    webhook_url: str = "http://localhost:4000/api/v1/ai/webhook"

    # Service tuning
    max_tokens: int = 2000
    temperature: float = 0.7
    default_embedding_dimensions: int = 384


@lru_cache
def get_settings() -> Settings:
    return Settings()
