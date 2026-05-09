import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { detectFieldCategory, detectFormFields } from '@/content/matchers/fieldMatcher';

function makeInput(attrs: Record<string, string>, label?: string): HTMLInputElement {
  const dom = new JSDOM('<!DOCTYPE html>');
  const doc = dom.window.document;

  const input = doc.createElement('input');
  for (const [k, v] of Object.entries(attrs)) {
    input.setAttribute(k, v);
  }

  if (label) {
    const id = attrs.id ?? 'test-input';
    input.setAttribute('id', id);
    const lbl = doc.createElement('label');
    lbl.setAttribute('for', id);
    lbl.textContent = label;
    doc.body.appendChild(lbl);
  }

  doc.body.appendChild(input);

  return input as unknown as HTMLInputElement;
}

describe('detectFieldCategory', () => {
  it('detects email field by placeholder', () => {
    const el = makeInput({ placeholder: 'Enter your email address' });
    const { category } = detectFieldCategory(el as unknown as HTMLElement);
    expect(category).toBe('email');
  });

  it('detects mobile number field', () => {
    const el = makeInput({ name: 'mobile_number', placeholder: 'Mobile Number' });
    const { category } = detectFieldCategory(el as unknown as HTMLElement);
    expect(category).toBe('phone');
  });

  it('detects LinkedIn URL', () => {
    const el = makeInput({ name: 'linkedin_url', placeholder: 'LinkedIn Profile URL' });
    const { category } = detectFieldCategory(el as unknown as HTMLElement);
    expect(category).toBe('linkedinUrl');
  });

  it('detects PIN code field', () => {
    const el = makeInput({ name: 'pincode', placeholder: 'Enter PIN Code' });
    const { category } = detectFieldCategory(el as unknown as HTMLElement);
    expect(category).toBe('pincode');
  });

  it('detects resume file upload', () => {
    const el = makeInput({ name: 'resume_upload', type: 'file', accept: '.pdf' });
    const { category } = detectFieldCategory(el as unknown as HTMLElement);
    expect(category).toBe('resume');
  });

  it('detects full name field', () => {
    const el = makeInput({ name: 'full_name', placeholder: 'Full Name' });
    const { category } = detectFieldCategory(el as unknown as HTMLElement);
    expect(category).toBe('fullName');
  });

  it('returns unknown for generic input', () => {
    const el = makeInput({ name: 'xyz_abc_field' });
    const { category, confidence } = detectFieldCategory(el as unknown as HTMLElement);
    expect(category).toBe('unknown');
    expect(confidence).toBe(0);
  });

  it('gives high confidence for obvious matches', () => {
    const el = makeInput({ name: 'email', placeholder: 'Email Address' });
    const { category, confidence } = detectFieldCategory(el as unknown as HTMLElement);
    expect(category).toBe('email');
    expect(confidence).toBeGreaterThan(0.5);
  });
});
