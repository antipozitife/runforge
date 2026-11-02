import type { Run, RunFilter, RunSort } from '../types/run';

export function selectRuns(runs: Run[], query: string, status: RunFilter, sort: RunSort): Run[] {
  const search = query.trim().toLowerCase();
  return runs
    .filter(
      (run) =>
        (status === 'all' || run.status === status) &&
        (run.name.toLowerCase().includes(search) || run.repository.toLowerCase().includes(search)),
    )
    .sort((a, b) => {
      if (sort === 'longest') return (b.durationSeconds ?? -1) - (a.durationSeconds ?? -1);
      if (sort === 'shortest') {
        return (a.durationSeconds ?? Number.POSITIVE_INFINITY) -
          (b.durationSeconds ?? Number.POSITIVE_INFINITY);
      }
      const difference = Date.parse(b.createdAt) - Date.parse(a.createdAt);
      return sort === 'oldest' ? -difference : difference;
    });
}

// Demo dates and logs use one explicit timezone.
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Moscow',
});

export function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : dateFormatter.format(date);
}

export function formatDuration(seconds?: number): string {
  if (seconds === undefined || !Number.isFinite(seconds) || seconds < 0) return '—';
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remaining = total % 60;
  return hours > 0
    ? `${hours}h ${minutes}m ${remaining}s`
    : minutes > 0
      ? `${minutes}m ${remaining}s`
      : `${remaining}s`;
}
