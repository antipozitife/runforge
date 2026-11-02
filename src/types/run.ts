export const RUN_STATUSES = ['queued', 'running', 'succeeded', 'failed'] as const;

export type RunStatus = (typeof RUN_STATUSES)[number];
export type RunFilter = 'all' | RunStatus;
export type RunSort = 'newest' | 'oldest' | 'longest' | 'shortest';

export type Run = {
  id: string;
  name: string;
  repository: string;
  branch: string;
  status: RunStatus;
  createdAt: string;
  durationSeconds?: number;
  logs: string[];
  result?: string;
};
