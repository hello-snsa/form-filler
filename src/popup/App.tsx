import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, User, Shuffle, Upload, Settings, ChevronLeft } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Profiles from './pages/Profiles';
import RandomFill from './pages/RandomFill';
import UploadManager from './pages/UploadManager';
import SettingsPage from './pages/SettingsPage';
import { useProfileStore } from '@/store/profileStore';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@/utils/cn';

type Page = 'dashboard' | 'profiles' | 'random' | 'uploads' | 'settings';

const NAV = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profiles' as Page, label: 'Profiles', icon: User },
  { id: 'random' as Page, label: 'Random Fill', icon: Shuffle },
  { id: 'uploads' as Page, label: 'Uploads', icon: Upload },
  { id: 'settings' as Page, label: 'Settings', icon: Settings },
];

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const { loadProfiles } = useProfileStore();
  const { settings, loadSettings } = useSettingsStore();

  useEffect(() => {
    loadProfiles();
    loadSettings();
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }, [settings.theme]);

  const pageContent: Record<Page, React.ReactNode> = {
    dashboard: <Dashboard onNavigate={setPage} />,
    profiles: <Profiles />,
    random: <RandomFill />,
    uploads: <UploadManager />,
    settings: <SettingsPage />,
  };

  return (
    <div className="flex flex-col w-[400px] min-h-[580px] max-h-[600px] bg-white dark:bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-brand-600 to-accent-600">
        <div className="flex items-center gap-2">
          {page !== 'dashboard' && (
            <button
              onClick={() => setPage('dashboard')}
              className="text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <span className="text-white font-semibold text-sm">Indian AutoFill AI</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {NAV.slice(1).map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                page === item.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
              title={item.label}
            >
              <item.icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {pageContent[page]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
