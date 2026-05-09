import { create } from 'zustand';
import { settingsRepository } from '@/db/repositories/settingsRepository';
import { DEFAULT_SETTINGS, type Settings } from '@/types/settings.types';

interface SettingsStore {
  settings: Settings;
  isLoading: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (partial: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const settings = await settingsRepository.get();
      set({ settings, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  updateSettings: async (partial) => {
    const updated = await settingsRepository.update(partial);
    set({ settings: updated });
  },

  resetSettings: async () => {
    const settings = await settingsRepository.reset();
    set({ settings });
  },
}));
