import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, Shuffle, User, ChevronRight, CheckCircle, AlertCircle, Loader2,
  ToggleLeft, ToggleRight, Globe, FileText
} from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@/utils/cn';
import type { Page } from './types';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

type FillStatus = 'idle' | 'filling' | 'success' | 'error';

interface FillResult {
  filled: number;
  total: number;
  url: string;
}

async function sendToContentScript(action: string, payload?: Record<string, unknown>) {
  return new Promise<{ success: boolean; data?: unknown; error?: string }>((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) {
        resolve({ success: false, error: 'No active tab' });
        return;
      }
      chrome.tabs.sendMessage(tab.id, { action, payload }, (response) => {
        if (chrome.runtime.lastError) {
          resolve({ success: false, error: chrome.runtime.lastError.message });
          return;
        }
        resolve(response ?? { success: false, error: 'No response' });
      });
    });
  });
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { profiles, activeProfile, defaultProfile } = useProfileStore();
  const { settings, updateSettings } = useSettingsStore();
  const [fillStatus, setFillStatus] = useState<FillStatus>('idle');
  const [fillResult, setFillResult] = useState<FillResult | null>(null);
  const [pageInfo, setPageInfo] = useState<{ fieldCount: number; url: string } | null>(null);

  const displayProfile = activeProfile ?? defaultProfile ?? profiles[0] ?? null;

  const handleFill = useCallback(async (mode: 'profile' | 'random') => {
    setFillStatus('filling');
    setFillResult(null);

    const action = mode === 'random' ? 'RANDOM_FILL' : 'FILL_FORM';
    const payload = mode === 'profile' && displayProfile
      ? { profileId: displayProfile.id }
      : undefined;

    const response = await sendToContentScript(action, payload);

    if (response.success) {
      const data = response.data as { filledFields: number; totalFields: number; url: string };
      setFillResult({ filled: data.filledFields, total: data.totalFields, url: data.url });
      setFillStatus('success');
    } else {
      setFillStatus('error');
    }

    setTimeout(() => setFillStatus('idle'), 3000);
  }, [displayProfile]);

  const handleScanPage = useCallback(async () => {
    const response = await sendToContentScript('GET_PAGE_INFO');
    if (response.success) {
      const data = response.data as { fieldCount: number; url: string };
      setPageInfo(data);
    }
  }, []);

  const handleHighlight = useCallback(async () => {
    await sendToContentScript('HIGHLIGHT_FIELDS');
  }, []);

  React.useEffect(() => {
    handleScanPage();
  }, [handleScanPage]);

  return (
    <div className="p-4 space-y-4">
      {/* Active profile chip */}
      {displayProfile && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
              style={{ backgroundColor: displayProfile.color }}
            >
              {displayProfile.personal.firstName[0]}{displayProfile.personal.lastName[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {displayProfile.personal.fullName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{displayProfile.name}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('profiles')}
            className="text-brand-500 hover:text-brand-600 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {!displayProfile && (
        <div
          className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:border-brand-400 transition-colors"
          onClick={() => onNavigate('profiles')}
        >
          <User size={20} className="text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No profile yet</p>
            <p className="text-xs text-slate-500">Click to create your first profile</p>
          </div>
        </div>
      )}

      {/* Page scan info */}
      {pageInfo && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <Globe size={12} />
          <span className="truncate">{pageInfo.url.replace(/^https?:\/\//, '').slice(0, 40)}</span>
          <span className="ml-auto shrink-0 font-medium text-brand-600 dark:text-brand-400">
            {pageInfo.fieldCount} fields
          </span>
        </div>
      )}

      {/* Fill status */}
      {fillStatus !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium',
            fillStatus === 'filling' && 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
            fillStatus === 'success' && 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
            fillStatus === 'error' && 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
          )}
        >
          {fillStatus === 'filling' && <Loader2 size={15} className="animate-spin" />}
          {fillStatus === 'success' && <CheckCircle size={15} />}
          {fillStatus === 'error' && <AlertCircle size={15} />}
          {fillStatus === 'filling' && 'Filling form…'}
          {fillStatus === 'success' && fillResult && fillResult.filled > 0 && `Filled ${fillResult.filled}/${fillResult.total} fields`}
          {fillStatus === 'success' && fillResult && fillResult.filled === 0 && 'No fields filled — try ⌘⇧F inside the modal'}
          {fillStatus === 'error' && 'Fill failed — try refreshing the page'}
        </motion.div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleFill('profile')}
          disabled={!displayProfile || fillStatus === 'filling'}
          className="btn-primary btn-lg flex-col gap-1.5 py-4 rounded-xl disabled:opacity-50"
        >
          {fillStatus === 'filling' ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <Zap size={22} />
          )}
          <span className="text-sm">Quick Fill</span>
          <span className="text-xs opacity-75">Use saved profile</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleFill('random')}
          disabled={fillStatus === 'filling'}
          className="btn-secondary btn-lg flex-col gap-1.5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-50"
        >
          <Shuffle size={22} className="text-accent-500" />
          <span className="text-sm">Random Fill</span>
          <span className="text-xs text-slate-500">Generate Indian data</span>
        </motion.button>
      </div>

      {/* Secondary actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleHighlight}
          className="btn-ghost btn-sm flex-col gap-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <FileText size={15} />
          <span className="text-xs">Highlight</span>
        </button>

        <button
          onClick={() => onNavigate('profiles')}
          className="btn-ghost btn-sm flex-col gap-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <User size={15} />
          <span className="text-xs">Profiles</span>
        </button>

        <button
          onClick={() => onNavigate('random')}
          className="btn-ghost btn-sm flex-col gap-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <Shuffle size={15} />
          <span className="text-xs">Generate</span>
        </button>
      </div>

      {/* Auto-fill toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Auto-fill on page load</p>
          <p className="text-xs text-slate-500">Automatically fill when page opens</p>
        </div>
        <button
          onClick={() => updateSettings({ autoFillOnLoad: !settings.autoFillOnLoad })}
          className="text-brand-500 transition-colors"
        >
          {settings.autoFillOnLoad ? (
            <ToggleRight size={28} className="text-brand-500" />
          ) : (
            <ToggleLeft size={28} className="text-slate-400" />
          )}
        </button>
      </div>

      {/* Profile count footer */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        {profiles.length} profile{profiles.length !== 1 ? 's' : ''} saved
        {' · '}
        <button className="text-brand-500 hover:underline" onClick={() => onNavigate('settings')}>
          Settings
        </button>
      </p>
    </div>
  );
}
