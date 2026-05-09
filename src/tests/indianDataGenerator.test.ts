import { describe, it, expect } from 'vitest';
import { generateIndianProfile } from '@/generators/indianDataGenerator';

describe('generateIndianProfile', () => {
  it('generates a valid profile with all required fields', () => {
    const profile = generateIndianProfile();
    expect(profile.personal.fullName).toBeTruthy();
    expect(profile.personal.firstName).toBeTruthy();
    expect(profile.personal.lastName).toBeTruthy();
    expect(profile.personal.email).toMatch(/@/);
    expect(profile.personal.phone).toMatch(/^\+91/);
    expect(profile.address.city).toBeTruthy();
    expect(profile.address.state).toBeTruthy();
    expect(profile.address.pincode).toHaveLength(6);
    expect(profile.professional.skills.length).toBeGreaterThan(0);
  });

  it('generates male profile when gender is male', () => {
    const profile = generateIndianProfile('male');
    expect(profile.personal.gender).toBe('male');
  });

  it('generates female profile when gender is female', () => {
    const profile = generateIndianProfile('female');
    expect(profile.personal.gender).toBe('female');
  });

  it('generates valid PAN format', () => {
    const profile = generateIndianProfile();
    expect(profile.identity.panNumber).toMatch(/^[A-Z]{5}[0-9]{4}[A-Z]$/);
  });

  it('generates valid Aadhaar (12 digits)', () => {
    const profile = generateIndianProfile();
    expect(profile.identity.aadhaarNumber).toMatch(/^\d{12}$/);
  });

  it('generates unique profiles on multiple calls', () => {
    const p1 = generateIndianProfile();
    const p2 = generateIndianProfile();
    // Names should differ (not guaranteed but very likely)
    const sameEmail = p1.personal.email === p2.personal.email;
    expect(sameEmail).toBe(false);
  });

  it('generates realistic salary figures', () => {
    for (let i = 0; i < 5; i++) {
      const profile = generateIndianProfile();
      const salary = Number(profile.professional.currentSalary);
      expect(salary).toBeGreaterThanOrEqual(0);
    }
  });
});
