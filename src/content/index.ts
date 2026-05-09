import { fillForm, highlightFields, clearHighlights } from './engine/formFiller';
import { detectFormFields } from './matchers/fieldMatcher';
import { startFormObserver } from './observers/mutationObserver';
import type { ExtensionMessage, ExtensionResponse } from '@/types/form.types';
import type { Profile } from '@/types/profile.types';
import type { Settings } from '@/types/settings.types';
import { generateIndianProfile } from '@/generators/indianDataGenerator';

let autoFillEnabled = false;
let currentSettings: Settings | null = null;

// ── Helpers ────────────────────────────────────────────────────────────────

async function getSettings(): Promise<Settings | null> {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ action: 'GET_SETTINGS' }, (response) => {
      resolve(response?.data ?? null);
    });
  });
}

async function getDefaultProfile(): Promise<Profile | null> {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ action: 'GET_DEFAULT_PROFILE' }, (response) => {
      resolve(response?.data ?? null);
    });
  });
}

async function getProfileById(id: string): Promise<Profile | null> {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ action: 'GET_PROFILE', payload: { id } }, (response) => {
      resolve(response?.data ?? null);
    });
  });
}

function randomProfileFromGenerator(): Profile {
  const data = generateIndianProfile();
  return {
    id: 'random',
    name: 'Random Profile',
    color: '#6366f1',
    isDefault: false,
    ...data,
    documents: { certificates: [] },
    customFields: [],
    domainBindings: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  };
}

// ── Message handler ────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  (async () => {
    let response: ExtensionResponse;

    switch (message.action) {
      case 'FILL_FORM': {
        const profileId = message.payload?.profileId as string | undefined;
        const profile = profileId
          ? await getProfileById(profileId)
          : await getDefaultProfile();

        if (!profile) {
          response = { success: false, error: 'No profile found' };
          break;
        }

        const settings = await getSettings();
        const report = await fillForm(profile, {
          delay: settings?.fillDelay ?? 50,
          skipFilled: settings?.skipFilledFields ?? true,
        });
        response = { success: true, data: report };
        break;
      }

      case 'RANDOM_FILL': {
        const profile = randomProfileFromGenerator();
        const settings = await getSettings();
        const report = await fillForm(profile, {
          delay: settings?.fillDelay ?? 50,
          skipFilled: false,
        });
        response = { success: true, data: report };
        break;
      }

      case 'GET_FORM_FIELDS': {
        const fields = detectFormFields().map(f => ({
          type: f.type,
          category: f.category,
          confidence: f.confidence,
          label: f.label,
          placeholder: f.placeholder,
          required: f.required,
        }));
        response = { success: true, data: { fields } };
        break;
      }

      case 'GET_PAGE_INFO': {
        response = {
          success: true,
          data: {
            url: window.location.href,
            title: document.title,
            fieldCount: detectFormFields().length,
          },
        };
        break;
      }

      case 'HIGHLIGHT_FIELDS': {
        const fields = detectFormFields();
        highlightFields(fields);
        response = { success: true, data: { highlighted: fields.length } };
        break;
      }

      case 'CLEAR_HIGHLIGHTS': {
        clearHighlights();
        response = { success: true };
        break;
      }

      default:
        response = { success: false, error: 'Unknown action' };
    }

    sendResponse(response);
  })();

  return true; // keep message channel open for async
});

// ── Init ───────────────────────────────────────────────────────────────────

async function init() {
  currentSettings = await getSettings();
  autoFillEnabled = currentSettings?.autoFillOnLoad ?? false;

  if (autoFillEnabled) {
    const profile = await getDefaultProfile();
    if (profile) {
      await fillForm(profile, { delay: currentSettings?.fillDelay ?? 50 });
    }
  }

  startFormObserver(async (_newForms) => {
    if (!autoFillEnabled) return;
    const profile = await getDefaultProfile();
    if (profile) {
      await fillForm(profile, { delay: currentSettings?.fillDelay ?? 50 });
    }
  });
}

init().catch(console.error);
