// Uploads files into file input elements using DataTransfer API

export interface UploadTarget {
  element: HTMLInputElement;
  file: File;
}

export async function uploadFileToInput(el: HTMLInputElement, file: File): Promise<boolean> {
  try {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    el.files = dataTransfer.files;

    el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    return true;
  } catch (e) {
    console.error('[AutoFill] File upload failed:', e);
    return false;
  }
}

export async function dataUrlToFile(dataUrl: string, fileName: string, mimeType: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: mimeType });
}

export async function blobToFile(blob: Blob, fileName: string): Promise<File> {
  return new File([blob], fileName, { type: blob.type });
}

// Detects if the element is a file upload input that expects a resume/CV
export function isResumeInput(el: HTMLInputElement): boolean {
  const hints = [
    el.getAttribute('name'),
    el.getAttribute('id'),
    el.getAttribute('placeholder'),
    el.getAttribute('aria-label'),
    el.getAttribute('accept'),
    el.closest('label')?.textContent,
  ].map(h => (h ?? '').toLowerCase());

  const resumeKeywords = ['resume', 'cv', 'curriculum vitae', 'upload cv', 'attach resume'];
  return hints.some(h => resumeKeywords.some(kw => h.includes(kw)));
}

export function isImageInput(el: HTMLInputElement): boolean {
  const accept = el.getAttribute('accept') ?? '';
  const isImageAccept = accept.includes('image/') || accept.includes('.jpg') || accept.includes('.png');

  const hints = [
    el.getAttribute('name'),
    el.getAttribute('id'),
    el.getAttribute('aria-label'),
  ].map(h => (h ?? '').toLowerCase());

  const photoKeywords = ['photo', 'image', 'picture', 'avatar', 'headshot', 'profile', 'passport'];
  return isImageAccept || hints.some(h => photoKeywords.some(kw => h.includes(kw)));
}
