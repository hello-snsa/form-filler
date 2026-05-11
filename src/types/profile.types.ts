export type Gender = 'male' | 'female' | 'other';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';

export interface PersonalInfo {
  fullName: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  dob: string; // ISO date string
  gender: Gender;
  maritalStatus: MaritalStatus;
  email: string;
  phone: string;
  alternatePhone: string;
  nationality: string;
}

export interface AddressInfo {
  currentAddress: string;
  permanentAddress: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  landmark: string;
}

export interface ProfessionalInfo {
  currentCompany: string;
  designation: string;
  department: string;
  experienceYears: number;
  experienceMonths: number;
  experienceRaw?: string;
  experienceUseRaw?: boolean;
  skills: string[];
  noticePeriod: string;
  currentSalary: string;
  expectedSalary: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  collegeName: string;
  degree: string;
  graduationYear: string;
  cgpa: string;
}

export interface DocumentInfo {
  resumeFile?: StoredFile;
  profileImage?: StoredFile;
  aadhaarFile?: StoredFile;
  panFile?: StoredFile;
  passportFile?: StoredFile;
  certificates?: StoredFile[];
}

export interface IdentityInfo {
  aadhaarNumber?: string; // stored encrypted
  panNumber?: string;     // stored encrypted
  passportNumber?: string; // stored encrypted
  drivingLicense?: string;
}

export interface CustomField {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'url';
}

export interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl?: string; // base64 for small files
  blobKey?: string; // IndexedDB key for large files
  uploadedAt: string;
}

export interface Profile {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  color: string;
  isDefault: boolean;
  personal: PersonalInfo;
  address: AddressInfo;
  professional: ProfessionalInfo;
  documents: DocumentInfo;
  identity: IdentityInfo;
  customFields: CustomField[];
  domainBindings: string[]; // domains this profile auto-applies to
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface RandomProfile extends Omit<Profile, 'id' | 'name' | 'createdAt' | 'updatedAt' | 'version' | 'isDefault' | 'documents' | 'domainBindings' | 'customFields'> {
  id?: string;
}

export type ProfileCreateInput = Omit<Profile, 'id' | 'createdAt' | 'updatedAt' | 'version'>;
export type ProfileUpdateInput = Partial<Omit<Profile, 'id' | 'createdAt' | 'version'>>;
