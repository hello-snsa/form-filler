import { c as createLucideIcon, r as reactExports, a as useSettingsStore, u as useProfileStore, j as jsxRuntimeExports, Z as Zap, S as Settings, b as cn, d as client, R as React } from "./globals-BbbGDKs3.js";
import "./settingsRepository-BCIK-jsw.js";
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Info = createLucideIcon("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Shield = createLucideIcon("Shield", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
]);
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Users = createLucideIcon("Users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }]
]);
function OptionsApp() {
  const [tab, setTab] = reactExports.useState("settings");
  const { loadSettings } = useSettingsStore();
  const { loadProfiles } = useProfileStore();
  reactExports.useEffect(() => {
    loadSettings();
    loadProfiles();
  }, []);
  const nav = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "profiles", label: "Profiles", icon: Users },
    { id: "security", label: "Security", icon: Shield },
    { id: "about", label: "About", icon: Info }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50 dark:bg-slate-900 flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-56 border-r border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6 px-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16, className: "text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-slate-900 dark:text-white", children: "Form Auto Filler AI" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "AI Form Filler" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "space-y-1", children: nav.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setTab(item.id),
          className: cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
            tab === item.id ? "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { size: 16 }),
            item.label
          ]
        },
        item.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 p-8 max-w-3xl", children: [
      tab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsSection, {}),
      tab === "profiles" && /* @__PURE__ */ jsxRuntimeExports.jsx(ProfilesSection, {}),
      tab === "security" && /* @__PURE__ */ jsxRuntimeExports.jsx(SecuritySection, {}),
      tab === "about" && /* @__PURE__ */ jsxRuntimeExports.jsx(AboutSection, {})
    ] })
  ] });
}
function SettingsSection() {
  const { settings, updateSettings } = useSettingsStore();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white mb-6", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-slate-900 dark:text-white mb-4", children: "Auto-fill Behavior" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [
          { key: "autoFillOnLoad", label: "Auto-fill on page load", desc: "Fill forms automatically when a page loads" },
          { key: "skipFilledFields", label: "Skip already-filled fields" },
          { key: "autoUpload", label: "Auto upload documents" },
          { key: "highlightFilledFields", label: "Highlight filled fields" },
          { key: "pauseOnCaptcha", label: "Pause on CAPTCHA detection" },
          { key: "smartRetry", label: "Smart retry on failure" }
        ].map(({ key, label, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-800 dark:text-slate-200", children: label }),
            desc && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => updateSettings({ [key]: !settings[key] }),
              className: cn(
                "w-12 h-6 rounded-full transition-colors relative",
                settings[key] ? "bg-brand-500" : "bg-slate-200 dark:bg-slate-700"
              ),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
                "absolute left-0 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
                settings[key] ? "translate-x-7" : "translate-x-1"
              ) })
            }
          )
        ] }, key)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-slate-900 dark:text-white mb-4", children: "Keyboard Shortcuts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mb-4", children: "Manage shortcuts via Chrome → Extensions → Keyboard shortcuts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [
          { label: "Auto-fill form", shortcut: "Ctrl+Shift+F / ⌘+Shift+F" },
          { label: "Random fill", shortcut: "Ctrl+Shift+R / ⌘+Shift+R" },
          { label: "Toggle auto-fill", shortcut: "Ctrl+Shift+T / ⌘+Shift+T" }
        ].map(({ label, shortcut }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-700 dark:text-slate-300", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-3 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600", children: shortcut })
        ] }, label)) })
      ] })
    ] })
  ] });
}
function ProfilesSection() {
  const { profiles } = useProfileStore();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white mb-6", children: "Profiles" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mb-4", children: "Manage your profiles in the extension popup for a richer experience." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
      profiles.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold", style: { backgroundColor: p.color }, children: [
          p.personal.firstName[0],
          p.personal.lastName[0]
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-slate-900 dark:text-white", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500", children: [
            p.personal.fullName,
            " · ",
            p.personal.email
          ] }),
          p.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-brand-600 font-medium", children: "Default" })
        ] })
      ] }, p.id)),
      profiles.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-center py-8", children: "No profiles yet. Open the popup to create one." })
    ] })
  ] });
}
function SecuritySection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white mb-6", children: "Security" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [
      {
        title: "AES-256-GCM Encryption",
        desc: "Sensitive fields (Aadhaar, PAN, Passport) are encrypted using the Web Crypto API before being stored in IndexedDB."
      },
      {
        title: "Local-only Storage",
        desc: "All data is stored locally on your device using IndexedDB. No data is sent to any remote server."
      },
      {
        title: "Per-device Key",
        desc: "A unique encryption key is generated for your device and stored in Chrome's local storage. Data cannot be decrypted on another device."
      },
      {
        title: "No Telemetry",
        desc: "This extension does not collect usage data, analytics, or any personal information."
      }
    ].map(({ title, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 20, className: "text-green-500 mt-0.5 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-slate-900 dark:text-white", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-1", children: desc })
      ] })
    ] }) }, title)) })
  ] });
}
function AboutSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white mb-6", children: "About" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 28, className: "text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white", children: "Form Auto Filler AI" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500", children: "Version 1.0.0" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 leading-relaxed", children: "A production-grade Chrome Extension for automatically filling forms with realistic Indian data and personal profiles. Works on Naukri, LinkedIn, Indeed, Internshala, Workday, Greenhouse, Lever, and any HTML form." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 pt-2", children: [
        { label: "Smart Field Detection", desc: "AI-powered field matching" },
        { label: "Indian Data Generator", desc: "50+ realistic data fields" },
        { label: "File Upload", desc: "Resume, photos, documents" },
        { label: "Encrypted Storage", desc: "AES-256-GCM encryption" }
      ].map(({ label, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-800 dark:text-slate-200", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: desc })
      ] }, label)) })
    ] })
  ] });
}
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(OptionsApp, {}) })
);
