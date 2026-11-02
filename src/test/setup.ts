import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  window.history.replaceState(null, '', '/');
});

// jsdom does not implement native dialog behavior. Browsers provide this API.
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '');
  this.querySelector<HTMLElement>('[autofocus], button')?.focus();
};
HTMLDialogElement.prototype.close = function () {
  if (!this.open) return;
  this.removeAttribute('open');
  queueMicrotask(() => this.dispatchEvent(new Event('close')));
};
