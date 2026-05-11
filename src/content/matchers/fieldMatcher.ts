import type { FieldCategory, FieldMatchRule, DetectedField, FieldType } from '@/types/form.types';

const RULES: FieldMatchRule[] = [
  // ── Name fields ───────────────────────────────────────────────────────
  {
    category: 'fullName',
    keywords: ['full name', 'fullname', 'complete name', 'name', 'your name', 'applicant name', 'candidate name'],
    patterns: [/full[\s_-]?name/i, /complete[\s_-]?name/i],
    priority: 10,
  },
  {
    category: 'firstName',
    keywords: ['first name', 'firstname', 'given name', 'fname', 'first'],
    patterns: [/first[\s_-]?name/i, /given[\s_-]?name/i, /^fname$/i],
    priority: 10,
  },
  {
    category: 'lastName',
    keywords: ['last name', 'lastname', 'surname', 'family name', 'lname'],
    patterns: [/last[\s_-]?name/i, /sur[\s_-]?name/i, /family[\s_-]?name/i, /^lname$/i],
    priority: 10,
  },
  {
    category: 'fatherName',
    keywords: ["father's name", 'father name', 'fathername', 'dad name', "guardian's name"],
    patterns: [/father['s]?[\s_-]?name/i, /guardian[\s_-]?name/i],
    priority: 9,
  },
  // ── Contact fields ────────────────────────────────────────────────────
  {
    category: 'email',
    keywords: ['email', 'e-mail', 'mail id', 'email address', 'email id', 'electronic mail'],
    patterns: [/e[\s_-]?mail/i, /mail[\s_-]?id/i],
    priority: 10,
  },
  {
    category: 'phone',
    keywords: ['phone', 'mobile', 'cell', 'contact number', 'phone number', 'mobile number', 'whatsapp', 'contact no'],
    patterns: [/phone[\s_-]?(number|no)?/i, /mobile[\s_-]?(number|no)?/i, /contact[\s_-]?(number|no)?/i],
    priority: 10,
  },
  {
    category: 'alternatePhone',
    keywords: ['alternate phone', 'alternate mobile', 'alternative phone', 'other number', 'secondary phone', 'alt phone'],
    patterns: [/alt(ernate)?[\s_-]?phone/i, /alt(ernate)?[\s_-]?mobile/i, /secondary[\s_-]?phone/i],
    priority: 9,
  },
  // ── Personal info ─────────────────────────────────────────────────────
  {
    category: 'dob',
    keywords: ['date of birth', 'dob', 'birth date', 'birthday', 'born on', 'date of birth (dd/mm/yyyy)'],
    patterns: [/date[\s_-]?of[\s_-]?birth/i, /d[\s_-]?o[\s_-]?b/i, /birth[\s_-]?date/i],
    priority: 10,
  },
  {
    category: 'gender',
    keywords: ['gender', 'sex', 'male/female', 'gender identity'],
    patterns: [/^gender$/i, /^sex$/i],
    priority: 10,
  },
  {
    category: 'maritalStatus',
    keywords: ['marital status', 'marital', 'married', 'marriage status'],
    patterns: [/marital[\s_-]?status/i],
    priority: 9,
  },
  {
    category: 'nationality',
    keywords: ['nationality', 'citizenship', 'country of citizenship'],
    patterns: [/national(ity)?/i, /citizen(ship)?/i],
    priority: 9,
  },
  // ── Address fields ────────────────────────────────────────────────────
  {
    category: 'address',
    keywords: ['address', 'street address', 'current address', 'residential address', 'home address', 'line 1', 'address line'],
    patterns: [/address/i, /street/i],
    priority: 8,
  },
  {
    category: 'city',
    keywords: ['city', 'town', 'district', 'locality', 'tehsil'],
    patterns: [/^city$/i, /^town$/i, /^district$/i],
    priority: 9,
  },
  {
    category: 'state',
    keywords: ['state', 'province', 'region'],
    patterns: [/^state$/i, /^province$/i],
    priority: 9,
  },
  {
    category: 'country',
    keywords: ['country', 'nation'],
    patterns: [/^country$/i, /^nation$/i],
    priority: 9,
  },
  {
    category: 'pincode',
    keywords: ['pin code', 'pincode', 'zip code', 'zipcode', 'postal code', 'zip', 'pin', 'post code'],
    patterns: [/pin[\s_-]?code/i, /zip[\s_-]?code/i, /postal[\s_-]?code/i, /^pin$/i, /^zip$/i],
    priority: 10,
  },
  // ── Professional fields ───────────────────────────────────────────────
  {
    category: 'company',
    keywords: ['company', 'organization', 'organisation', 'employer', 'current company', 'workplace', 'company name'],
    patterns: [/company[\s_-]?name/i, /organization/i, /employer/i],
    priority: 9,
  },
  {
    category: 'designation',
    keywords: ['designation', 'job title', 'position', 'role', 'current role', 'title'],
    patterns: [/designation/i, /job[\s_-]?title/i, /^position$/i, /^role$/i],
    priority: 9,
  },
  {
    category: 'experience',
    keywords: ['experience', 'work experience', 'years of experience', 'total experience', 'exp'],
    patterns: [/experience/i, /years?[\s_-]?of[\s_-]?exp/i],
    priority: 9,
  },
  {
    category: 'skills',
    keywords: ['skills', 'key skills', 'technical skills', 'competencies', 'expertise', 'technologies'],
    patterns: [/skill/i, /competenc/i, /technolog/i],
    priority: 8,
  },
  {
    category: 'noticePeriod',
    keywords: ['notice period', 'notice', 'joining', 'can join in', 'available in'],
    patterns: [/notice[\s_-]?period/i, /join(ing)?[\s_-]?(time|period)?/i],
    priority: 9,
  },
  {
    category: 'currentSalary',
    keywords: ['current salary', 'current ctc', 'ctc', 'salary', 'annual salary', 'current package', 'expected ctc'],
    patterns: [/current[\s_-]?(salary|ctc|package)/i, /annual[\s_-]?(salary|ctc)/i],
    priority: 9,
  },
  {
    category: 'expectedSalary',
    keywords: ['expected salary', 'expected ctc', 'desired salary', 'expected package', 'salary expectation'],
    patterns: [/expected[\s_-]?(salary|ctc|package)/i, /desired[\s_-]?salary/i],
    priority: 9,
  },
  // ── Education ─────────────────────────────────────────────────────────
  {
    category: 'college',
    keywords: ['college', 'university', 'institution', 'institute', 'school name', 'alma mater'],
    patterns: [/college/i, /university/i, /institution/i, /institute/i],
    priority: 8,
  },
  {
    category: 'degree',
    keywords: ['degree', 'qualification', 'education', 'course', 'program'],
    patterns: [/^degree$/i, /qualification/i],
    priority: 8,
  },
  {
    category: 'graduationYear',
    keywords: ['graduation year', 'passing year', 'year of passing', 'completion year'],
    patterns: [/graduation[\s_-]?year/i, /pass(ing)?[\s_-]?year/i],
    priority: 8,
  },
  {
    category: 'cgpa',
    keywords: ['cgpa', 'gpa', 'percentage', 'marks', 'score', 'grade'],
    patterns: [/cgpa/i, /^gpa$/i, /percentage/i],
    priority: 7,
  },
  // ── Social links ──────────────────────────────────────────────────────
  {
    category: 'linkedinUrl',
    keywords: ['linkedin', 'linkedin url', 'linkedin profile'],
    patterns: [/linkedin/i],
    priority: 10,
  },
  {
    category: 'githubUrl',
    keywords: ['github', 'github url', 'github profile', 'git url'],
    patterns: [/github/i, /gitlab/i],
    priority: 10,
  },
  {
    category: 'portfolioUrl',
    keywords: ['portfolio', 'website', 'personal website', 'blog', 'portfolio url'],
    patterns: [/portfolio/i, /personal[\s_-]?website/i, /^website$/i],
    priority: 8,
  },
  // ── Identity documents ────────────────────────────────────────────────
  {
    category: 'aadhaar',
    keywords: ['aadhaar', 'aadhar', 'aadhaar number', 'uid', 'uidai'],
    patterns: [/aa?dha?ar/i, /^uid$/i],
    priority: 10,
  },
  {
    category: 'pan',
    keywords: ['pan', 'pan number', 'pan card', 'permanent account number'],
    patterns: [/^pan$/i, /pan[\s_-]?(number|card|no)/i, /permanent[\s_-]?account/i],
    priority: 10,
  },
  {
    category: 'passport',
    keywords: ['passport', 'passport number', 'passport no'],
    patterns: [/passport/i],
    priority: 10,
  },
  // ── File upload fields ────────────────────────────────────────────────
  {
    category: 'resume',
    keywords: ['resume', 'cv', 'curriculum vitae', 'upload cv', 'upload resume', 'attach resume', 'resume/cv'],
    patterns: [/resume/i, /\bcv\b/i, /curriculum[\s_-]?vitae/i],
    priority: 10,
  },
  {
    category: 'profileImage',
    keywords: ['photo', 'profile photo', 'profile picture', 'profile image', 'passport photo', 'headshot', 'avatar', 'picture'],
    patterns: [/profile[\s_-]?(photo|pic|image)/i, /passport[\s_-]?photo/i, /^photo$/i, /headshot/i],
    priority: 9,
  },
  {
    category: 'aadhaarFile',
    keywords: ['aadhaar file', 'aadhar upload', 'aadhaar copy', 'aadhar card', 'aadhaar document'],
    patterns: [/aa?dha?ar[\s_-]?(file|upload|copy|doc)/i],
    priority: 9,
  },
  {
    category: 'panFile',
    keywords: ['pan file', 'pan upload', 'pan copy', 'pan card upload'],
    patterns: [/pan[\s_-]?(file|upload|copy|card)/i],
    priority: 9,
  },
];

// ── Scoring ────────────────────────────────────────────────────────────────

function normalize(text: string): string {
  return text.toLowerCase().replace(/[_\-\s]+/g, ' ').trim();
}

function getElementHints(el: HTMLElement): string[] {
  const hints: string[] = [];

  const addHint = (val: string | null | undefined) => {
    if (val) hints.push(normalize(val));
  };

  addHint(el.getAttribute('name'));
  addHint(el.getAttribute('id'));
  addHint(el.getAttribute('placeholder'));
  addHint(el.getAttribute('aria-label'));
  addHint(el.getAttribute('data-label'));
  addHint(el.getAttribute('title'));

  // Find associated <label>
  const id = el.getAttribute('id');
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) addHint(label.textContent);
  }

  // Check parent/sibling text
  const parent = el.parentElement;
  if (parent) {
    addHint(parent.querySelector('label')?.textContent);
    // span or div near input
    const nearText = parent.textContent?.replace((el as HTMLInputElement).value ?? '', '');
    if (nearText && nearText.length < 100) addHint(nearText);
  }

  return hints.filter(Boolean);
}

function scoreRule(rule: FieldMatchRule, hints: string[]): number {
  let score = 0;
  for (const hint of hints) {
    for (const kw of rule.keywords) {
      if (hint.includes(normalize(kw))) {
        score += rule.priority * (hint === normalize(kw) ? 2 : 1);
      }
    }
    for (const pattern of rule.patterns) {
      if (pattern.test(hint)) {
        score += rule.priority * 1.5;
      }
    }
  }
  return score;
}

export function detectFieldCategory(el: HTMLElement): { category: FieldCategory; confidence: number } {
  const hints = getElementHints(el);
  if (!hints.length) return { category: 'unknown', confidence: 0 };

  let bestScore = 0;
  let bestCategory: FieldCategory = 'unknown';

  for (const rule of RULES) {
    const score = scoreRule(rule, hints);
    if (score > bestScore) {
      bestScore = score;
      bestCategory = rule.category;
    }
  }

  const confidence = Math.min(bestScore / 20, 1);
  return { category: bestCategory, confidence };
}

export function getFieldType(el: HTMLElement): FieldType {
  const tag = el.tagName.toLowerCase();
  if (tag === 'select') return 'select';
  if (tag === 'textarea') return 'textarea';
  if (tag === 'input') {
    const type = (el as HTMLInputElement).type?.toLowerCase() ?? 'text';
    return (type as FieldType) || 'text';
  }
  return 'text';
}

export function detectFormFields(container: Document | HTMLElement = document): DetectedField[] {
  const selector = 'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]), select, textarea';
  const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));

  return elements
    .filter(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 || rect.height > 0) return true;
      // Accept elements in forms, dialogs, or ARIA modal containers even if dimensions are 0
      // (e.g. sidebars mid-animation, off-screen panels, CSS-transformed overlays)
      if (el.closest('form, dialog, [role="dialog"], [aria-modal="true"], [role="complementary"]')) return true;
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.visibility !== 'collapse';
    })
    .map(el => {
      const { category, confidence } = detectFieldCategory(el);
      const type = getFieldType(el);
      return {
        element: el,
        type,
        category,
        confidence,
        label: el.getAttribute('aria-label') ?? el.getAttribute('placeholder') ?? undefined,
        placeholder: el.getAttribute('placeholder') ?? undefined,
        required: el.hasAttribute('required') || el.getAttribute('aria-required') === 'true',
        multiple: type === 'file' ? (el as HTMLInputElement).multiple : undefined,
        acceptedTypes: type === 'file' ? (el as HTMLInputElement).accept : undefined,
      };
    });
}
