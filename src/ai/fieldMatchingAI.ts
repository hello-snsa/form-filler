// Abstraction layer for AI-assisted field matching
// Supports OpenAI, Claude, or local models via a common interface

import type { FieldCategory } from '@/types/form.types';
import type { AIConfig } from '@/types/settings.types';

export interface AIFieldHint {
  name?: string;
  id?: string;
  placeholder?: string;
  label?: string;
  context?: string;
}

export interface AIFieldMatchResult {
  category: FieldCategory;
  confidence: number;
  reasoning?: string;
}

// ── Provider interface ─────────────────────────────────────────────────────

interface AIProvider {
  matchField(hint: AIFieldHint): Promise<AIFieldMatchResult>;
}

// ── OpenAI provider ────────────────────────────────────────────────────────

class OpenAIProvider implements AIProvider {
  constructor(private apiKey: string, private model = 'gpt-4o-mini') {}

  async matchField(hint: AIFieldHint): Promise<AIFieldMatchResult> {
    const prompt = buildPrompt(hint);
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        max_tokens: 100,
        response_format: { type: 'json_object' },
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? '{}';
    return parseAIResponse(content);
  }
}

// ── Claude provider ────────────────────────────────────────────────────────

class ClaudeProvider implements AIProvider {
  constructor(private apiKey: string, private model = 'claude-haiku-4-5-20251001') {}

  async matchField(hint: AIFieldHint): Promise<AIFieldMatchResult> {
    const prompt = buildPrompt(hint);
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 100,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await res.json();
    const content = data.content?.[0]?.text ?? '{}';
    return parseAIResponse(content);
  }
}

// ── Shared helpers ─────────────────────────────────────────────────────────

const VALID_CATEGORIES: FieldCategory[] = [
  'fullName', 'firstName', 'lastName', 'fatherName', 'email', 'phone', 'alternatePhone',
  'dob', 'gender', 'maritalStatus', 'address', 'city', 'state', 'country', 'pincode',
  'company', 'designation', 'experience', 'noticePeriod', 'currentSalary', 'expectedSalary',
  'skills', 'college', 'degree', 'graduationYear', 'cgpa', 'linkedinUrl', 'githubUrl',
  'portfolioUrl', 'aadhaar', 'pan', 'passport', 'resume', 'profileImage', 'nationality', 'unknown',
];

function buildPrompt(hint: AIFieldHint): string {
  return `You are a form field classifier for Indian job application forms. Given a form field's metadata, determine which personal data category it belongs to.

Field info:
name="${hint.name ?? ''}", id="${hint.id ?? ''}", placeholder="${hint.placeholder ?? ''}", label="${hint.label ?? ''}", context="${hint.context ?? ''}"

Return JSON: {"category": "<one of: ${VALID_CATEGORIES.join('|')}>", "confidence": <0.0-1.0>}`;
}

function parseAIResponse(content: string): AIFieldMatchResult {
  try {
    const match = content.match(/\{[^}]+\}/);
    if (!match) return { category: 'unknown', confidence: 0 };
    const parsed = JSON.parse(match[0]);
    const category: FieldCategory = VALID_CATEGORIES.includes(parsed.category) ? parsed.category : 'unknown';
    return { category, confidence: Number(parsed.confidence) || 0 };
  } catch {
    return { category: 'unknown', confidence: 0 };
  }
}

// ── Factory ────────────────────────────────────────────────────────────────

export function createAIProvider(config: AIConfig): AIProvider | null {
  if (!config.enabled || config.provider === 'none') return null;
  if (!config.apiKey) return null;

  switch (config.provider) {
    case 'openai':
      return new OpenAIProvider(config.apiKey, config.model);
    case 'claude':
      return new ClaudeProvider(config.apiKey, config.model);
    default:
      return null;
  }
}

let cachedProvider: AIProvider | null = null;

export function setAIProvider(config: AIConfig): void {
  cachedProvider = createAIProvider(config);
}

export async function aiMatchField(hint: AIFieldHint): Promise<AIFieldMatchResult | null> {
  if (!cachedProvider) return null;
  try {
    return await cachedProvider.matchField(hint);
  } catch {
    return null;
  }
}
