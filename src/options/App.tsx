import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { useProfileStore } from '@/store/profileStore';
import { Settings, Users, Shield, Info, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';

type Tab = 'settings' | 'profiles' | 'security' | 'about';

export default function OptionsApp() {
  const [tab, setTab] = useState<Tab>('settings');
  const { loadSettings } = useSettingsStore();
  const { loadProfiles } = useProfileStore();

  useEffect(() => {
    loadSettings();
    loadProfiles();
  }, []);

  const nav = [
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
    { id: 'profiles' as Tab, label: 'Profiles', icon: Users },
    { id: 'security' as Tab, label: 'Security', icon: Shield },
    { id: 'about' as Tab, label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Indian AutoFill</p>
            <p className="text-xs text-slate-500">AI Form Filler</p>
          </div>
        </div>

        <nav className="space-y-1">
          {nav.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left',
                tab === item.id
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              )}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 max-w-3xl">
        {tab === 'settings' && <SettingsSection />}
        {tab === 'profiles' && <ProfilesSection />}
        {tab === 'security' && <SecuritySection />}
        {tab === 'about' && <AboutSection />}
      </main>
    </div>
  );
}

function SettingsSection() {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Settings</h1>
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Auto-fill Behavior</h2>
          <div className="space-y-4">
            {[
              { key: 'autoFillOnLoad', label: 'Auto-fill on page load', desc: 'Fill forms automatically when a page loads' },
              { key: 'skipFilledFields', label: 'Skip already-filled fields' },
              { key: 'autoUpload', label: 'Auto upload documents' },
              { key: 'highlightFilledFields', label: 'Highlight filled fields' },
              { key: 'pauseOnCaptcha', label: 'Pause on CAPTCHA detection' },
              { key: 'smartRetry', label: 'Smart retry on failure' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
                  {desc && <p className="text-xs text-slate-500">{desc}</p>}
                </div>
                <button
                  onClick={() => updateSettings({ [key]: !settings[key as keyof typeof settings] })}
                  className={cn(
                    'w-12 h-6 rounded-full transition-colors relative',
                    settings[key as keyof typeof settings] ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'
                  )}
                >
                  <span className={cn(
                    'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
                    settings[key as keyof typeof settings] ? 'translate-x-7' : 'translate-x-1'
                  )} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Keyboard Shortcuts</h2>
          <p className="text-sm text-slate-500 mb-4">
            Manage shortcuts via Chrome → Extensions → Keyboard shortcuts
          </p>
          <div className="space-y-2">
            {[
              { label: 'Auto-fill form', shortcut: 'Ctrl+Shift+F / ⌘+Shift+F' },
              { label: 'Random fill', shortcut: 'Ctrl+Shift+R / ⌘+Shift+R' },
              { label: 'Toggle auto-fill', shortcut: 'Ctrl+Shift+T / ⌘+Shift+T' },
            ].map(({ label, shortcut }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <p className="text-sm text-slate-700 dark:text-slate-300">{label}</p>
                <kbd className="px-3 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                  {shortcut}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilesSection() {
  const { profiles } = useProfileStore();
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Profiles</h1>
      <p className="text-sm text-slate-500 mb-4">Manage your profiles in the extension popup for a richer experience.</p>
      <div className="grid gap-3">
        {profiles.map(p => (
          <div key={p.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: p.color }}>
              {p.personal.firstName[0]}{p.personal.lastName[0]}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{p.name}</p>
              <p className="text-sm text-slate-500">{p.personal.fullName} · {p.personal.email}</p>
              {p.isDefault && <span className="text-xs text-brand-600 font-medium">Default</span>}
            </div>
          </div>
        ))}
        {profiles.length === 0 && (
          <p className="text-slate-400 text-center py-8">No profiles yet. Open the popup to create one.</p>
        )}
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Security</h1>
      <div className="space-y-4">
        {[
          {
            title: 'AES-256-GCM Encryption',
            desc: 'Sensitive fields (Aadhaar, PAN, Passport) are encrypted using the Web Crypto API before being stored in IndexedDB.',
          },
          {
            title: 'Local-only Storage',
            desc: 'All data is stored locally on your device using IndexedDB. No data is sent to any remote server.',
          },
          {
            title: 'Per-device Key',
            desc: 'A unique encryption key is generated for your device and stored in Chrome\'s local storage. Data cannot be decrypted on another device.',
          },
          {
            title: 'No Telemetry',
            desc: 'This extension does not collect usage data, analytics, or any personal information.',
          },
        ].map(({ title, desc }) => (
          <div key={title} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
                <p className="text-sm text-slate-500 mt-1">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">About</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Zap size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Indian Form AutoFill AI</h2>
            <p className="text-slate-500">Version 1.0.0</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          A production-grade Chrome Extension for automatically filling forms with realistic Indian data and personal profiles.
          Works on Naukri, LinkedIn, Indeed, Internshala, Workday, Greenhouse, Lever, and any HTML form.
        </p>
        <div className="grid grid-cols-2 gap-4 pt-2">
          {[
            { label: 'Smart Field Detection', desc: 'AI-powered field matching' },
            { label: 'Indian Data Generator', desc: '50+ realistic data fields' },
            { label: 'File Upload', desc: 'Resume, photos, documents' },
            { label: 'Encrypted Storage', desc: 'AES-256-GCM encryption' },
          ].map(({ label, desc }) => (
            <div key={label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
