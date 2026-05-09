import React from 'react';
import { Moon, Sun, Monitor, Zap, Brain, Bell, Eye, RotateCcw } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@/utils/cn';
import type { Theme, MatchSensitivity, FillSpeed } from '@/types/settings.types';

function ToggleRow({
  label, description, value, onChange,
}: {
  label: string; description?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex-1 pr-3">
        <p className="text-sm text-slate-800 dark:text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          'w-11 h-6 rounded-full transition-colors relative shrink-0',
          value ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'
        )}
      >
        <span className={cn(
          'absolute left-0 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
          value ? 'translate-x-6' : 'translate-x-1'
        )} />
      </button>
    </div>
  );
}

function SelectRow<T extends string>({
  label, value, options, onChange,
}: {
  label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <p className="text-sm text-slate-800 dark:text-slate-200">{label}</p>
      <select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        className="text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();

  const u = (partial: Parameters<typeof updateSettings>[0]) => updateSettings(partial);

  const themeOptions = [
    { icon: Sun, label: 'Light', value: 'light' as Theme },
    { icon: Moon, label: 'Dark', value: 'dark' as Theme },
    { icon: Monitor, label: 'System', value: 'system' as Theme },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 space-y-5">
        {/* Theme */}
        <section>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Appearance</p>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => u({ theme: opt.value })}
                className={cn(
                  'flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-xs font-medium transition-colors',
                  settings.theme === opt.value
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                )}
              >
                <opt.icon size={16} />
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Auto-fill */}
        <section>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1">
            <Zap size={12} /> Auto-fill Behavior
          </p>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-3">
            <ToggleRow
              label="Auto-fill on page load"
              description="Automatically fill forms when a page loads"
              value={settings.autoFillOnLoad}
              onChange={v => u({ autoFillOnLoad: v })}
            />
            <ToggleRow
              label="Skip already filled fields"
              value={settings.skipFilledFields}
              onChange={v => u({ skipFilledFields: v })}
            />
            <ToggleRow
              label="Auto upload documents"
              description="Automatically upload resume and documents"
              value={settings.autoUpload}
              onChange={v => u({ autoUpload: v })}
            />
            <ToggleRow
              label="Highlight filled fields"
              value={settings.highlightFilledFields}
              onChange={v => u({ highlightFilledFields: v })}
            />
            <ToggleRow
              label="Pause on CAPTCHA"
              value={settings.pauseOnCaptcha}
              onChange={v => u({ pauseOnCaptcha: v })}
            />
            <SelectRow<FillSpeed>
              label="Fill speed"
              value={settings.fillSpeed}
              options={[
                { value: 'instant', label: 'Instant' },
                { value: 'fast', label: 'Fast (50ms)' },
                { value: 'human', label: 'Human (150ms)' },
              ]}
              onChange={v => u({ fillSpeed: v, fillDelay: v === 'instant' ? 0 : v === 'fast' ? 50 : 150 })}
            />
            <SelectRow<MatchSensitivity>
              label="Field match sensitivity"
              value={settings.matchSensitivity}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              onChange={v => u({ matchSensitivity: v })}
            />
          </div>
        </section>

        {/* AI */}
        <section>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1">
            <Brain size={12} /> AI Matching
          </p>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-3">
            <ToggleRow
              label="Enable AI field matching"
              description="Uses AI to improve accuracy on complex forms"
              value={settings.enableAIMatching}
              onChange={v => u({ enableAIMatching: v })}
            />
            {settings.enableAIMatching && (
              <div className="py-2.5 space-y-2">
                <SelectRow
                  label="AI Provider"
                  value={settings.ai.provider}
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'openai', label: 'OpenAI' },
                    { value: 'claude', label: 'Claude' },
                  ]}
                  onChange={v => u({ ai: { ...settings.ai, provider: v as 'none' | 'openai' | 'claude' } })}
                />
                {settings.ai.provider !== 'none' && (
                  <div>
                    <label className="label">API Key</label>
                    <input
                      type="password"
                      className="input text-xs"
                      placeholder="sk-…"
                      value={settings.ai.apiKey ?? ''}
                      onChange={e => u({ ai: { ...settings.ai, apiKey: e.target.value } })}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Notifications */}
        <section>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1">
            <Bell size={12} /> Notifications
          </p>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-3">
            <ToggleRow
              label="Show notifications"
              value={settings.showNotifications}
              onChange={v => u({ showNotifications: v })}
            />
          </div>
        </section>

        {/* Shortcuts */}
        <section>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Keyboard Shortcuts</p>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-3 divide-y divide-slate-100 dark:divide-slate-800">
            {[
              { label: 'Auto-fill form', key: settings.shortcuts.autofill },
              { label: 'Random fill', key: settings.shortcuts.randomFill },
              { label: 'Toggle auto-fill', key: settings.shortcuts.toggleAutofill },
            ].map(({ label, key }) => (
              <div key={label} className="flex items-center justify-between py-2.5">
                <p className="text-sm text-slate-700 dark:text-slate-300">{label}</p>
                <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Edit shortcuts in Chrome Extensions → Keyboard shortcuts
          </p>
        </section>

        {/* Reset */}
        <button
          onClick={() => { if (confirm('Reset all settings to defaults?')) resetSettings(); }}
          className="btn-ghost btn-sm gap-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full justify-center"
        >
          <RotateCcw size={13} />
          Reset to defaults
        </button>

        <p className="text-center text-xs text-slate-400 pb-2">
          Form Auto Filler AI v1.0.0
        </p>
      </div>
    </div>
  );
}
