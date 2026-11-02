import { useEffect, useState } from 'react';
import { listRuns } from '../services/runsService';
import type { Run } from '../types/run';

type RunsState =
  | { status: 'loading' }
  | { status: 'success'; runs: Run[] }
  | { status: 'error'; message: string };

export function useRuns(failFirstRequest: boolean) {
  const [state, setState] = useState<RunsState>({ status: 'loading' });
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    listRuns({ signal: controller.signal, shouldFail: failFirstRequest && requestNumber === 0 })
      .then((runs) => {
        if (!controller.signal.aborted) setState({ status: 'success', runs });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unable to load runs.',
          });
        }
      });
    return () => controller.abort();
  }, [requestNumber, failFirstRequest]);

  return { state, reload: () => setRequestNumber((number) => number + 1) };
}
