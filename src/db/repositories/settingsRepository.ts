import { db } from '@/db/database';
import { DEFAULT_SETTINGS, type Settings } from '@/types/settings.types';

export const settingsRepository = {
  async get(): Promise<Settings> {
    const record = await db.settings.get(1);
    if (!record) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...record.data };
  },

  async update(partial: Partial<Settings>): Promise<Settings> {
    const current = await this.get();
    const updated = { ...current, ...partial };
    await db.settings.put({
      id: 1,
      data: updated,
      updatedAt: new Date().toISOString(),
    });
    return updated;
  },

  async reset(): Promise<Settings> {
    await db.settings.put({
      id: 1,
      data: DEFAULT_SETTINGS,
      updatedAt: new Date().toISOString(),
    });
    return DEFAULT_SETTINGS;
  },
};
