import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Image, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';
import { fileToStoredFile, formatBytes, isValidResume, isValidImage } from '@/utils/fileHelpers';
import { cn } from '@/utils/cn';
import type { StoredFile } from '@/types/profile.types';

interface FileSlotProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  file?: StoredFile;
  accept: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  validate?: (file: File) => boolean;
}

function FileSlot({ label, description, icon, file, accept, onUpload, onRemove, validate }: FileSlotProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    if (validate && !validate(f)) {
      setError('Invalid file type');
      e.target.value = '';
      return;
    }
    setUploading(true);
    try {
      await onUpload(f);
    } catch {
      setError('Upload failed');
    }
    setUploading(false);
    e.target.value = '';
  };

  return (
    <div className={cn(
      'p-3 rounded-xl border-2 transition-colors',
      file ? 'border-green-400/60 bg-green-50 dark:bg-green-900/10' : 'border-dashed border-slate-200 dark:border-slate-700'
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
          file ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
        )}>
          {file ? <CheckCircle size={18} /> : icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
          {file ? (
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">{description}</p>
          )}
          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
              <AlertTriangle size={10} />{error}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {file && (
            <button
              onClick={onRemove}
              className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={13} />
            </button>
          )}
          <label className={cn('btn-secondary btn-sm cursor-pointer text-xs', uploading && 'opacity-50')}>
            {uploading ? 'Uploading…' : file ? 'Replace' : 'Upload'}
            <input type="file" accept={accept} className="hidden" onChange={handleChange} disabled={uploading} />
          </label>
        </div>
      </div>
    </div>
  );
}

export default function UploadManager() {
  const { activeProfile, updateProfile } = useProfileStore();

  const handleUpload = useCallback(async (
    file: File,
    key: 'resumeFile' | 'profileImage' | 'aadhaarFile' | 'panFile' | 'passportFile'
  ) => {
    if (!activeProfile) return;
    const stored = await fileToStoredFile(file);
    await updateProfile(activeProfile.id, {
      documents: { ...activeProfile.documents, [key]: stored },
    });
  }, [activeProfile, updateProfile]);

  const handleRemove = useCallback(async (
    key: 'resumeFile' | 'profileImage' | 'aadhaarFile' | 'panFile' | 'passportFile'
  ) => {
    if (!activeProfile) return;
    await updateProfile(activeProfile.id, {
      documents: { ...activeProfile.documents, [key]: undefined },
    });
  }, [activeProfile, updateProfile]);

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
        <Upload size={36} className="mb-3 opacity-40" />
        <p className="text-sm">Select a profile first to manage documents</p>
      </div>
    );
  }

  const docs = activeProfile.documents;

  const slots: Array<{
    key: 'resumeFile' | 'profileImage' | 'aadhaarFile' | 'panFile' | 'passportFile';
    label: string;
    description: string;
    icon: React.ReactNode;
    accept: string;
    validate?: (f: File) => boolean;
  }> = [
    {
      key: 'resumeFile',
      label: 'Resume / CV',
      description: 'PDF or Word document',
      icon: <FileText size={18} />,
      accept: '.pdf,.doc,.docx,application/pdf,application/msword',
      validate: isValidResume,
    },
    {
      key: 'profileImage',
      label: 'Profile Photo',
      description: 'JPG, PNG under 2MB',
      icon: <Image size={18} />,
      accept: 'image/*',
      validate: isValidImage,
    },
    {
      key: 'aadhaarFile',
      label: 'Aadhaar Card',
      description: 'PDF or image of Aadhaar',
      icon: <FileText size={18} />,
      accept: '.pdf,image/*',
    },
    {
      key: 'panFile',
      label: 'PAN Card',
      description: 'PDF or image of PAN card',
      icon: <FileText size={18} />,
      accept: '.pdf,image/*',
    },
    {
      key: 'passportFile',
      label: 'Passport',
      description: 'PDF or image of passport',
      icon: <FileText size={18} />,
      accept: '.pdf,image/*',
    },
  ];

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Documents for <span className="text-brand-600">{activeProfile.name}</span>
        </p>
        <span className="badge-blue text-[10px]">
          {Object.values(docs).filter(Boolean).length} / {slots.length} uploaded
        </span>
      </div>

      <motion.div className="space-y-2.5" initial="hidden" animate="visible" variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } }
      }}>
        {slots.map(slot => (
          <motion.div
            key={slot.key}
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
          >
            <FileSlot
              label={slot.label}
              description={slot.description}
              icon={slot.icon}
              file={docs[slot.key] as StoredFile | undefined}
              accept={slot.accept}
              validate={slot.validate}
              onUpload={(file) => handleUpload(file, slot.key)}
              onRemove={() => handleRemove(slot.key)}
            />
          </motion.div>
        ))}
      </motion.div>

      <p className="text-center text-xs text-slate-400 pt-2">
        Files are stored locally and encrypted on your device
      </p>
    </div>
  );
}
