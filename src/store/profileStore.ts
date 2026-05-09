import { create } from 'zustand';
import { profileRepository } from '@/db/repositories/profileRepository';
import type { Profile, ProfileCreateInput, ProfileUpdateInput } from '@/types/profile.types';

interface ProfileStore {
  profiles: Profile[];
  activeProfileId: string | null;
  isLoading: boolean;
  error: string | null;

  // Computed
  activeProfile: Profile | null;
  defaultProfile: Profile | null;

  // Actions
  loadProfiles: () => Promise<void>;
  createProfile: (input: ProfileCreateInput) => Promise<Profile>;
  updateProfile: (id: string, input: ProfileUpdateInput) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
  setActiveProfile: (id: string | null) => void;
  exportProfiles: () => Promise<string>;
  importProfiles: (json: string) => Promise<number>;
  clearError: () => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profiles: [],
  activeProfileId: null,
  isLoading: false,
  error: null,

  get activeProfile() {
    const { profiles, activeProfileId } = get();
    return profiles.find(p => p.id === activeProfileId) ?? null;
  },

  get defaultProfile() {
    return get().profiles.find(p => p.isDefault) ?? null;
  },

  loadProfiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const profiles = await profileRepository.getAll();
      const defaultProfile = profiles.find(p => p.isDefault);
      set({
        profiles,
        isLoading: false,
        activeProfileId: defaultProfile?.id ?? profiles[0]?.id ?? null,
      });
    } catch (e) {
      set({ isLoading: false, error: String(e) });
    }
  },

  createProfile: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileRepository.create(input);
      set(s => ({
        profiles: [profile, ...s.profiles],
        isLoading: false,
        activeProfileId: s.activeProfileId ?? profile.id,
      }));
      return profile;
    } catch (e) {
      set({ isLoading: false, error: String(e) });
      throw e;
    }
  },

  updateProfile: async (id, input) => {
    set({ error: null });
    try {
      const updated = await profileRepository.update(id, input);
      if (updated) {
        set(s => ({
          profiles: s.profiles.map(p => p.id === id ? updated : p),
        }));
      }
    } catch (e) {
      set({ error: String(e) });
    }
  },

  deleteProfile: async (id) => {
    await profileRepository.delete(id);
    set(s => {
      const profiles = s.profiles.filter(p => p.id !== id);
      const activeProfileId = s.activeProfileId === id
        ? (profiles[0]?.id ?? null)
        : s.activeProfileId;
      return { profiles, activeProfileId };
    });
  },

  setDefault: async (id) => {
    await profileRepository.setDefault(id);
    set(s => ({
      profiles: s.profiles.map(p => ({ ...p, isDefault: p.id === id })),
    }));
  },

  setActiveProfile: (id) => set({ activeProfileId: id }),

  exportProfiles: () => profileRepository.exportAll(),

  importProfiles: async (json) => {
    const count = await profileRepository.importAll(json);
    await get().loadProfiles();
    return count;
  },

  clearError: () => set({ error: null }),
}));
