from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set in .env file")

client = Groq(api_key=GROQ_API_KEY)
MODEL = "llama-3.3-70b-versatile"

def generate_content_ideas(platform: str, niche: str, language: str, count: int = 10) -> list:
    all_ideas = []
    batch_size = 10
    batches = (count + batch_size - 1) // batch_size

    for batch in range(batches):
        current_count = min(batch_size, count - len(all_ideas))

        prompt = f"""You are a viral content strategist expert.

Generate {current_count} viral content ideas for:
- Platform: {platform}
- Niche: {niche}
- Language: {language}

Return ONLY a JSON array with this exact format:
[
  {{
    "title": "Content title here",
    "description": "Why this will go viral (1 sentence)",
    "content_type": "Video",
    "viral_score": 8,
    "hook": "First 5 seconds hook line"
  }}
]

Return only valid JSON array, no extra text."""

        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            max_tokens=2000,
        )

        content = response.choices[0].message.content.strip()

        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        try:
            batch_ideas = json.loads(content)
            all_ideas.extend(batch_ideas)
        except json.JSONDecodeError:
            continue

        if len(all_ideas) >= count:
            break

    return all_ideas[:count]


def generate_script(title: str, platform: str, language: str, duration: int = 3) -> dict:
    prompt = f"""You are a professional content script writer.

Write a complete script for:
- Title: {title}
- Platform: {platform}
- Duration: {duration} minutes
- Language: {language}

Return ONLY a JSON object with this exact format:
{{
  "hook": "Opening hook (first 5 seconds)",
  "intro": "Introduction paragraph",
  "main_content": [
    {{"timestamp": "0:00-0:30", "content": "What to say/show"}},
    {{"timestamp": "0:30-1:00", "content": "What to say/show"}},
    {{"timestamp": "1:00-2:00", "content": "What to say/show"}}
  ],
  "call_to_action": "Ending CTA",
  "caption": "Short social media caption",
  "estimated_duration": "{duration} minutes"
}}

Write content in {language}. Return only valid JSON."""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=2000,
    )

    content = response.choices[0].message.content.strip()

    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON for script generation")


def generate_hashtags(niche: str, platform: str, topic: str, language: str) -> dict:
    prompt = f"""You are a social media SEO expert.

Generate hashtag strategy for:
- Niche: {niche}
- Platform: {platform}
- Topic: {topic}
- Language: {language}

Return ONLY a JSON object:
{{
  "trending": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "niche": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "general": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "best_posting_time": "7 PM - 9 PM",
  "target_audience": "Description of target audience",
  "estimated_reach": "10K - 50K"
}}

Return only valid JSON."""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.6,
        max_tokens=1000,
    )

    content = response.choices[0].message.content.strip()

    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON for hashtag generation")