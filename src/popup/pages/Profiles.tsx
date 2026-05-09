import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Star, Trash2, Edit3, Download, Upload, Search, CheckCircle } from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';
import { cn } from '@/utils/cn';
import ProfileFormModal from '../components/ProfileFormModal';
import type { Profile } from '@/types/profile.types';
import { downloadJson, readJsonFile } from '@/utils/fileHelpers';

export default function Profiles() {
  const { profiles, activeProfileId, setActiveProfile, setDefault, deleteProfile, exportProfiles, importProfiles } = useProfileStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const filtered = profiles.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.personal.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = async () => {
    const json = await exportProfiles();
    downloadJson(JSON.parse(json), `autofill-profiles-${Date.now()}.json`);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const json = await readJsonFile(file);
      const count = await importProfiles(JSON.stringify(json));
      setImportError(`Imported ${count} profiles`);
    } catch {
      setImportError('Invalid file');
    }
    e.target.value = '';
    setTimeout(() => setImportError(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirmId === id) {
      await deleteProfile(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-4 space-y-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search profiles…"
              className="input pl-8 py-1.5 text-xs h-8"
            />
          </div>
          <button
            onClick={() => { setEditingProfile(null); setShowForm(true); }}
            className="btn-primary btn-sm gap-1"
          >
            <Plus size={14} />
            New
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn-ghost btn-sm gap-1 text-xs">
            <Download size={12} />Export
          </button>
          <label className="btn-ghost btn-sm gap-1 text-xs cursor-pointer">
            <Upload size={12} />Import
            <input type="file" accept=".json" className="hidden" onChange={handleImportFile} />
          </label>
          {importError && (
            <span className="text-xs text-green-600 dark:text-green-400 ml-auto">{importError}</span>
          )}
        </div>
      </div>

      {/* Profile list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">No profiles found</p>
              <p className="text-xs mt-1">Create your first profile to get started</p>
            </div>
          )}
          {filtered.map(profile => (
            <motion.div
              key={profile.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className={cn(
                'p-3 rounded-xl border cursor-pointer transition-all',
                activeProfileId === profile.id
                  ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20 dark:border-brand-600'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
              )}
              onClick={() => setActiveProfile(profile.id)}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: profile.color }}
                >
                  {profile.personal.firstName[0]}{profile.personal.lastName[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {profile.name}
                    </p>
                    {profile.isDefault && (
                      <span className="badge-blue shrink-0 text-[10px]">Default</span>
                    )}
                    {activeProfileId === profile.id && (
                      <CheckCircle size={12} className="text-brand-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {profile.personal.fullName} · {profile.personal.email}
                  </p>
                  {profile.professional.currentCompany && (
                    <p className="text-xs text-slate-400 truncate">{profile.professional.currentCompany}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setDefault(profile.id)}
                    className={cn(
                      'p-1.5 rounded-md transition-colors',
                      profile.isDefault
                        ? 'text-amber-500'
                        : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                    )}
                    title="Set as default"
                  >
                    <Star size={13} fill={profile.isDefault ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => { setEditingProfile(profile); setShowForm(true); }}
                    className="p-1.5 rounded-md text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    title="Edit"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className={cn(
                      'p-1.5 rounded-md transition-colors',
                      deleteConfirmId === profile.id
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    )}
                    title={deleteConfirmId === profile.id ? 'Click again to confirm' : 'Delete'}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Profile form modal */}
      <AnimatePresence>
        {showForm && (
          <ProfileFormModal
            profile={editingProfile}
            onClose={() => { setShowForm(false); setEditingProfile(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
