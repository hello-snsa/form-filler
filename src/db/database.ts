import Dexie, { type Table } from 'dexie';
import type { Profile } from '@/types/profile.types';
import type { Settings } from '@/types/settings.types';
import type { FormFillReport } from '@/types/form.types';

export interface ProfileRecord extends Profile {
  _id?: number; // Dexie auto-increment key
}

export interface SettingsRecord {
  id: 1; // singleton
  data: Settings;
  updatedAt: string;
}

export interface FileBlobRecord {
  id: string;
  name: string;
  type: string;
  size: number;
  blob: Blob;
  createdAt: string;
}

export interface FormHistoryRecord extends FormFillReport {
  _id?: number;
}

class AppDatabase extends Dexie {
  profiles!: Table<ProfileRecord, number>;
  settings!: Table<SettingsRecord, number>;
  fileBlobs!: Table<FileBlobRecord, string>;
  formHistory!: Table<FormHistoryRecord, number>;

  constructor() {
    super('IndianFormAutofillAI');
    this.version(1).stores({
      profiles: '++_id, id, name, isDefault, updatedAt',
      settings: 'id',
      fileBlobs: 'id, name, createdAt',
      formHistory: '++_id, url, timestamp, profileId',
    });
  }
}

export const db = new AppDatabase();
