// Fires native + React synthetic events so React/Angular/Vue controlled inputs update state

function nativeInputValueSetter(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;
  const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    'value'
  )?.set;

  if (el.tagName.toLowerCase() === 'textarea' && nativeTextAreaValueSetter) {
    nativeTextAreaValueSetter.call(el, value);
  } else if (nativeInputValueSetter) {
    nativeInputValueSetter.call(el, value);
  } else {
    el.value = value;
  }
}

export function dispatchInputEvents(el: HTMLElement, value?: string): void {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    if (value !== undefined) nativeInputValueSetter(el, value);
  }

  const events = ['input', 'change'];
  for (const eventName of events) {
    el.dispatchEvent(new Event(eventName, { bubbles: true, cancelable: true }));
    el.dispatchEvent(new InputEvent(eventName, { bubbles: true, cancelable: true, data: value }));
  }
  el.dispatchEvent(new Event('blur', { bubbles: true }));
  el.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
}

export function dispatchSelectEvents(el: HTMLSelectElement, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  el.dispatchEvent(new Event('blur', { bubbles: true }));
}

export function dispatchCheckboxEvents(el: HTMLInputElement, checked: boolean): void {
  el.checked = checked;
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}
