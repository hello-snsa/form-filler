import { db } from '@/db/database';
import type { Profile, ProfileCreateInput, ProfileUpdateInput } from '@/types/profile.types';
import { encrypt, decrypt } from '@/crypto/encryption';

const SENSITIVE_FIELDS: (keyof Profile['identity'])[] = ['aadhaarNumber', 'panNumber', 'passportNumber', 'drivingLicense'];

async function encryptIdentity(identity: Profile['identity']): Promise<Profile['identity']> {
  const result = { ...identity };
  for (const key of SENSITIVE_FIELDS) {
    const val = result[key];
    if (typeof val === 'string' && val) {
      result[key] = await encrypt(val);
    }
  }
  return result;
}

async function decryptIdentity(identity: Profile['identity']): Promise<Profile['identity']> {
  const result = { ...identity };
  for (const key of SENSITIVE_FIELDS) {
    const val = result[key];
    if (typeof val === 'string' && val) {
      try {
        result[key] = await decrypt(val);
      } catch {
        // not encrypted
      }
    }
  }
  return result;
}

export const profileRepository = {
  async getAll(): Promise<Profile[]> {
    const records = await db.profiles.orderBy('updatedAt').reverse().toArray();
    return Promise.all(records.map(async (r) => {
      const { _id: _, ...profile } = r;
      return { ...profile, identity: await decryptIdentity(profile.identity) };
    }));
  },

  async getById(id: string): Promise<Profile | null> {
    const record = await db.profiles.where('id').equals(id).first();
    if (!record) return null;
    const { _id: _, ...profile } = record;
    return { ...profile, identity: await decryptIdentity(profile.identity) };
  },

  async getDefault(): Promise<Profile | null> {
    const record = await db.profiles.where('isDefault').equals(1 as unknown as string).first();
    if (!record) return null;
    const { _id: _, ...profile } = record;
    return { ...profile, identity: await decryptIdentity(profile.identity) };
  },

  async create(input: ProfileCreateInput): Promise<Profile> {
    const now = new Date().toISOString();
    const profile: Profile = {
      ...input,
      id: crypto.randomUUID(),
      identity: await encryptIdentity(input.identity),
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    await db.profiles.add(profile as Profile & { _id?: number });
    return { ...profile, identity: input.identity };
  },

  async update(id: string, input: ProfileUpdateInput): Promise<Profile | null> {
    const existing = await db.profiles.where('id').equals(id).first();
    if (!existing) return null;

    const identity = input.identity ? await encryptIdentity(input.identity) : existing.identity;
    const updated: Partial<Profile> = {
      ...input,
      identity,
      updatedAt: new Date().toISOString(),
      version: existing.version + 1,
    };

    await db.profiles.where('id').equals(id).modify(updated);
    const result = await this.getById(id);
    return result;
  },

  async delete(id: string): Promise<void> {
    await db.profiles.where('id').equals(id).delete();
  },

  async setDefault(id: string): Promise<void> {
    await db.profiles.toCollection().modify({ isDefault: false });
    await db.profiles.where('id').equals(id).modify({ isDefault: true });
  },

  async exportAll(): Promise<string> {
    const profiles = await this.getAll();
    return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), profiles }, null, 2);
  },

  async importAll(json: string): Promise<number> {
    const data = JSON.parse(json);
    const profiles: Profile[] = data.profiles ?? [];
    let imported = 0;
    for (const profile of profiles) {
      const existing = await db.profiles.where('id').equals(profile.id).first();
      if (!existing) {
        await db.profiles.add({
          ...profile,
          identity: await encryptIdentity(profile.identity),
        } as Profile & { _id?: number });
        imported++;
      }
    }
    return imported;
  },

  async count(): Promise<number> {
    return db.profiles.count();
  },
};
