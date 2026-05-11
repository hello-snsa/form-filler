// Fires native + React synthetic events so React/Angular/Vue controlled inputs update state

// For React portals (e.g. LinkedIn Easy Apply sidebar), events don't bubble through the React
// root container, so React's synthetic event delegation misses them. Accessing the fiber directly
// lets us call the component's onChange regardless of where in the DOM it lives.
function tryReactFiberOnChange(el: HTMLElement, value: string): void {
  try {
    const fiberKey = Object.keys(el).find(
      k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'),
    );
    if (!fiberKey) return;
    let fiber = (el as Record<string, unknown>)[fiberKey] as { memoizedProps?: Record<string, unknown>; return?: { memoizedProps?: Record<string, unknown> } } | null;
    // Walk up one level to find the props with onChange
    for (let i = 0; i < 3 && fiber; i++) {
      const props = fiber.memoizedProps as { onChange?: (e: unknown) => void } | undefined;
      if (typeof props?.onChange === 'function') {
        props.onChange({ target: el, currentTarget: el, type: 'change', nativeEvent: null, preventDefault: () => {}, stopPropagation: () => {} });
        return;
      }
      fiber = (fiber.return ?? null) as typeof fiber;
    }
  } catch {
    // ignore — fiber approach is best-effort
  }
}

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
  // React portal fallback — fires the component's onChange directly via fiber
  if (value !== undefined) tryReactFiberOnChange(el, value);
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
