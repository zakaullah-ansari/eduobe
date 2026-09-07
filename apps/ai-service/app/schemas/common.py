"""Common Pydantic request/response schemas."""
from typing import Any, Literal

from pydantic import BaseModel, Field

ModelName = str


class ChatRequest(BaseModel):
    tenantId: str = Field(default="system")
    userId: str | None = None
    conversationId: str | None = None
    message: str = Field(min_length=1, max_length=8000)
    context: dict[str, Any] = Field(default_factory=dict)
    history: list[dict[str, Any]] = Field(default_factory=list)


class ChatResponse(BaseModel):
    answer: str
    model: ModelName = "eduobe-deterministic"
    suggestedPrompts: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    usage: dict[str, int] = Field(default_factory=lambda: {"inputTokens": 0, "outputTokens": 0})
    latencyMs: int = 0


class RecommendRequest(BaseModel):
    tenantId: str = "system"
    userId: str | None = None
    studentId: str | None = None
    courseIds: list[str] = Field(default_factory=list)
    courseNames: list[str] = Field(default_factory=list)
    completedCourses: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)
    limit: int = Field(default=5, ge=1, le=25)


class SentimentRequest(BaseModel):
    tenantId: str = "system"
    texts: list[str] = Field(default_factory=list, max_length=500)
    text: str | None = None


class ContentRequest(BaseModel):
    tenantId: str = "system"
    userId: str | None = None
    contentType: str = "lesson_plan"
    prompt: str
    title: str | None = None
    topic: str | None = None
    courseName: str | None = None
    difficulty: str = "intermediate"
    count: int = Field(default=1, ge=1, le=20)
    parameters: dict[str, Any] = Field(default_factory=dict)


class SummarizeRequest(BaseModel):
    tenantId: str = "system"
    text: str = Field(min_length=10, max_length=120000)
    maxSentences: int = Field(default=6, ge=1, le=30)
    bullet: bool = True


class DropoutRequest(BaseModel):
    tenantId: str = "system"
    features: dict[str, float] = Field(default_factory=dict)
    attendancePercent: float | None = Field(default=None, ge=0, le=100)
    marksAverage: float | None = Field(default=None, ge=0, le=100)
    previousSemestersFailed: int = Field(default=0, ge=0, le=20)
    assignmentsCompletedPercent: float = Field(default=100, ge=0, le=100)
    engagementScore: float = Field(default=0.5, ge=0, le=1)


class SearchRequest(BaseModel):
    tenantId: str = "system"
    query: str = Field(min_length=1, max_length=500)
    index: list[dict[str, Any]] = Field(default_factory=list)
    limit: int = Field(default=10, ge=1, le=50)


class QuestionRequest(BaseModel):
    tenantId: str = "system"
    topic: str
    courseName: str | None = None
    difficulty: str = "medium"
    questionType: str = "mcq"
    count: int = Field(default=3, ge=1, le=10)
    bloomLevel: str = "remember"
    context: str | None = None


class EvaluateRequest(BaseModel):
    tenantId: str = "system"
    question: str
    studentAnswer: str
    expectedAnswer: str | None = None
    rubric: dict[str, Any] | None = None
    maxScore: float = Field(default=10, gt=0)


class SkillGapRequest(BaseModel):
    tenantId: str = "system"
    studentSkills: list[str] = Field(default_factory=list)
    targetSkills: list[str] = Field(default_factory=list)
    coursework: list[str] = Field(default_factory=list)


class StudyPlanRequest(BaseModel):
    tenantId: str = "system"
    topics: list[str] = Field(default_factory=list)
    hoursPerWeek: float = Field(default=10, gt=0, le=80)
    weeks: int = Field(default=4, ge=1, le=26)
    priorityTopics: list[str] = Field(default_factory=list)
    goal: str | None = None


class LearningPathRequest(BaseModel):
    tenantId: str = "system"
    goal: str
    currentLevel: str = "beginner"
    targetLevel: str = "intermediate"
    availableCourses: list[dict[str, Any]] = Field(default_factory=list)
    weeks: int = Field(default=8, ge=2, le=52)


class InsightsRequest(BaseModel):
    tenantId: str = "system"
    sentiments: list[dict[str, Any]] = Field(default_factory=list)
    feedbacks: list[dict[str, Any]] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "EduOBE AI Service"
    version: str = "2.0.0"
    llmConfigured: bool = False
