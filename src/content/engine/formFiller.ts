import type { Profile } from '@/types/profile.types';
import type { DetectedField, FillResult, FormFillReport, FieldCategory } from '@/types/form.types';
import { detectFormFields } from '@/content/matchers/fieldMatcher';
import { dispatchInputEvents, dispatchSelectEvents, dispatchCheckboxEvents } from './eventDispatcher';
import { uploadFileToInput, dataUrlToFile } from './fileUploader';

// ── Value resolvers ────────────────────────────────────────────────────────

function resolveValue(category: FieldCategory, profile: Profile): string | null {
  const p = profile.personal;
  const a = profile.address;
  const pro = profile.professional;

  const map: Partial<Record<FieldCategory, string>> = {
    fullName: p.fullName,
    firstName: p.firstName,
    lastName: p.lastName,
    fatherName: p.fatherName,
    email: p.email,
    phone: p.phone,
    alternatePhone: p.alternatePhone,
    dob: p.dob,
    gender: p.gender,
    maritalStatus: p.maritalStatus,
    nationality: p.nationality,
    address: a.currentAddress,
    city: a.city,
    state: a.state,
    country: a.country,
    pincode: a.pincode,
    landmark: a.landmark,
    company: pro.currentCompany,
    designation: pro.designation,
    department: pro.department,
    experience: `${pro.experienceYears} years ${pro.experienceMonths} months`,
    noticePeriod: pro.noticePeriod,
    currentSalary: pro.currentSalary,
    expectedSalary: pro.expectedSalary,
    skills: pro.skills.join(', '),
    college: pro.collegeName,
    degree: pro.degree,
    graduationYear: pro.graduationYear,
    cgpa: pro.cgpa,
    linkedinUrl: pro.linkedinUrl,
    githubUrl: pro.githubUrl,
    portfolioUrl: pro.portfolioUrl,
    aadhaar: profile.identity.aadhaarNumber ?? '',
    pan: profile.identity.panNumber ?? '',
    passport: profile.identity.passportNumber ?? '',
    drivingLicense: profile.identity.drivingLicense ?? '',
  };

  return map[category] ?? null;
}

// ── Fill functions ─────────────────────────────────────────────────────────

async function fillTextInput(el: HTMLInputElement, value: string, delay: number): Promise<boolean> {
  try {
    el.focus();
    await wait(delay);
    dispatchInputEvents(el, value);
    return true;
  } catch {
    return false;
  }
}

async function fillSelect(el: HTMLSelectElement, value: string, delay: number): Promise<boolean> {
  try {
    // Try exact match first, then case-insensitive, then partial
    const options = Array.from(el.options);
    const lv = value.toLowerCase();

    const match =
      options.find(o => o.value === value) ??
      options.find(o => o.text.toLowerCase() === lv) ??
      options.find(o => o.value.toLowerCase().includes(lv)) ??
      options.find(o => o.text.toLowerCase().includes(lv)) ??
      options.find(o => lv.includes(o.text.toLowerCase()) && o.text.length > 2);

    if (!match) return false;

    await wait(delay);
    dispatchSelectEvents(el, match.value);
    return true;
  } catch {
    return false;
  }
}

async function fillCheckbox(el: HTMLInputElement, value: string, delay: number): Promise<boolean> {
  const truthy = ['true', '1', 'yes', 'on', 'checked', 'agree'].includes(value.toLowerCase());
  await wait(delay);
  dispatchCheckboxEvents(el, truthy);
  return true;
}

async function fillRadio(el: HTMLInputElement, value: string, delay: number): Promise<boolean> {
  const lv = value.toLowerCase();
  const name = el.getAttribute('name');
  if (!name) return false;

  const radios = Array.from(document.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${name}"]`));
  const match =
    radios.find(r => r.value.toLowerCase() === lv) ??
    radios.find(r => r.value.toLowerCase().includes(lv)) ??
    radios.find(r => lv.includes(r.value.toLowerCase()) && r.value.length > 1);

  if (!match) return false;
  await wait(delay);
  dispatchCheckboxEvents(match, true);
  return true;
}

async function fillTextArea(el: HTMLTextAreaElement, value: string, delay: number): Promise<boolean> {
  try {
    el.focus();
    await wait(delay);
    dispatchInputEvents(el, value);
    return true;
  } catch {
    return false;
  }
}

async function fillFileInput(el: HTMLInputElement, profile: Profile, category: FieldCategory, delay: number): Promise<boolean> {
  await wait(delay);
  let storedFile;

  if (category === 'resume' || category === 'resume') {
    storedFile = profile.documents.resumeFile;
  } else if (category === 'profileImage') {
    storedFile = profile.documents.profileImage;
  } else if (category === 'aadhaarFile') {
    storedFile = profile.documents.aadhaarFile;
  } else if (category === 'panFile') {
    storedFile = profile.documents.panFile;
  } else if (category === 'passportFile') {
    storedFile = profile.documents.passportFile;
  }

  if (!storedFile?.dataUrl) return false;

  try {
    const file = await dataUrlToFile(storedFile.dataUrl, storedFile.name, storedFile.type);
    return uploadFileToInput(el, file);
  } catch {
    return false;
  }
}

// ── Highlighting ───────────────────────────────────────────────────────────

const HIGHLIGHT_CLASS = '__autofill-highlight__';
const HIGHLIGHT_STYLE = `
  .__autofill-highlight__ {
    outline: 2px solid #06b6d4 !important;
    background-color: rgba(6, 182, 212, 0.08) !important;
    transition: outline 0.3s ease !important;
  }
`;

let styleInjected = false;

function injectHighlightStyle() {
  if (styleInjected) return;
  const style = document.createElement('style');
  style.textContent = HIGHLIGHT_STYLE;
  document.head.appendChild(style);
  styleInjected = true;
}

export function highlightFields(fields: DetectedField[]): void {
  injectHighlightStyle();
  for (const field of fields) {
    if (field.category !== 'unknown') {
      field.element.classList.add(HIGHLIGHT_CLASS);
    }
  }
}

export function clearHighlights(): void {
  document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(el => {
    el.classList.remove(HIGHLIGHT_CLASS);
  });
}

// ── Main fill engine ───────────────────────────────────────────────────────

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export interface FillOptions {
  skipFilled?: boolean;
  delay?: number;
  minConfidence?: number;
  highlightFields?: boolean;
}

export async function fillForm(
  profile: Profile,
  options: FillOptions = {},
): Promise<FormFillReport> {
  const start = Date.now();
  const { skipFilled = true, delay = 50, minConfidence = 0.1 } = options;

  const fields = detectFormFields();
  const results: FillResult[] = [];

  const seenRadioNames = new Set<string>();

  for (const field of fields) {
    if (field.category === 'unknown' || field.confidence < minConfidence) {
      results.push({ field, success: false, error: 'low confidence / unknown' });
      continue;
    }

    const el = field.element;
    const type = field.type;

    // Skip already-filled text inputs
    if (skipFilled && type !== 'file' && type !== 'checkbox' && type !== 'radio') {
      const currentValue = (el as HTMLInputElement).value ?? '';
      if (currentValue.trim()) {
        results.push({ field, success: false, error: 'already filled' });
        continue;
      }
    }

    let success = false;

    try {
      if (type === 'file') {
        success = await fillFileInput(el as HTMLInputElement, profile, field.category, delay);
      } else if (type === 'select') {
        const value = resolveValue(field.category, profile);
        if (value) success = await fillSelect(el as HTMLSelectElement, value, delay);
      } else if (type === 'checkbox') {
        const value = resolveValue(field.category, profile);
        if (value) success = await fillCheckbox(el as HTMLInputElement, value, delay);
      } else if (type === 'radio') {
        const name = el.getAttribute('name') ?? '';
        if (seenRadioNames.has(name)) {
          results.push({ field, success: false, error: 'radio group already handled' });
          continue;
        }
        seenRadioNames.add(name);
        const value = resolveValue(field.category, profile);
        if (value) success = await fillRadio(el as HTMLInputElement, value, delay);
      } else if (type === 'textarea') {
        const value = resolveValue(field.category, profile);
        if (value) success = await fillTextArea(el as HTMLTextAreaElement, value, delay);
      } else {
        const value = resolveValue(field.category, profile);
        if (value) success = await fillTextInput(el as HTMLInputElement, value, delay);
      }

      results.push({ field, success, value: success ? resolveValue(field.category, profile) ?? undefined : undefined });
    } catch (e) {
      results.push({ field, success: false, error: String(e) });
    }
  }

  const filled = results.filter(r => r.success).length;
  const skipped = results.filter(r => !r.success && r.error?.includes('already filled')).length;
  const failed = results.filter(r => !r.success && !r.error?.includes('already filled')).length;

  return {
    url: window.location.href,
    timestamp: new Date().toISOString(),
    profileId: profile.id,
    totalFields: fields.length,
    filledFields: filled,
    skippedFields: skipped,
    failedFields: failed,
    results,
    duration: Date.now() - start,
  };
}
