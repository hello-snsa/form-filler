(function() {
  "use strict";
  const RULES = [
    // ── Name fields ───────────────────────────────────────────────────────
    {
      category: "fullName",
      keywords: ["full name", "fullname", "complete name", "name", "your name", "applicant name", "candidate name"],
      patterns: [/full[\s_-]?name/i, /complete[\s_-]?name/i],
      priority: 10
    },
    {
      category: "firstName",
      keywords: ["first name", "firstname", "given name", "fname", "first"],
      patterns: [/first[\s_-]?name/i, /given[\s_-]?name/i, /^fname$/i],
      priority: 10
    },
    {
      category: "lastName",
      keywords: ["last name", "lastname", "surname", "family name", "lname"],
      patterns: [/last[\s_-]?name/i, /sur[\s_-]?name/i, /family[\s_-]?name/i, /^lname$/i],
      priority: 10
    },
    {
      category: "fatherName",
      keywords: ["father's name", "father name", "fathername", "dad name", "guardian's name"],
      patterns: [/father['s]?[\s_-]?name/i, /guardian[\s_-]?name/i],
      priority: 9
    },
    // ── Contact fields ────────────────────────────────────────────────────
    {
      category: "email",
      keywords: ["email", "e-mail", "mail id", "email address", "email id", "electronic mail"],
      patterns: [/e[\s_-]?mail/i, /mail[\s_-]?id/i],
      priority: 10
    },
    {
      category: "phone",
      keywords: ["phone", "mobile", "cell", "contact number", "phone number", "mobile number", "whatsapp", "contact no"],
      patterns: [/phone[\s_-]?(number|no)?/i, /mobile[\s_-]?(number|no)?/i, /contact[\s_-]?(number|no)?/i],
      priority: 10
    },
    {
      category: "alternatePhone",
      keywords: ["alternate phone", "alternate mobile", "alternative phone", "other number", "secondary phone", "alt phone"],
      patterns: [/alt(ernate)?[\s_-]?phone/i, /alt(ernate)?[\s_-]?mobile/i, /secondary[\s_-]?phone/i],
      priority: 9
    },
    // ── Personal info ─────────────────────────────────────────────────────
    {
      category: "dob",
      keywords: ["date of birth", "dob", "birth date", "birthday", "born on", "date of birth (dd/mm/yyyy)"],
      patterns: [/date[\s_-]?of[\s_-]?birth/i, /d[\s_-]?o[\s_-]?b/i, /birth[\s_-]?date/i],
      priority: 10
    },
    {
      category: "gender",
      keywords: ["gender", "sex", "male/female", "gender identity"],
      patterns: [/^gender$/i, /^sex$/i],
      priority: 10
    },
    {
      category: "maritalStatus",
      keywords: ["marital status", "marital", "married", "marriage status"],
      patterns: [/marital[\s_-]?status/i],
      priority: 9
    },
    {
      category: "nationality",
      keywords: ["nationality", "citizenship", "country of citizenship"],
      patterns: [/national(ity)?/i, /citizen(ship)?/i],
      priority: 9
    },
    // ── Address fields ────────────────────────────────────────────────────
    {
      category: "address",
      keywords: ["address", "street address", "current address", "residential address", "home address", "line 1", "address line"],
      patterns: [/address/i, /street/i],
      priority: 8
    },
    {
      category: "city",
      keywords: ["city", "town", "district", "locality", "tehsil"],
      patterns: [/^city$/i, /^town$/i, /^district$/i],
      priority: 9
    },
    {
      category: "state",
      keywords: ["state", "province", "region"],
      patterns: [/^state$/i, /^province$/i],
      priority: 9
    },
    {
      category: "country",
      keywords: ["country", "nation"],
      patterns: [/^country$/i, /^nation$/i],
      priority: 9
    },
    {
      category: "pincode",
      keywords: ["pin code", "pincode", "zip code", "zipcode", "postal code", "zip", "pin", "post code"],
      patterns: [/pin[\s_-]?code/i, /zip[\s_-]?code/i, /postal[\s_-]?code/i, /^pin$/i, /^zip$/i],
      priority: 10
    },
    // ── Professional fields ───────────────────────────────────────────────
    {
      category: "company",
      keywords: ["company", "organization", "organisation", "employer", "current company", "workplace", "company name"],
      patterns: [/company[\s_-]?name/i, /organization/i, /employer/i],
      priority: 9
    },
    {
      category: "designation",
      keywords: ["designation", "job title", "position", "role", "current role", "title"],
      patterns: [/designation/i, /job[\s_-]?title/i, /^position$/i, /^role$/i],
      priority: 9
    },
    {
      category: "experience",
      keywords: ["experience", "work experience", "years of experience", "total experience", "exp"],
      patterns: [/experience/i, /years?[\s_-]?of[\s_-]?exp/i],
      priority: 9
    },
    {
      category: "skills",
      keywords: ["skills", "key skills", "technical skills", "competencies", "expertise", "technologies"],
      patterns: [/skill/i, /competenc/i, /technolog/i],
      priority: 8
    },
    {
      category: "noticePeriod",
      keywords: ["notice period", "notice", "joining", "can join in", "available in"],
      patterns: [/notice[\s_-]?period/i, /join(ing)?[\s_-]?(time|period)?/i],
      priority: 9
    },
    {
      category: "currentSalary",
      keywords: ["current salary", "current ctc", "ctc", "salary", "annual salary", "current package", "expected ctc"],
      patterns: [/current[\s_-]?(salary|ctc|package)/i, /annual[\s_-]?(salary|ctc)/i],
      priority: 9
    },
    {
      category: "expectedSalary",
      keywords: ["expected salary", "expected ctc", "desired salary", "expected package", "salary expectation"],
      patterns: [/expected[\s_-]?(salary|ctc|package)/i, /desired[\s_-]?salary/i],
      priority: 9
    },
    // ── Education ─────────────────────────────────────────────────────────
    {
      category: "college",
      keywords: ["college", "university", "institution", "institute", "school name", "alma mater"],
      patterns: [/college/i, /university/i, /institution/i, /institute/i],
      priority: 8
    },
    {
      category: "degree",
      keywords: ["degree", "qualification", "education", "course", "program"],
      patterns: [/^degree$/i, /qualification/i],
      priority: 8
    },
    {
      category: "graduationYear",
      keywords: ["graduation year", "passing year", "year of passing", "completion year"],
      patterns: [/graduation[\s_-]?year/i, /pass(ing)?[\s_-]?year/i],
      priority: 8
    },
    {
      category: "cgpa",
      keywords: ["cgpa", "gpa", "percentage", "marks", "score", "grade"],
      patterns: [/cgpa/i, /^gpa$/i, /percentage/i],
      priority: 7
    },
    // ── Social links ──────────────────────────────────────────────────────
    {
      category: "linkedinUrl",
      keywords: ["linkedin", "linkedin url", "linkedin profile"],
      patterns: [/linkedin/i],
      priority: 10
    },
    {
      category: "githubUrl",
      keywords: ["github", "github url", "github profile", "git url"],
      patterns: [/github/i, /gitlab/i],
      priority: 10
    },
    {
      category: "portfolioUrl",
      keywords: ["portfolio", "website", "personal website", "blog", "portfolio url"],
      patterns: [/portfolio/i, /personal[\s_-]?website/i, /^website$/i],
      priority: 8
    },
    // ── Identity documents ────────────────────────────────────────────────
    {
      category: "aadhaar",
      keywords: ["aadhaar", "aadhar", "aadhaar number", "uid", "uidai"],
      patterns: [/aa?dha?ar/i, /^uid$/i],
      priority: 10
    },
    {
      category: "pan",
      keywords: ["pan", "pan number", "pan card", "permanent account number"],
      patterns: [/^pan$/i, /pan[\s_-]?(number|card|no)/i, /permanent[\s_-]?account/i],
      priority: 10
    },
    {
      category: "passport",
      keywords: ["passport", "passport number", "passport no"],
      patterns: [/passport/i],
      priority: 10
    },
    // ── File upload fields ────────────────────────────────────────────────
    {
      category: "resume",
      keywords: ["resume", "cv", "curriculum vitae", "upload cv", "upload resume", "attach resume", "resume/cv"],
      patterns: [/resume/i, /\bcv\b/i, /curriculum[\s_-]?vitae/i],
      priority: 10
    },
    {
      category: "profileImage",
      keywords: ["photo", "profile photo", "profile picture", "profile image", "passport photo", "headshot", "avatar", "picture"],
      patterns: [/profile[\s_-]?(photo|pic|image)/i, /passport[\s_-]?photo/i, /^photo$/i, /headshot/i],
      priority: 9
    },
    {
      category: "aadhaarFile",
      keywords: ["aadhaar file", "aadhar upload", "aadhaar copy", "aadhar card", "aadhaar document"],
      patterns: [/aa?dha?ar[\s_-]?(file|upload|copy|doc)/i],
      priority: 9
    },
    {
      category: "panFile",
      keywords: ["pan file", "pan upload", "pan copy", "pan card upload"],
      patterns: [/pan[\s_-]?(file|upload|copy|card)/i],
      priority: 9
    }
  ];
  function normalize(text) {
    return text.toLowerCase().replace(/[_\-\s]+/g, " ").trim();
  }
  function getElementHints(el) {
    var _a, _b;
    const hints = [];
    const addHint = (val) => {
      if (val) hints.push(normalize(val));
    };
    addHint(el.getAttribute("name"));
    addHint(el.getAttribute("id"));
    addHint(el.getAttribute("placeholder"));
    addHint(el.getAttribute("aria-label"));
    addHint(el.getAttribute("data-label"));
    addHint(el.getAttribute("title"));
    const id = el.getAttribute("id");
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) addHint(label.textContent);
    }
    const parent = el.parentElement;
    if (parent) {
      addHint((_a = parent.querySelector("label")) == null ? void 0 : _a.textContent);
      const nearText = (_b = parent.textContent) == null ? void 0 : _b.replace(el.value ?? "", "");
      if (nearText && nearText.length < 100) addHint(nearText);
    }
    return hints.filter(Boolean);
  }
  function scoreRule(rule, hints) {
    let score = 0;
    for (const hint of hints) {
      for (const kw of rule.keywords) {
        if (hint.includes(normalize(kw))) {
          score += rule.priority * (hint === normalize(kw) ? 2 : 1);
        }
      }
      for (const pattern of rule.patterns) {
        if (pattern.test(hint)) {
          score += rule.priority * 1.5;
        }
      }
    }
    return score;
  }
  function detectFieldCategory(el) {
    const hints = getElementHints(el);
    if (!hints.length) return { category: "unknown", confidence: 0 };
    let bestScore = 0;
    let bestCategory = "unknown";
    for (const rule of RULES) {
      const score = scoreRule(rule, hints);
      if (score > bestScore) {
        bestScore = score;
        bestCategory = rule.category;
      }
    }
    const confidence = Math.min(bestScore / 20, 1);
    return { category: bestCategory, confidence };
  }
  function getFieldType(el) {
    var _a;
    const tag = el.tagName.toLowerCase();
    if (tag === "select") return "select";
    if (tag === "textarea") return "textarea";
    if (tag === "input") {
      const type = ((_a = el.type) == null ? void 0 : _a.toLowerCase()) ?? "text";
      return type || "text";
    }
    return "text";
  }
  function detectFormFields(container = document) {
    const selector = 'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]), select, textarea';
    const elements = Array.from(container.querySelectorAll(selector));
    return elements.filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0 || el.closest("form") !== null;
    }).map((el) => {
      const { category, confidence } = detectFieldCategory(el);
      const type = getFieldType(el);
      return {
        element: el,
        type,
        category,
        confidence,
        label: el.getAttribute("aria-label") ?? el.getAttribute("placeholder") ?? void 0,
        placeholder: el.getAttribute("placeholder") ?? void 0,
        required: el.hasAttribute("required") || el.getAttribute("aria-required") === "true",
        multiple: type === "file" ? el.multiple : void 0,
        acceptedTypes: type === "file" ? el.accept : void 0
      };
    });
  }
  function nativeInputValueSetter(el, value) {
    var _a, _b;
    const nativeInputValueSetter2 = (_a = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )) == null ? void 0 : _a.set;
    const nativeTextAreaValueSetter = (_b = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )) == null ? void 0 : _b.set;
    if (el.tagName.toLowerCase() === "textarea" && nativeTextAreaValueSetter) {
      nativeTextAreaValueSetter.call(el, value);
    } else if (nativeInputValueSetter2) {
      nativeInputValueSetter2.call(el, value);
    } else {
      el.value = value;
    }
  }
  function dispatchInputEvents(el, value) {
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      if (value !== void 0) nativeInputValueSetter(el, value);
    }
    const events = ["input", "change"];
    for (const eventName of events) {
      el.dispatchEvent(new Event(eventName, { bubbles: true, cancelable: true }));
      el.dispatchEvent(new InputEvent(eventName, { bubbles: true, cancelable: true, data: value }));
    }
    el.dispatchEvent(new Event("blur", { bubbles: true }));
    el.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
  }
  function dispatchSelectEvents(el, value) {
    el.value = value;
    el.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    el.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
  }
  function dispatchCheckboxEvents(el, checked) {
    el.checked = checked;
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    el.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
  }
  async function uploadFileToInput(el, file) {
    try {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      el.files = dataTransfer.files;
      el.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
      return true;
    } catch (e) {
      console.error("[AutoFill] File upload failed:", e);
      return false;
    }
  }
  async function dataUrlToFile(dataUrl, fileName, mimeType) {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: mimeType });
  }
  function resolveValue(category, profile) {
    const p = profile.personal;
    const a = profile.address;
    const pro = profile.professional;
    const map = {
      fullName: p.fullName,
      firstName: p.firstName,
      lastName: p.lastName,
      fatherName: p.fatherName,
      email: p.email,
      phone: p.phone,
      alternatePhone: p.alternatePhone,
      dob: p.dob,
      gender: p.gender,
      maritalStatus: p.maritalStatus,
      nationality: p.nationality,
      address: a.currentAddress,
      city: a.city,
      state: a.state,
      country: a.country,
      pincode: a.pincode,
      landmark: a.landmark,
      company: pro.currentCompany,
      designation: pro.designation,
      department: pro.department,
      experience: `${pro.experienceYears} years ${pro.experienceMonths} months`,
      noticePeriod: pro.noticePeriod,
      currentSalary: pro.currentSalary,
      expectedSalary: pro.expectedSalary,
      skills: pro.skills.join(", "),
      college: pro.collegeName,
      degree: pro.degree,
      graduationYear: pro.graduationYear,
      cgpa: pro.cgpa,
      linkedinUrl: pro.linkedinUrl,
      githubUrl: pro.githubUrl,
      portfolioUrl: pro.portfolioUrl,
      aadhaar: profile.identity.aadhaarNumber ?? "",
      pan: profile.identity.panNumber ?? "",
      passport: profile.identity.passportNumber ?? "",
      drivingLicense: profile.identity.drivingLicense ?? ""
    };
    return map[category] ?? null;
  }
  async function fillTextInput(el, value, delay) {
    try {
      el.focus();
      await wait(delay);
      dispatchInputEvents(el, value);
      return true;
    } catch {
      return false;
    }
  }
  async function fillSelect(el, value, delay) {
    try {
      const options = Array.from(el.options);
      const lv = value.toLowerCase();
      const match = options.find((o) => o.value === value) ?? options.find((o) => o.text.toLowerCase() === lv) ?? options.find((o) => o.value.toLowerCase().includes(lv)) ?? options.find((o) => o.text.toLowerCase().includes(lv)) ?? options.find((o) => lv.includes(o.text.toLowerCase()) && o.text.length > 2);
      if (!match) return false;
      await wait(delay);
      dispatchSelectEvents(el, match.value);
      return true;
    } catch {
      return false;
    }
  }
  async function fillCheckbox(el, value, delay) {
    const truthy = ["true", "1", "yes", "on", "checked", "agree"].includes(value.toLowerCase());
    await wait(delay);
    dispatchCheckboxEvents(el, truthy);
    return true;
  }
  async function fillRadio(el, value, delay) {
    const lv = value.toLowerCase();
    const name = el.getAttribute("name");
    if (!name) return false;
    const radios = Array.from(document.querySelectorAll(`input[type="radio"][name="${name}"]`));
    const match = radios.find((r) => r.value.toLowerCase() === lv) ?? radios.find((r) => r.value.toLowerCase().includes(lv)) ?? radios.find((r) => lv.includes(r.value.toLowerCase()) && r.value.length > 1);
    if (!match) return false;
    await wait(delay);
    dispatchCheckboxEvents(match, true);
    return true;
  }
  async function fillTextArea(el, value, delay) {
    try {
      el.focus();
      await wait(delay);
      dispatchInputEvents(el, value);
      return true;
    } catch {
      return false;
    }
  }
  async function fillFileInput(el, profile, category, delay) {
    await wait(delay);
    let storedFile;
    if (category === "resume") {
      storedFile = profile.documents.resumeFile;
    } else if (category === "profileImage") {
      storedFile = profile.documents.profileImage;
    } else if (category === "aadhaarFile") {
      storedFile = profile.documents.aadhaarFile;
    } else if (category === "panFile") {
      storedFile = profile.documents.panFile;
    } else if (category === "passportFile") {
      storedFile = profile.documents.passportFile;
    }
    if (!(storedFile == null ? void 0 : storedFile.dataUrl)) return false;
    try {
      const file = await dataUrlToFile(storedFile.dataUrl, storedFile.name, storedFile.type);
      return uploadFileToInput(el, file);
    } catch {
      return false;
    }
  }
  const HIGHLIGHT_CLASS = "__autofill-highlight__";
  const HIGHLIGHT_STYLE = `
  .__autofill-highlight__ {
    outline: 2px solid #06b6d4 !important;
    background-color: rgba(6, 182, 212, 0.08) !important;
    transition: outline 0.3s ease !important;
  }
`;
  let styleInjected = false;
  function injectHighlightStyle() {
    if (styleInjected) return;
    const style = document.createElement("style");
    style.textContent = HIGHLIGHT_STYLE;
    document.head.appendChild(style);
    styleInjected = true;
  }
  function highlightFields(fields) {
    injectHighlightStyle();
    for (const field of fields) {
      if (field.category !== "unknown") {
        field.element.classList.add(HIGHLIGHT_CLASS);
      }
    }
  }
  function clearHighlights() {
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((el) => {
      el.classList.remove(HIGHLIGHT_CLASS);
    });
  }
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function fillForm(profile, options = {}) {
    const start = Date.now();
    const { skipFilled = true, delay = 50, minConfidence = 0.1 } = options;
    const fields = detectFormFields();
    const results = [];
    const seenRadioNames = /* @__PURE__ */ new Set();
    for (const field of fields) {
      if (field.category === "unknown" || field.confidence < minConfidence) {
        results.push({ field, success: false, error: "low confidence / unknown" });
        continue;
      }
      const el = field.element;
      const type = field.type;
      if (skipFilled && type !== "file" && type !== "checkbox" && type !== "radio") {
        const currentValue = el.value ?? "";
        if (currentValue.trim()) {
          results.push({ field, success: false, error: "already filled" });
          continue;
        }
      }
      let success = false;
      try {
        if (type === "file") {
          success = await fillFileInput(el, profile, field.category, delay);
        } else if (type === "select") {
          const value = resolveValue(field.category, profile);
          if (value) success = await fillSelect(el, value, delay);
        } else if (type === "checkbox") {
          const value = resolveValue(field.category, profile);
          if (value) success = await fillCheckbox(el, value, delay);
        } else if (type === "radio") {
          const name = el.getAttribute("name") ?? "";
          if (seenRadioNames.has(name)) {
            results.push({ field, success: false, error: "radio group already handled" });
            continue;
          }
          seenRadioNames.add(name);
          const value = resolveValue(field.category, profile);
          if (value) success = await fillRadio(el, value, delay);
        } else if (type === "textarea") {
          const value = resolveValue(field.category, profile);
          if (value) success = await fillTextArea(el, value, delay);
        } else {
          const value = resolveValue(field.category, profile);
          if (value) success = await fillTextInput(el, value, delay);
        }
        results.push({ field, success, value: success ? resolveValue(field.category, profile) ?? void 0 : void 0 });
      } catch (e) {
        results.push({ field, success: false, error: String(e) });
      }
    }
    const filled = results.filter((r) => r.success).length;
    const skipped = results.filter((r) => {
      var _a;
      return !r.success && ((_a = r.error) == null ? void 0 : _a.includes("already filled"));
    }).length;
    const failed = results.filter((r) => {
      var _a;
      return !r.success && !((_a = r.error) == null ? void 0 : _a.includes("already filled"));
    }).length;
    return {
      url: window.location.href,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      profileId: profile.id,
      totalFields: fields.length,
      filledFields: filled,
      skippedFields: skipped,
      failedFields: failed,
      results,
      duration: Date.now() - start
    };
  }
  let observer = null;
  function startFormObserver(onNewForms) {
    if (observer) return;
    const seenForms = /* @__PURE__ */ new WeakSet();
    const checkForms = (nodes) => {
      const newForms = [];
      nodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          const forms = node.tagName === "FORM" ? [node] : Array.from(node.querySelectorAll("form"));
          forms.forEach((form) => {
            if (!seenForms.has(form)) {
              seenForms.add(form);
              newForms.push(form);
            }
          });
        }
      });
      if (newForms.length > 0) onNewForms(newForms);
    };
    observer = new MutationObserver((mutations) => {
      const addedNodes = [];
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((n) => addedNodes.push(n));
      }
      if (addedNodes.length > 0) {
        checkForms(addedNodes);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const existing = Array.from(document.querySelectorAll("form"));
    existing.forEach((f) => seenForms.add(f));
  }
  const MALE_FIRST_NAMES = [
    "Aarav",
    "Aditya",
    "Akash",
    "Amit",
    "Anand",
    "Arjun",
    "Aryan",
    "Ashish",
    "Ayaan",
    "Deepak",
    "Dev",
    "Dhruv",
    "Gautam",
    "Harsh",
    "Ishan",
    "Karan",
    "Krishna",
    "Kunal",
    "Manish",
    "Mohit",
    "Nikhil",
    "Nilesh",
    "Pankaj",
    "Pranav",
    "Prateek",
    "Rahul",
    "Raj",
    "Rajesh",
    "Ravi",
    "Rishabh",
    "Rohit",
    "Rohan",
    "Sagar",
    "Sahil",
    "Sandeep",
    "Sanjay",
    "Shubham",
    "Siddharth",
    "Sumit",
    "Suresh",
    "Tarun",
    "Tushar",
    "Uday",
    "Varun",
    "Vikram",
    "Vikas",
    "Vinay",
    "Vishal",
    "Vivek",
    "Yash"
  ];
  const FEMALE_FIRST_NAMES = [
    "Aanya",
    "Aditi",
    "Aishwarya",
    "Akanksha",
    "Alka",
    "Amisha",
    "Amrita",
    "Ananya",
    "Anjali",
    "Ankita",
    "Anushka",
    "Aparna",
    "Aradhya",
    "Archana",
    "Avani",
    "Deepika",
    "Disha",
    "Divya",
    "Gauri",
    "Ishita",
    "Jaya",
    "Juhi",
    "Kavya",
    "Khushi",
    "Komal",
    "Kriti",
    "Lakshmi",
    "Madhuri",
    "Meera",
    "Megha",
    "Mitali",
    "Muskan",
    "Naina",
    "Namrata",
    "Neha",
    "Nidhi",
    "Nikita",
    "Pallavi",
    "Poonam",
    "Pooja",
    "Prachi",
    "Pragya",
    "Priya",
    "Riya",
    "Ritika",
    "Sakshi",
    "Shruti",
    "Simran",
    "Sneha",
    "Sonam",
    "Sonal",
    "Sonali",
    "Swati",
    "Tanvi",
    "Tanya",
    "Trisha"
  ];
  const LAST_NAMES = [
    "Agarwal",
    "Arora",
    "Bansal",
    "Bhatt",
    "Bose",
    "Chakraborty",
    "Chandra",
    "Chaudhary",
    "Chopra",
    "Desai",
    "Dhawan",
    "Dixit",
    "Dubey",
    "Dutta",
    "Gandhi",
    "Garg",
    "Ghosh",
    "Goswami",
    "Gupta",
    "Iyer",
    "Jain",
    "Jha",
    "Joshi",
    "Kapur",
    "Kapoor",
    "Kashyap",
    "Khan",
    "Khanna",
    "Kulkarni",
    "Kumar",
    "Lal",
    "Malhotra",
    "Mehta",
    "Menon",
    "Mishra",
    "Mittal",
    "Modi",
    "Mukherjee",
    "Nair",
    "Naidu",
    "Pandey",
    "Patel",
    "Patil",
    "Pillai",
    "Prasad",
    "Rao",
    "Reddy",
    "Saxena",
    "Shah",
    "Sharma",
    "Shukla",
    "Singh",
    "Sinha",
    "Srivastava",
    "Thakur",
    "Tiwari",
    "Trivedi",
    "Varma",
    "Verma",
    "Yadav"
  ];
  const STATES = [
    { name: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur"], pincodePrefix: "4" },
    { name: "Delhi", cities: ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Dwarka", "Rohini"], pincodePrefix: "11" },
    { name: "Karnataka", cities: ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belgaum", "Davangere"], pincodePrefix: "5" },
    { name: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"], pincodePrefix: "6" },
    { name: "Telangana", cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam"], pincodePrefix: "5" },
    { name: "Gujarat", cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"], pincodePrefix: "3" },
    { name: "Rajasthan", cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner"], pincodePrefix: "3" },
    { name: "Uttar Pradesh", cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad", "Ghaziabad", "Noida"], pincodePrefix: "2" },
    { name: "West Bengal", cities: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Burdwan"], pincodePrefix: "7" },
    { name: "Madhya Pradesh", cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar"], pincodePrefix: "4" },
    { name: "Punjab", cities: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"], pincodePrefix: "1" },
    { name: "Haryana", cities: ["Gurugram", "Faridabad", "Hisar", "Rohtak", "Karnal", "Ambala"], pincodePrefix: "1" },
    { name: "Kerala", cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad"], pincodePrefix: "6" },
    { name: "Andhra Pradesh", cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati"], pincodePrefix: "5" },
    { name: "Bihar", cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"], pincodePrefix: "8" }
  ];
  const COMPANIES = [
    "Tata Consultancy Services",
    "Infosys",
    "Wipro",
    "HCL Technologies",
    "Tech Mahindra",
    "Cognizant",
    "Capgemini",
    "Accenture",
    "IBM India",
    "Oracle India",
    "Microsoft India",
    "Google India",
    "Amazon India",
    "Flipkart",
    "Paytm",
    "Zomato",
    "Swiggy",
    "Ola",
    "Byju's",
    "Razorpay",
    "PhonePe",
    "Nykaa",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Reliance Industries",
    "Mahindra & Mahindra",
    "Bajaj Finserv",
    "L&T Infotech",
    "Mphasis",
    "Hexaware Technologies"
  ];
  const COLLEGES = [
    "IIT Bombay",
    "IIT Delhi",
    "IIT Madras",
    "IIT Kanpur",
    "IIT Kharagpur",
    "IIT Roorkee",
    "IIT Hyderabad",
    "NIT Trichy",
    "NIT Warangal",
    "NIT Surathkal",
    "BITS Pilani",
    "VIT Vellore",
    "SRM University",
    "Amity University",
    "Delhi University",
    "Mumbai University",
    "Anna University",
    "Pune University",
    "Bangalore University",
    "Jadavpur University",
    "Manipal University",
    "Christ University",
    "Symbiosis International University"
  ];
  const DEGREES = [
    "B.Tech in Computer Science",
    "B.Tech in Information Technology",
    "B.Tech in Electronics & Communication",
    "B.Tech in Mechanical Engineering",
    "B.E. in Computer Science",
    "BCA",
    "B.Sc in Computer Science",
    "MCA",
    "M.Tech in Computer Science",
    "MBA",
    "B.Com",
    "BBA"
  ];
  const SKILLS_POOL = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "Go",
    "Angular",
    "Vue.js",
    "Next.js",
    "Express.js",
    "Django",
    "Spring Boot",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Git",
    "REST APIs",
    "GraphQL",
    "Machine Learning",
    "Data Science",
    "TensorFlow",
    "Android",
    "iOS",
    "Flutter",
    "React Native",
    "HTML/CSS",
    "Tailwind CSS",
    "Bootstrap",
    "Linux",
    "Agile",
    "Scrum",
    "Jenkins",
    "Terraform",
    "Microservices"
  ];
  const NOTICE_PERIODS = ["Immediate", "15 days", "30 days", "45 days", "60 days", "90 days"];
  const DESIGNATIONS = [
    "Software Engineer",
    "Senior Software Engineer",
    "Lead Engineer",
    "Principal Engineer",
    "Full Stack Developer",
    "Backend Developer",
    "Frontend Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Data Analyst",
    "Product Manager",
    "Business Analyst",
    "QA Engineer",
    "UX Designer",
    "UI Developer",
    "Cloud Architect",
    "Mobile Developer",
    "Machine Learning Engineer",
    "Engineering Manager"
  ];
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function pickMany(arr, min, max) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function randomDigits(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
  }
  function randomDate(minAge, maxAge) {
    const now = /* @__PURE__ */ new Date();
    const minYear = now.getFullYear() - maxAge;
    const maxYear = now.getFullYear() - minAge;
    const year = randomInt(minYear, maxYear);
    const month = randomInt(1, 12);
    const day = randomInt(1, 28);
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  const PROFILE_COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#3b82f6"
  ];
  function generateIndianProfile(gender) {
    const resolvedGender = Math.random() > 0.5 ? "male" : "female";
    const firstName = pick(resolvedGender === "male" ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const fatherFirstName = pick(MALE_FIRST_NAMES);
    const stateData = pick(STATES);
    const city = pick(stateData.cities);
    const expYears = randomInt(0, 15);
    const expMonths = randomInt(0, 11);
    const currentSalary = expYears === 0 ? "0" : String(randomInt(3, 50) * 1e5);
    const expectedSalary = String(Math.round(Number(currentSalary) * 1.3 / 1e5) * 1e5 || randomInt(3, 8) * 1e5);
    const gradYear = (/* @__PURE__ */ new Date()).getFullYear() - expYears - randomInt(0, 2);
    const phone = `+91${pick(["6", "7", "8", "9"])}${randomDigits(9)}`;
    const altPhone = `+91${pick(["6", "7", "8", "9"])}${randomDigits(9)}`;
    const emailHandle = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(10, 999)}`;
    const emailDomain = pick(["gmail.com", "yahoo.co.in", "outlook.com", "hotmail.com", "rediffmail.com"]);
    const email = `${emailHandle}@${emailDomain}`;
    const pincodeDigits = `${stateData.pincodePrefix}${randomDigits(6 - stateData.pincodePrefix.length)}`;
    return {
      personal: {
        fullName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        fatherName: `${fatherFirstName} ${lastName}`,
        motherName: `${pick(FEMALE_FIRST_NAMES)} ${lastName}`,
        dob: randomDate(22, 45),
        gender: resolvedGender,
        maritalStatus: pick(["single", "married", "single", "single"]),
        email,
        phone,
        alternatePhone: altPhone,
        nationality: "Indian"
      },
      address: {
        currentAddress: `${randomInt(1, 999)}, ${pick(["MG Road", "Civil Lines", "Gandhi Nagar", "Lal Bagh", "Sector " + randomInt(1, 50), "Block " + pick(["A", "B", "C", "D"])])}`,
        permanentAddress: `${randomInt(1, 999)}, ${pick(["Main Street", "Old Town", "Market Road", "Station Road", "Park Lane"])}`,
        city,
        state: stateData.name,
        country: "India",
        pincode: pincodeDigits,
        landmark: `Near ${pick(["Railway Station", "Bus Stand", "Hospital", "School", "Temple", "Park", "Mall"])}`
      },
      professional: {
        currentCompany: expYears > 0 ? pick(COMPANIES) : "",
        designation: expYears > 0 ? pick(DESIGNATIONS) : "Fresher",
        department: pick(["Engineering", "Product", "Design", "Data", "DevOps", "QA", "Finance"]),
        experienceYears: expYears,
        experienceMonths: expMonths,
        skills: pickMany(SKILLS_POOL, 4, 10),
        noticePeriod: expYears > 0 ? pick(NOTICE_PERIODS) : "Immediate",
        currentSalary,
        expectedSalary,
        linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randomInt(100, 9999)}`,
        githubUrl: `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}${randomInt(10, 99)}`,
        portfolioUrl: `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.dev`,
        collegeName: pick(COLLEGES),
        degree: pick(DEGREES),
        graduationYear: String(gradYear),
        cgpa: `${randomInt(65, 95) / 10}`
      },
      identity: {
        aadhaarNumber: randomDigits(12),
        panNumber: `${pick("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""))}${pick("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""))}${pick("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""))}${pick("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""))}${pick("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""))}${randomDigits(4)}${pick("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""))}`,
        passportNumber: `${pick("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""))}${randomDigits(7)}`,
        drivingLicense: `${stateData.name.slice(0, 2).toUpperCase()}${randomInt(10, 99)}${" " + randomInt(1e10, 99999999999)}`
      },
      color: pick(PROFILE_COLORS)
    };
  }
  let autoFillEnabled = false;
  let currentSettings = null;
  async function getSettings() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "GET_SETTINGS" }, (response) => {
        resolve((response == null ? void 0 : response.data) ?? null);
      });
    });
  }
  async function getDefaultProfile() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "GET_DEFAULT_PROFILE" }, (response) => {
        resolve((response == null ? void 0 : response.data) ?? null);
      });
    });
  }
  async function getProfileById(id) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "GET_PROFILE", payload: { id } }, (response) => {
        resolve((response == null ? void 0 : response.data) ?? null);
      });
    });
  }
  function randomProfileFromGenerator() {
    const data = generateIndianProfile();
    return {
      id: "random",
      name: "Random Profile",
      color: "#6366f1",
      isDefault: false,
      ...data,
      documents: { certificates: [] },
      customFields: [],
      domainBindings: [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: 1
    };
  }
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    (async () => {
      var _a;
      let response;
      switch (message.action) {
        case "FILL_FORM": {
          const profileId = (_a = message.payload) == null ? void 0 : _a.profileId;
          const profile = profileId ? await getProfileById(profileId) : await getDefaultProfile();
          if (!profile) {
            response = { success: false, error: "No profile found" };
            break;
          }
          const settings = await getSettings();
          const report = await fillForm(profile, {
            delay: (settings == null ? void 0 : settings.fillDelay) ?? 50,
            skipFilled: (settings == null ? void 0 : settings.skipFilledFields) ?? true
          });
          response = { success: true, data: report };
          break;
        }
        case "RANDOM_FILL": {
          const profile = randomProfileFromGenerator();
          const settings = await getSettings();
          const report = await fillForm(profile, {
            delay: (settings == null ? void 0 : settings.fillDelay) ?? 50,
            skipFilled: false
          });
          response = { success: true, data: report };
          break;
        }
        case "GET_FORM_FIELDS": {
          const fields = detectFormFields().map((f) => ({
            type: f.type,
            category: f.category,
            confidence: f.confidence,
            label: f.label,
            placeholder: f.placeholder,
            required: f.required
          }));
          response = { success: true, data: { fields } };
          break;
        }
        case "GET_PAGE_INFO": {
          response = {
            success: true,
            data: {
              url: window.location.href,
              title: document.title,
              fieldCount: detectFormFields().length
            }
          };
          break;
        }
        case "HIGHLIGHT_FIELDS": {
          const fields = detectFormFields();
          highlightFields(fields);
          response = { success: true, data: { highlighted: fields.length } };
          break;
        }
        case "CLEAR_HIGHLIGHTS": {
          clearHighlights();
          response = { success: true };
          break;
        }
        default:
          response = { success: false, error: "Unknown action" };
      }
      sendResponse(response);
    })();
    return true;
  });
  async function init() {
    currentSettings = await getSettings();
    autoFillEnabled = (currentSettings == null ? void 0 : currentSettings.autoFillOnLoad) ?? false;
    if (autoFillEnabled) {
      const profile = await getDefaultProfile();
      if (profile) {
        await fillForm(profile, { delay: (currentSettings == null ? void 0 : currentSettings.fillDelay) ?? 50 });
      }
    }
    startFormObserver(async (_newForms) => {
      if (!autoFillEnabled) return;
      const profile = await getDefaultProfile();
      if (profile) {
        await fillForm(profile, { delay: (currentSettings == null ? void 0 : currentSettings.fillDelay) ?? 50 });
      }
    });
  }
  init().catch(console.error);
})();
