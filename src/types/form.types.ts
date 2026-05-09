export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'file'
  | 'password'
  | 'url'
  | 'search';

export type FieldCategory =
  | 'fullName' | 'firstName' | 'lastName' | 'fatherName' | 'motherName'
  | 'email' | 'phone' | 'alternatePhone'
  | 'dob' | 'gender' | 'maritalStatus'
  | 'address' | 'city' | 'state' | 'country' | 'pincode' | 'landmark'
  | 'company' | 'designation' | 'department' | 'experience' | 'noticePeriod'
  | 'currentSalary' | 'expectedSalary' | 'skills'
  | 'college' | 'degree' | 'graduationYear' | 'cgpa'
  | 'linkedinUrl' | 'githubUrl' | 'portfolioUrl'
  | 'aadhaar' | 'pan' | 'passport' | 'drivingLicense'
  | 'resume' | 'profileImage' | 'aadhaarFile' | 'panFile' | 'passportFile'
  | 'nationality' | 'website' | 'summary' | 'objective'
  | 'unknown';

export interface DetectedField {
  element: HTMLElement;
  type: FieldType;
  category: FieldCategory;
  confidence: number; // 0-1
  label?: string;
  placeholder?: string;
  required: boolean;
  multiple?: boolean; // for file inputs
  acceptedTypes?: string; // for file inputs
}

export interface FillResult {
  field: DetectedField;
  success: boolean;
  value?: string;
  error?: string;
}

export interface FormFillReport {
  url: string;
  timestamp: string;
  profileId: string | null;
  totalFields: number;
  filledFields: number;
  skippedFields: number;
  failedFields: number;
  results: FillResult[];
  duration: number; // ms
}

export interface FieldMatchRule {
  category: FieldCategory;
  keywords: string[];
  patterns: RegExp[];
  priority: number;
}

export type MessageAction =
  | 'FILL_FORM'
  | 'RANDOM_FILL'
  | 'GET_FORM_FIELDS'
  | 'UPLOAD_FILE'
  | 'GET_PAGE_INFO'
  | 'HIGHLIGHT_FIELDS'
  | 'CLEAR_HIGHLIGHTS';

export interface ExtensionMessage {
  action: MessageAction;
  payload?: Record<string, unknown>;
}

export interface ExtensionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
