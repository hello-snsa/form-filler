import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Save, Wand2, Plus, Trash2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfileStore } from '@/store/profileStore';
import { generateIndianProfile } from '@/generators/indianDataGenerator';
import { cn } from '@/utils/cn';
import type { Profile, ProfileCreateInput } from '@/types/profile.types';

// ── Zod schema ─────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(1, 'Profile name is required'),
  description: z.string().optional(),
  color: z.string(),
  isDefault: z.boolean(),
  // Personal
  fullName: z.string().min(1, 'Full name required'),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  email: z.string().email('Invalid email').min(1),
  phone: z.string().min(10, 'Enter valid phone').max(15),
  alternatePhone: z.string().optional(),
  nationality: z.string().optional(),
  // Address
  currentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  landmark: z.string().optional(),
  // Professional
  currentCompany: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  experienceYears: z.coerce.number().min(0).max(50).optional(),
  experienceMonths: z.coerce.number().min(0).max(11).optional(),
  skills: z.string().optional(), // comma-separated
  noticePeriod: z.string().optional(),
  currentSalary: z.string().optional(),
  expectedSalary: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  collegeName: z.string().optional(),
  degree: z.string().optional(),
  graduationYear: z.string().optional(),
  cgpa: z.string().optional(),
  // Identity
  aadhaarNumber: z.string().optional(),
  panNumber: z.string().optional(),
  passportNumber: z.string().optional(),
});

type FormValues = z.infer<typeof profileSchema>;

interface Props {
  profile?: Profile | null;
  onClose: () => void;
}

const TABS = ['Basic', 'Personal', 'Address', 'Professional', 'Identity'] as const;
type Tab = typeof TABS[number];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#10b981', '#06b6d4', '#3b82f6'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

export default function ProfileFormModal({ profile, onClose }: Props) {
  const { createProfile, updateProfile } = useProfileStore();
  const [tab, setTab] = useState<Tab>('Basic');
  const [saving, setSaving] = useState(false);
  const isEditing = !!profile;

  const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile ? {
      name: profile.name,
      description: profile.description ?? '',
      color: profile.color,
      isDefault: profile.isDefault,
      fullName: profile.personal.fullName,
      firstName: profile.personal.firstName,
      lastName: profile.personal.lastName,
      fatherName: profile.personal.fatherName,
      motherName: profile.personal.motherName,
      dob: profile.personal.dob,
      gender: profile.personal.gender,
      maritalStatus: profile.personal.maritalStatus,
      email: profile.personal.email,
      phone: profile.personal.phone,
      alternatePhone: profile.personal.alternatePhone,
      nationality: profile.personal.nationality,
      currentAddress: profile.address.currentAddress,
      permanentAddress: profile.address.permanentAddress,
      city: profile.address.city,
      state: profile.address.state,
      country: profile.address.country ?? 'India',
      pincode: profile.address.pincode,
      landmark: profile.address.landmark,
      currentCompany: profile.professional.currentCompany,
      designation: profile.professional.designation,
      department: profile.professional.department,
      experienceYears: profile.professional.experienceYears,
      experienceMonths: profile.professional.experienceMonths,
      skills: profile.professional.skills.join(', '),
      noticePeriod: profile.professional.noticePeriod,
      currentSalary: profile.professional.currentSalary,
      expectedSalary: profile.professional.expectedSalary,
      linkedinUrl: profile.professional.linkedinUrl,
      githubUrl: profile.professional.githubUrl,
      portfolioUrl: profile.professional.portfolioUrl,
      collegeName: profile.professional.collegeName,
      degree: profile.professional.degree,
      graduationYear: profile.professional.graduationYear,
      cgpa: profile.professional.cgpa,
      aadhaarNumber: profile.identity.aadhaarNumber ?? '',
      panNumber: profile.identity.panNumber ?? '',
      passportNumber: profile.identity.passportNumber ?? '',
    } : {
      color: COLORS[0],
      isDefault: false,
      country: 'India',
      nationality: 'Indian',
    },
  });

  const autofillFromGenerator = () => {
    const data = generateIndianProfile();
    setValue('fullName', data.personal.fullName);
    setValue('firstName', data.personal.firstName);
    setValue('lastName', data.personal.lastName);
    setValue('fatherName', data.personal.fatherName);
    setValue('motherName', data.personal.motherName);
    setValue('dob', data.personal.dob);
    setValue('gender', data.personal.gender);
    setValue('email', data.personal.email);
    setValue('phone', data.personal.phone);
    setValue('currentAddress', data.address.currentAddress);
    setValue('city', data.address.city);
    setValue('state', data.address.state);
    setValue('pincode', data.address.pincode);
    setValue('currentCompany', data.professional.currentCompany);
    setValue('designation', data.professional.designation);
    setValue('experienceYears', data.professional.experienceYears);
    setValue('skills', data.professional.skills.join(', '));
    setValue('currentSalary', data.professional.currentSalary);
    setValue('expectedSalary', data.professional.expectedSalary);
    setValue('linkedinUrl', data.professional.linkedinUrl);
    setValue('githubUrl', data.professional.githubUrl);
    setValue('collegeName', data.professional.collegeName);
    setValue('degree', data.professional.degree);
    setValue('graduationYear', data.professional.graduationYear);
    setValue('aadhaarNumber', data.identity.aadhaarNumber ?? '');
    setValue('panNumber', data.identity.panNumber ?? '');
  };

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const input: ProfileCreateInput = {
        name: values.name,
        description: values.description,
        color: values.color,
        isDefault: values.isDefault,
        personal: {
          fullName: values.fullName,
          firstName: values.firstName,
          lastName: values.lastName,
          fatherName: values.fatherName ?? '',
          motherName: values.motherName ?? '',
          dob: values.dob ?? '',
          gender: (values.gender as 'male' | 'female' | 'other') ?? 'other',
          maritalStatus: (values.maritalStatus as 'single' | 'married') ?? 'single',
          email: values.email,
          phone: values.phone,
          alternatePhone: values.alternatePhone ?? '',
          nationality: values.nationality ?? 'Indian',
        },
        address: {
          currentAddress: values.currentAddress ?? '',
          permanentAddress: values.permanentAddress ?? '',
          city: values.city ?? '',
          state: values.state ?? '',
          country: values.country ?? 'India',
          pincode: values.pincode ?? '',
          landmark: values.landmark ?? '',
        },
        professional: {
          currentCompany: values.currentCompany ?? '',
          designation: values.designation ?? '',
          department: values.department ?? '',
          experienceYears: values.experienceYears ?? 0,
          experienceMonths: values.experienceMonths ?? 0,
          skills: (values.skills ?? '').split(',').map(s => s.trim()).filter(Boolean),
          noticePeriod: values.noticePeriod ?? '',
          currentSalary: values.currentSalary ?? '',
          expectedSalary: values.expectedSalary ?? '',
          linkedinUrl: values.linkedinUrl ?? '',
          githubUrl: values.githubUrl ?? '',
          portfolioUrl: values.portfolioUrl ?? '',
          collegeName: values.collegeName ?? '',
          degree: values.degree ?? '',
          graduationYear: values.graduationYear ?? '',
          cgpa: values.cgpa ?? '',
        },
        identity: {
          aadhaarNumber: values.aadhaarNumber,
          panNumber: values.panNumber,
          passportNumber: values.passportNumber,
        },
        documents: profile?.documents ?? { certificates: [] },
        customFields: profile?.customFields ?? [],
        domainBindings: profile?.domainBindings ?? [],
      };

      if (isEditing && profile) {
        await updateProfile(profile.id, input);
      } else {
        await createProfile(input);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  });

  const tabContent: Record<Tab, React.ReactNode> = {
    Basic: (
      <div className="space-y-3">
        <Field label="Profile Name *" error={errors.name?.message}>
          <input {...register('name')} className="input" placeholder="e.g. Job Applications" />
        </Field>
        <Field label="Description">
          <input {...register('description')} className="input" placeholder="Optional description" />
        </Field>
        <Field label="Color">
          <div className="flex gap-2 flex-wrap">
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <>
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => field.onChange(c)}
                      className={cn(
                        'w-7 h-7 rounded-full border-2 transition-transform',
                        field.value === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </>
              )}
            />
          </div>
        </Field>
        <Field label="">
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register('isDefault')} type="checkbox" className="rounded" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Set as default profile</span>
          </label>
        </Field>
      </div>
    ),

    Personal: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Field label="First Name *" error={errors.firstName?.message}>
            <input {...register('firstName')} className="input" />
          </Field>
          <Field label="Last Name *" error={errors.lastName?.message}>
            <input {...register('lastName')} className="input" />
          </Field>
        </div>
        <Field label="Full Name *" error={errors.fullName?.message}>
          <input {...register('fullName')} className="input" />
        </Field>
        <Field label="Father's Name">
          <input {...register('fatherName')} className="input" />
        </Field>
        <Field label="Mother's Name">
          <input {...register('motherName')} className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Date of Birth">
            <input {...register('dob')} type="date" className="input" />
          </Field>
          <Field label="Gender">
            <select {...register('gender')} className="input">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>
        <Field label="Marital Status">
          <select {...register('maritalStatus')} className="input">
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </Field>
        <Field label="Email *" error={errors.email?.message}>
          <input {...register('email')} type="email" className="input" />
        </Field>
        <Field label="Phone *" error={errors.phone?.message}>
          <input {...register('phone')} type="tel" className="input" placeholder="+919876543210" />
        </Field>
        <Field label="Alternate Phone">
          <input {...register('alternatePhone')} type="tel" className="input" />
        </Field>
        <Field label="Nationality">
          <input {...register('nationality')} className="input" defaultValue="Indian" />
        </Field>
      </div>
    ),

    Address: (
      <div className="space-y-3">
        <Field label="Current Address">
          <textarea {...register('currentAddress')} className="input resize-none" rows={2} />
        </Field>
        <Field label="Permanent Address">
          <textarea {...register('permanentAddress')} className="input resize-none" rows={2} />
        </Field>
        <Field label="City">
          <input {...register('city')} className="input" />
        </Field>
        <Field label="State">
          <select {...register('state')} className="input">
            <option value="">Select state</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Country">
            <input {...register('country')} className="input" defaultValue="India" />
          </Field>
          <Field label="PIN Code">
            <input {...register('pincode')} className="input" maxLength={6} />
          </Field>
        </div>
        <Field label="Landmark">
          <input {...register('landmark')} className="input" placeholder="Near railway station…" />
        </Field>
      </div>
    ),

    Professional: (
      <div className="space-y-3">
        <Field label="Current Company">
          <input {...register('currentCompany')} className="input" />
        </Field>
        <Field label="Designation / Job Title">
          <input {...register('designation')} className="input" />
        </Field>
        <Field label="Department">
          <input {...register('department')} className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Experience (Years)">
            <input {...register('experienceYears')} type="number" min="0" max="50" className="input" />
          </Field>
          <Field label="Experience (Months)">
            <input {...register('experienceMonths')} type="number" min="0" max="11" className="input" />
          </Field>
        </div>
        <Field label="Skills (comma-separated)">
          <textarea {...register('skills')} className="input resize-none" rows={2} placeholder="React, TypeScript, Node.js" />
        </Field>
        <Field label="Notice Period">
          <select {...register('noticePeriod')} className="input">
            <option value="">Select</option>
            {['Immediate', '15 days', '30 days', '45 days', '60 days', '90 days'].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Current CTC (₹)">
            <input {...register('currentSalary')} className="input" placeholder="800000" />
          </Field>
          <Field label="Expected CTC (₹)">
            <input {...register('expectedSalary')} className="input" placeholder="1200000" />
          </Field>
        </div>
        <Field label="LinkedIn URL">
          <input {...register('linkedinUrl')} className="input" placeholder="https://linkedin.com/in/…" />
        </Field>
        <Field label="GitHub URL">
          <input {...register('githubUrl')} className="input" placeholder="https://github.com/…" />
        </Field>
        <Field label="Portfolio URL">
          <input {...register('portfolioUrl')} className="input" />
        </Field>
        <Field label="College / University">
          <input {...register('collegeName')} className="input" />
        </Field>
        <Field label="Degree">
          <input {...register('degree')} className="input" placeholder="B.Tech in CS" />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Graduation Year">
            <input {...register('graduationYear')} className="input" placeholder="2022" />
          </Field>
          <Field label="CGPA / %">
            <input {...register('cgpa')} className="input" placeholder="8.5" />
          </Field>
        </div>
      </div>
    ),

    Identity: (
      <div className="space-y-3">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
            🔒 Sensitive data is encrypted before storage
          </p>
        </div>
        <Field label="Aadhaar Number">
          <input {...register('aadhaarNumber')} className="input" maxLength={12} placeholder="12-digit Aadhaar" />
        </Field>
        <Field label="PAN Number">
          <input {...register('panNumber')} className="input" maxLength={10} placeholder="ABCDE1234F" style={{ textTransform: 'uppercase' }} />
        </Field>
        <Field label="Passport Number">
          <input {...register('passportNumber')} className="input" maxLength={8} placeholder="A1234567" style={{ textTransform: 'uppercase' }} />
        </Field>
      </div>
    ),
  };

  const tabIndex = TABS.indexOf(tab);
  const canGoBack = tabIndex > 0;
  const canGoNext = tabIndex < TABS.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {isEditing ? 'Edit Profile' : 'Create Profile'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={autofillFromGenerator}
              className="btn-ghost btn-sm gap-1 text-xs text-accent-600 dark:text-accent-400"
              title="Auto-fill with random Indian data"
            >
              <Wand2 size={13} />
              Auto-fill
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 px-2 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 -mb-px transition-colors',
                tab === t
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Form content */}
        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={onSubmit}>
            {tabContent[tab]}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setTab(TABS[tabIndex - 1])}
            disabled={!canGoBack}
            className="btn-ghost btn-sm gap-1 disabled:opacity-0"
          >
            <ChevronLeft size={14} /> Back
          </button>

          <div className="flex gap-1">
            {TABS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-colors',
                  i === tabIndex ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
                )}
              />
            ))}
          </div>

          {canGoNext ? (
            <button
              type="button"
              onClick={() => setTab(TABS[tabIndex + 1])}
              className="btn-primary btn-sm gap-1"
            >
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { void onSubmit(); }}
              disabled={saving}
              className="btn-primary btn-sm gap-1"
            >
              <Save size={13} />
              {saving ? 'Saving…' : 'Save'}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
