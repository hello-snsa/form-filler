import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, UserCheck, Zap, CheckCircle } from 'lucide-react';
import { generateIndianProfile } from '@/generators/indianDataGenerator';
import type { IndianProfileData } from '@/generators/indianDataGenerator';
import { cn } from '@/utils/cn';

function DataRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!value) return null;

  return (
    <div className="flex items-start justify-between gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0 w-28">{label}</span>
      <span className="text-xs text-slate-800 dark:text-slate-200 flex-1 text-right truncate">{value}</span>
      <button
        onClick={copy}
        className="shrink-0 p-0.5 text-slate-400 hover:text-brand-500 transition-colors"
        title="Copy"
      >
        {copied ? <CheckCircle size={12} className="text-green-500" /> : <Copy size={12} />}
      </button>
    </div>
  );
}

export default function RandomFill() {
  const [gender, setGender] = useState<'male' | 'female' | 'random'>('random');
  const [profile, setProfile] = useState<IndianProfileData | null>(null);
  const [fillStatus, setFillStatus] = useState<'idle' | 'filling' | 'done' | 'error'>('idle');

  const generate = useCallback(() => {
    const g = gender === 'random' ? undefined : gender;
    setProfile(generateIndianProfile(g));
  }, [gender]);

  const fillPage = useCallback(async () => {
    setFillStatus('filling');
    const res = await new Promise<{ success: boolean }>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab?.id) { resolve({ success: false }); return; }
        chrome.tabs.sendMessage(tab.id, { action: 'RANDOM_FILL' }, (r) => {
          if (chrome.runtime.lastError) { resolve({ success: false }); return; }
          resolve(r ?? { success: false });
        });
      });
    });
    setFillStatus(res.success ? 'done' : 'error');
    setTimeout(() => setFillStatus('idle'), 2500);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="p-4 space-y-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
            {(['random', 'male', 'female'] as const).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={cn(
                  'px-3 py-1.5 capitalize transition-colors',
                  gender === g
                    ? 'bg-brand-500 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                {g}
              </button>
            ))}
          </div>
          <button onClick={generate} className="btn-primary btn-sm gap-1 ml-auto">
            <RefreshCw size={13} />
            Generate
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={fillPage}
            disabled={fillStatus === 'filling'}
            className={cn(
              'btn btn-md rounded-lg gap-1.5',
              fillStatus === 'done' ? 'bg-green-500 text-white' :
              fillStatus === 'error' ? 'bg-red-500 text-white' :
              'btn-primary'
            )}
          >
            <Zap size={15} />
            {fillStatus === 'filling' && 'Filling…'}
            {fillStatus === 'done' && 'Done!'}
            {fillStatus === 'error' && 'Error'}
            {fillStatus === 'idle' && 'Fill Page'}
          </button>
          <button
            onClick={generate}
            className="btn-secondary btn-md rounded-lg gap-1.5"
          >
            <UserCheck size={15} />
            New Profile
          </button>
        </div>
      </div>

      {/* Data display */}
      <div className="flex-1 overflow-y-auto p-4">
        {!profile ? (
          <div className="text-center py-12">
            <RefreshCw size={32} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm text-slate-500">Click Generate to create a random Indian profile</p>
          </div>
        ) : (
          <motion.div
            key={profile.personal.email}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Personal */}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Personal</p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <DataRow label="Full Name" value={profile.personal.fullName} />
                <DataRow label="Father's Name" value={profile.personal.fatherName} />
                <DataRow label="DOB" value={profile.personal.dob} />
                <DataRow label="Gender" value={profile.personal.gender} />
                <DataRow label="Email" value={profile.personal.email} />
                <DataRow label="Phone" value={profile.personal.phone} />
              </div>
            </div>

            {/* Address */}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Address</p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <DataRow label="Address" value={profile.address.currentAddress} />
                <DataRow label="City" value={profile.address.city} />
                <DataRow label="State" value={profile.address.state} />
                <DataRow label="PIN Code" value={profile.address.pincode} />
              </div>
            </div>

            {/* Professional */}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Professional</p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <DataRow label="Company" value={profile.professional.currentCompany} />
                <DataRow label="Designation" value={profile.professional.designation} />
                <DataRow label="Experience" value={`${profile.professional.experienceYears}y ${profile.professional.experienceMonths}m`} />
                <DataRow label="Skills" value={profile.professional.skills.slice(0, 5).join(', ')} />
                <DataRow label="Notice Period" value={profile.professional.noticePeriod} />
                <DataRow label="Current CTC" value={`₹${Number(profile.professional.currentSalary).toLocaleString('en-IN')}`} />
                <DataRow label="LinkedIn" value={profile.professional.linkedinUrl} />
                <DataRow label="GitHub" value={profile.professional.githubUrl} />
              </div>
            </div>

            {/* Identity (masked) */}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Identity</p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <DataRow label="Aadhaar" value={`${profile.identity.aadhaarNumber?.slice(0, 4)} XXXX ${profile.identity.aadhaarNumber?.slice(8)}`} />
                <DataRow label="PAN" value={profile.identity.panNumber ?? ''} />
                <DataRow label="Passport" value={profile.identity.passportNumber ?? ''} />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
