// Watches for dynamically loaded forms (SPAs, React, Angular, etc.)

type FormAppearCallback = (forms: HTMLFormElement[]) => void;

let observer: MutationObserver | null = null;

export function startFormObserver(onNewForms: FormAppearCallback): void {
  if (observer) return;

  const seenForms = new WeakSet<HTMLFormElement>();

  const checkForms = (nodes: NodeList) => {
    const newForms: HTMLFormElement[] = [];
    nodes.forEach(node => {
      if (node instanceof HTMLElement) {
        const forms = node.tagName === 'FORM'
          ? [node as HTMLFormElement]
          : Array.from(node.querySelectorAll<HTMLFormElement>('form'));

        forms.forEach(form => {
          if (!seenForms.has(form)) {
            seenForms.add(form);
            newForms.push(form);
          }
        });
      }
    });

    if (newForms.length > 0) onNewForms(newForms);
  };

  observer = new MutationObserver(mutations => {
    const addedNodes: Node[] = [];
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(n => addedNodes.push(n));
    }
    if (addedNodes.length > 0) {
      checkForms(addedNodes as unknown as NodeList);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Check existing forms on start
  const existing = Array.from(document.querySelectorAll<HTMLFormElement>('form'));
  existing.forEach(f => seenForms.add(f));
}

export function stopFormObserver(): void {
  observer?.disconnect();
  observer = null;
}
