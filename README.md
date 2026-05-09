# Form Auto Filler AI

A production-grade Chrome Extension (Manifest V3) for auto-filling forms with realistic Indian data and personal profiles.

## Features

- **Smart Field Detection** — matches 40+ field types (name, phone, email, Aadhaar, PAN, resume, etc.) using keyword/regex scoring
- **Indian Data Generator** — generates realistic Indian profiles: names (500+ first/last names), states, cities, PAN, Aadhaar, companies, colleges
- **Multiple Profiles** — create/edit/delete saved profiles with personal, address, professional, identity, and document sections
- **Auto File Upload** — auto-uploads resume PDF, profile photo, Aadhaar/PAN via DataTransfer API
- **React SPA Support** — fires native + React synthetic events so controlled inputs update state
- **AES-256-GCM Encryption** — Aadhaar, PAN, Passport numbers encrypted before IndexedDB storage
- **Dark Mode** — full dark/light/system theme support
- **Context Menu** — right-click → AutoFill / Random Fill / Highlight fields
- **Keyboard Shortcuts** — Ctrl+Shift+F (fill), Ctrl+Shift+R (random), Ctrl+Shift+T (toggle)
- **AI Field Matching** — optional OpenAI / Claude backend for complex field names
- **Export/Import Profiles** — JSON backup/restore
- **Options Page** — full settings page in a new tab

## Works on

- Naukri, LinkedIn, Indeed, Internshala
- Workday, Greenhouse, Lever, iCIMS
- Generic HTML forms
- React, Angular, Vue SPAs
- Multi-step forms & modals

---

## Installation

### Prerequisites

- Node.js 18+
- npm 9+
- Chrome 120+

### 1. Clone & Install

```bash
cd form-filler
npm install
```

### 2. Build

```bash
npm run build
```

The built extension is in the `dist/` folder.

### 3. Load in Chrome

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `dist/` folder
5. The extension icon appears in the toolbar

---

## Development

```bash
npm run dev        # Watch mode — rebuilds on file change
npm test           # Run tests
npm run typecheck  # TypeScript check
npm run lint       # ESLint
```

After `npm run dev`, reload the extension in Chrome after each rebuild:
- Go to `chrome://extensions/`
- Click the refresh icon on the extension card

---

## Project Structure

```
src/
├── background/          # Service worker (context menus, shortcuts, message routing)
├── content/
│   ├── engine/
│   │   ├── formFiller.ts      # Core fill engine
│   │   ├── eventDispatcher.ts # Native + React event firing
│   │   └── fileUploader.ts    # DataTransfer file upload
│   ├── matchers/
│   │   └── fieldMatcher.ts    # 40+ field detection rules
│   └── observers/
│       └── mutationObserver.ts # SPA/dynamic form detection
├── popup/               # React popup UI (400×580px)
│   ├── pages/           # Dashboard, Profiles, RandomFill, UploadManager, Settings
│   └── components/      # ProfileFormModal (5-tab wizard)
├── options/             # Full options page
├── generators/
│   └── indianDataGenerator.ts # Realistic Indian fake data
├── crypto/
│   └── encryption.ts    # AES-256-GCM (Web Crypto API)
├── db/
│   ├── database.ts      # Dexie.js schema
│   └── repositories/    # profileRepository, settingsRepository
├── store/               # Zustand stores (profiles, settings)
├── ai/
│   └── fieldMatchingAI.ts # OpenAI/Claude abstraction layer
├── types/               # TypeScript interfaces
└── utils/               # cn(), logger, fileHelpers
```

---

## Security

| Feature | Implementation |
|---------|---------------|
| Sensitive field encryption | AES-256-GCM via Web Crypto API |
| Per-device key | Generated on first run, stored in `chrome.storage.local` |
| No remote storage | All data stored in IndexedDB on-device |
| No analytics | Zero telemetry |

---

## Building for Production

```bash
npm run build
```

The `dist/` folder is the complete extension. Zip it for Chrome Web Store submission:

```bash
cd dist && zip -r ../indian-autofill-ai.zip . && cd ..
```

---

## Publishing to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay the one-time $5 developer registration fee
3. Click **New Item** → Upload `indian-autofill-ai.zip`
4. Fill in:
   - Store listing (title, description, screenshots)
   - Category: Productivity
   - Privacy policy URL
5. Submit for review (typically 1–3 business days)

**Required assets for store listing:**
- 1280×800 or 640×400 promo image
- At least 1 screenshot (1280×800)
- 128×128 icon (already included)

---

## Performance Optimizations

- Lazy field detection — only runs when triggered
- MutationObserver for SPA forms (debounced internally)
- Configurable fill delay (0–150ms)
- React synthetic events prevent re-render loops
- Dexie.js with indexed queries for fast profile lookups
- Zustand with minimal re-renders

---

## Future Roadmap

- [ ] Cloud sync (Supabase / Firebase)
- [ ] Chrome Sync API for profile backup
- [ ] OCR for document parsing
- [ ] LinkedIn one-click profile import
- [ ] Resume PDF parser
- [ ] Form templates (Naukri-specific, LinkedIn-specific)
- [ ] Smart CAPTCHA detection and pause
- [ ] Auto-fill history / analytics dashboard
- [ ] Domain-specific profile auto-selection
- [ ] Team/enterprise profile sharing
