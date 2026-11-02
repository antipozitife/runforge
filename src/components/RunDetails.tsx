import { useEffect, useRef } from 'react';
import type { Run } from '../types/run';
import { formatDate, formatDuration } from '../utils/runs';
import { Icon } from './Icon';
import { StatusBadge } from './StatusBadge';

export function RunDetails({ run, onClose }: { run: Run; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="run-details"
      aria-labelledby="detail-title"
      onClose={() => {
        // StrictMode can close and immediately reopen the dialog while checking effects.
        if (dialogRef.current && !dialogRef.current.open) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="detail-content">
        <div className="detail-topline">
          <span className="eyebrow">RUN DETAILS / {run.id}</span>
          <button className="icon-button" onClick={onClose} aria-label="Close details">
            <Icon name="close" />
          </button>
        </div>
        <div className="detail-title-icon">
          <Icon name="terminal" />
        </div>
        <h2 id="detail-title">{run.name}</h2>
        <StatusBadge status={run.status} />
        <dl className="detail-metadata">
          <div>
            <dt>Repository</dt>
            <dd>
              <Icon name="repo" />
              {run.repository}
            </dd>
          </div>
          <div>
            <dt>Branch</dt>
            <dd>
              <Icon name="branch" />
              {run.branch}
            </dd>
          </div>
          <div>
            <dt>Created · MSK</dt>
            <dd>{formatDate(run.createdAt)}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>
              {run.durationSeconds === undefined
                ? 'Not available yet'
                : formatDuration(run.durationSeconds)}
            </dd>
          </div>
        </dl>
        <section className="logs-section" aria-labelledby="logs-title">
          <div className="section-heading">
            <h3 id="logs-title">
              <Icon name="terminal" />
              Run logs
            </h3>
            <span>MSK · {run.logs.length} lines</span>
          </div>
          <div className="log-console" tabIndex={0} role="region" aria-label="Run logs">
            {run.logs.length ? (
              <ol>
                {run.logs.map((log, index) => (
                  <li key={`${index}-${log}`}>
                    <code>{log}</code>
                  </li>
                ))}
              </ol>
            ) : (
              <p>No logs yet.</p>
            )}
          </div>
        </section>
        <section className="result-section" aria-labelledby="result-title">
          <h3 id="result-title">Result</h3>
          {run.result ? (
            <p className={`result-box ${run.status === 'failed' ? 'result-error' : ''}`}>
              {run.result}
            </p>
          ) : (
            <p className="result-pending">
              {run.status === 'queued'
                ? 'This run is waiting for an available worker. The result will appear when it completes.'
                : run.status === 'running'
                  ? 'The agent is working on the task. The final result is not ready yet.'
                  : 'No result was saved for this run.'}
            </p>
          )}
        </section>
        <button className="button button-secondary back-button" onClick={onClose}>
          <Icon name="arrow" />Back to runs
        </button>
      </div>
    </dialog>
  );
}
