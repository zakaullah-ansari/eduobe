"""Content generation service (4/14).

Template-driven generation for lessons, quizzes, notes, assignments,
question papers, MOOC suggestions, case studies, study guides, rubrics.
"""
from __future__ import annotations

import json
import re
from typing import Any

from ..schemas.common import ContentRequest
from .llm import llm_service

TEMPLATES: dict[str, str] = {
    "lesson_plan": """# Lesson Plan: {title}
**Topic:** {topic} | **Course:** {course} | **Level:** {difficulty}

## Learning Objectives
1. Define and explain {topic} with examples.
2. Apply {topic} to solve standard problems.
3. Analyze case studies involving {topic}.

## Outline
- **Session 1:** Introduction & motivation (25 min)
- **Session 2:** Core concepts of {topic} (45 min)
- **Session 3:** Worked examples / demonstration (40 min)
- **Session 4:** Practice exercises & doubt clearing (30 min)

## Activities
- Think-pair-share on {topic}
- Quiz: 5 formative MCQs
- Homework: Problem set on {topic}

## Assessment
Exit ticket + two questions mapped to CO-level outcomes.
""",
    "quiz": """# Quiz: {topic}
**Course:** {course} | **Difficulty:** {difficulty}

1. Which of the following best describes {topic}?
   A. Core definition  B. Superficial aspect  C. Unrelated topic  D. None
   *(Correct: A)*

2. State one key application of {topic}. *(Short answer)*

3. True or False: {topic} is always independent of prerequisites. *(False)*

4. Explain {topic} in one paragraph. *(Long answer)*
""",
    "notes": """# Notes: {topic}
## 1. Overview
{topic} is central to {course}. This note covers the main ideas,
terminology and common pitfalls.

## 2. Key Concepts
- **Definition:** Precise definition of {topic}.
- **Properties:** The properties that characterize {topic}.
- **Examples:** At least two worked examples.

## 3. Common Pitfalls
- Confusing {topic} with related concepts.
- Skipping prerequisite material.

## 4. Revision Checklist
- [ ] Re-write definitions from memory
- [ ] Solve 5 practice problems
- [ ] Map {topic} to course outcomes
""",
    "assignment": """# Assignment: {topic}
**Course:** {course} | **Instructions**

1. Answer all questions in your own words.
2. Use at least two references.
3. Submission: PDF via the portal.

## Questions
1. Explain {topic} and its significance.
2. Compare {topic} with a related concept.
3. Solve the case problem on {topic}.
4. Reflect: how does {topic} connect with your intended specialization?
""",
    "question_paper": """# Question Paper: {topic}
Time: 60 minutes | Marks: 20

**Section A (5 x 1 = 5 marks)**
1. Define {topic}.
2. List two applications of {topic}.

**Section B (3 x 3 = 9 marks)**
3. Explain {topic} with an example.
4. Derive/describe the working principle of {topic}.
5. Distinguish {topic} from an adjacent concept.

**Section C (1 x 6 = 6 marks)**
6. Case study on real-world use of {topic}.
""",
    "mooc": """# MOOC Recommendations: {topic}
1. **"Foundations of {topic}"** - select university MOOC, 6 weeks.
2. **"Applied {topic} in Practice"** - advanced specialisation, 8 weeks.
3. **"Project-Based {topic}"** - hands-on capstone, 4 weeks.

Suggested track: start with #1, then #3 for portfolio work.
""",
    "case_study": """# Case Study: {topic}
**Scenario:** A engineering firm is implementing {topic} in a mid-size project.

## Facts
- Team size 12, budget constrained, deadline 6 months.
- Legacy systems and limited documentation.

## Questions
1. What are the risks in adopting {topic}?
2. How would you sequence the rollout?
3. What metrics demonstrate success?
""",
    "study_guide": """# Study Guide: {topic}
## Week 1-2: Foundations
Read the core chapter on {topic}; take notes; attend doubt sessions.

## Week 3-4: Practice
Attempt question banks; join study groups; solve past papers.

## Week 5: Exam strategy
Revise definitions, work through a timed mock.

## Key resources
- Textbook chapters on {topic}
- Lab manual / practical worksheets
- EduOBE question bank MCQs
""",
    "rubric": """# Rubric: {topic}
| Criteria | Excellent (4) | Good (3) | Satisfactory (2) | Needs Work (1) |
|---|---|---|---|---|
| Understanding of {topic} | Comprehensive | Solid | Basic | Misconceptions |
| Analysis | Critical insight | Reasoned | Descriptive | Minimal |
| Communication | Clear & structured | Mostly clear | Somewhat unclear | Unclear |
| References | Multiple credible | Several | Few | None |
""",
}


def _template_render(template: str, mapping: dict[str, str]) -> str:
    out = template
    for key, value in mapping.items():
        out = out.replace("{" + key + "}", value)
    return out


def generate(req: ContentRequest) -> dict[str, Any]:
    content_type = req.contentType if req.contentType in TEMPLATES else "lesson_plan"
    topic = req.topic or req.prompt.strip()[:80] or "the selected topic"
    mapping = {
        "title": req.title or f"{topic.title()} - {content_type.replace('_', ' ').title()}",
        "topic": topic,
        "course": req.courseName or "Engineering Course",
        "difficulty": req.difficulty,
    }

    template = TEMPLATES[content_type]
    prompt = (
        f"Generate a {content_type.replace('_', ' ')} about '{topic}' for {req.courseName or 'a course'}. "
        f"Difficulty: {req.difficulty}. Structure: {template[:400]}"
    )
    llm_content = llm_service.complete(prompt)

    content = llm_content or _template_render(template, mapping)
    # repeat for count with variants
    items = []
    for i in range(req.count):
        if i == 0:
            items.append(content)
        else:
            items.append(_template_render(template, {**mapping, "title": f"{mapping['title']} (Variant {i + 1})"}))
            if llm_content:
                items[-1] = _template_render(template, {**mapping, "title": f"{mapping['title']} (Variant {i + 1})"})

    return {
        "items": items,
        "contentType": content_type,
        "topic": topic,
        "model": "gpt-4o-mini" if llm_service.configured else "eduobe-templates-v1",
        "usage": {"inputTokens": len(req.prompt.split()), "outputTokens": len(content.split())},
        "metadata": {"llm": llm_service.configured, "count": req.count},
    }
