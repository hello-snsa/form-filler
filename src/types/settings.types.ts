export type Theme = 'light' | 'dark' | 'system';
export type MatchSensitivity = 'low' | 'medium' | 'high';
export type FillSpeed = 'instant' | 'fast' | 'human';

export interface ShortcutConfig {
  autofill: string;
  randomFill: string;
  toggleAutofill: string;
}

export interface AIConfig {
  enabled: boolean;
  provider: 'openai' | 'claude' | 'local' | 'none';
  apiKey?: string; // encrypted
  model?: string;
  endpoint?: string;
}

export interface Settings {
  theme: Theme;
  defaultProfileId: string | null;
  autoFillOnLoad: boolean;
  autoUpload: boolean;
  fillSpeed: FillSpeed;
  matchSensitivity: MatchSensitivity;
  enableAIMatching: boolean;
  enableOCR: boolean;
  showNotifications: boolean;
  highlightFilledFields: boolean;
  skipFilledFields: boolean;
  pauseOnCaptcha: boolean;
  smartRetry: boolean;
  shortcuts: ShortcutConfig;
  ai: AIConfig;
  trustedDomains: string[];
  blockedDomains: string[];
  fillDelay: number; // ms between field fills
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  defaultProfileId: null,
  autoFillOnLoad: false,
  autoUpload: true,
  fillSpeed: 'fast',
  matchSensitivity: 'medium',
  enableAIMatching: false,
  enableOCR: false,
  showNotifications: true,
  highlightFilledFields: true,
  skipFilledFields: true,
  pauseOnCaptcha: true,
  smartRetry: true,
  shortcuts: {
    autofill: 'Ctrl+Shift+F',
    randomFill: 'Ctrl+Shift+R',
    toggleAutofill: 'Ctrl+Shift+T',
  },
  ai: {
    enabled: false,
    provider: 'none',
  },
  trustedDomains: [],
  blockedDomains: [],
  fillDelay: 50,
};
