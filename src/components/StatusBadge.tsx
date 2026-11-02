import type { RunStatus } from '../types/run';
import { Icon } from './Icon';

export const statusLabels: Record<RunStatus, string> = {
  queued: 'Queued',
  running: 'Running',
  succeeded: 'Succeeded',
  failed: 'Failed',
};

export function StatusBadge({ status }: { status: RunStatus }) {
  return (
    <span className={`status-badge status-${status}`}>
      {status === 'running' ? (
        <span className="status-spinner" />
      ) : (
        <Icon name={status === 'succeeded' ? 'check' : status === 'failed' ? 'close' : 'clock'} />
      )}
      {statusLabels[status]}
    </span>
  );
}
