import { profileRepository } from '@/db/repositories/profileRepository';
import { settingsRepository } from '@/db/repositories/settingsRepository';
import type { Settings } from '@/types/settings.types';
import type { Profile } from '@/types/profile.types';

// ── Context menus ──────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'autofill-default',
    title: 'AutoFill with default profile',
    contexts: ['page', 'editable'],
  });

  chrome.contextMenus.create({
    id: 'autofill-random',
    title: 'AutoFill with random Indian data',
    contexts: ['page', 'editable'],
  });

  chrome.contextMenus.create({
    id: 'highlight-fields',
    title: 'Highlight detected form fields',
    contexts: ['page'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;

  if (info.menuItemId === 'autofill-default') {
    chrome.tabs.sendMessage(tab.id, { action: 'FILL_FORM' });
  } else if (info.menuItemId === 'autofill-random') {
    chrome.tabs.sendMessage(tab.id, { action: 'RANDOM_FILL' });
  } else if (info.menuItemId === 'highlight-fields') {
    chrome.tabs.sendMessage(tab.id, { action: 'HIGHLIGHT_FIELDS' });
  }
});

// ── Keyboard shortcuts ─────────────────────────────────────────────────────

chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  if (command === 'autofill-form') {
    chrome.tabs.sendMessage(tab.id, { action: 'FILL_FORM' });
  } else if (command === 'random-fill') {
    chrome.tabs.sendMessage(tab.id, { action: 'RANDOM_FILL' });
  } else if (command === 'toggle-autofill') {
    const settings = await settingsRepository.get();
    await settingsRepository.update({ autoFillOnLoad: !settings.autoFillOnLoad });
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Indian Form AutoFill AI',
      message: `Auto-fill ${!settings.autoFillOnLoad ? 'enabled' : 'disabled'}`,
    });
  }
});

// ── Message routing ────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    let result;

    switch (message.action) {
      case 'GET_SETTINGS': {
        const settings: Settings = await settingsRepository.get();
        result = { success: true, data: settings };
        break;
      }
      case 'UPDATE_SETTINGS': {
        const updated = await settingsRepository.update(message.payload);
        result = { success: true, data: updated };
        break;
      }
      case 'GET_DEFAULT_PROFILE': {
        const profile: Profile | null = await profileRepository.getDefault();
        result = { success: true, data: profile };
        break;
      }
      case 'GET_PROFILE': {
        const profile = await profileRepository.getById(message.payload?.id);
        result = { success: true, data: profile };
        break;
      }
      case 'GET_ALL_PROFILES': {
        const profiles = await profileRepository.getAll();
        result = { success: true, data: profiles };
        break;
      }
      default:
        result = { success: false, error: 'Unknown action' };
    }

    sendResponse(result);
  })();

  return true; // async
});
