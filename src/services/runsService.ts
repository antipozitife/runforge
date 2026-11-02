import { mockRuns } from '../data/runs';
import type { Run } from '../types/run';

type ListRunsOptions = { signal?: AbortSignal; shouldFail?: boolean };

// API boundary: the UI consumes a Promise, so a fetch request can be connected here.
export function listRuns({ signal, shouldFail = false }: ListRunsOptions = {}): Promise<Run[]> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Request aborted', 'AbortError'));
      return;
    }

    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException('Request aborted', 'AbortError'));
    };

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      if (shouldFail) {
        reject(new Error('Unable to fetch runs. Please try again.'));
      } else {
        resolve(mockRuns.map((run) => ({ ...run, logs: [...run.logs] })));
      }
    }, 650);

    signal?.addEventListener('abort', abort, { once: true });
  });
}
