const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

async function getOrCreateKey(): Promise<CryptoKey> {
  const stored = await chrome.storage.local.get('_encKey');
  if (stored._encKey) {
    const raw = base64ToBuffer(stored._encKey);
    return crypto.subtle.importKey('raw', raw, ALGORITHM, false, ['encrypt', 'decrypt']);
  }
  const key = await crypto.subtle.generateKey({ name: ALGORITHM, length: KEY_LENGTH }, true, ['encrypt', 'decrypt']);
  const exported = await crypto.subtle.exportKey('raw', key);
  await chrome.storage.local.set({ _encKey: bufferToBase64(exported) });
  return key;
}

function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function encrypt(plaintext: string): Promise<string> {
  const key = await getOrCreateKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encoded);
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return bufferToBase64(combined.buffer);
}

export async function decrypt(cipherBase64: string): Promise<string> {
  const key = await getOrCreateKey();
  const combined = new Uint8Array(base64ToBuffer(cipherBase64));
  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH);
  const plaintext = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, ciphertext);
  return new TextDecoder().decode(plaintext);
}

export async function encryptObject<T extends object>(obj: T, sensitiveKeys: (keyof T)[]): Promise<T> {
  const result = { ...obj };
  for (const key of sensitiveKeys) {
    const value = result[key];
    if (typeof value === 'string' && value) {
      (result[key] as unknown) = await encrypt(value);
    }
  }
  return result;
}

export async function decryptObject<T extends object>(obj: T, sensitiveKeys: (keyof T)[]): Promise<T> {
  const result = { ...obj };
  for (const key of sensitiveKeys) {
    const value = result[key];
    if (typeof value === 'string' && value) {
      try {
        (result[key] as unknown) = await decrypt(value);
      } catch {
        // value may not be encrypted yet
      }
    }
  }
  return result;
}
