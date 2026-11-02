import type { Run } from '../types/run';
import { formatDate, formatDuration } from '../utils/runs';
import { Icon } from './Icon';
import { StatusBadge } from './StatusBadge';

export function RunsList({ runs, onSelect }: { runs: Run[]; onSelect: (run: Run) => void }) {
  return (
    <div className="runs-list">
      <div className="list-columns" aria-hidden="true">
        <span>Run / repository</span>
        <span>Status</span>
        <span>Created · MSK</span>
        <span>Duration</span>
        <span />
      </div>
      <ul aria-label="Run list">
        {runs.map((run) => (
          <li key={run.id}>
            <button className="run-row" onClick={() => onSelect(run)} aria-haspopup="dialog">
              <span className="run-identity">
                <span className="run-icon">
                  <Icon name="terminal" />
                </span>
                <span className="run-description">
                  <span className="run-name">{run.name}</span>
                  <span className="run-repository">
                    <Icon name="repo" />
                    {run.repository}
                  </span>
                  <span className="run-branch">
                    <Icon name="branch" />
                    {run.branch}
                  </span>
                </span>
              </span>
              <StatusBadge status={run.status} />
              <time className="run-date" dateTime={run.createdAt}>
                {formatDate(run.createdAt)}
              </time>
              <span
                className="run-duration"
                aria-label={`Duration: ${run.durationSeconds === undefined ? 'not available yet' : formatDuration(run.durationSeconds)}`}
              >
                <Icon name="clock" />
                {formatDuration(run.durationSeconds)}
              </span>
              <Icon name="arrow" className="row-arrow" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
