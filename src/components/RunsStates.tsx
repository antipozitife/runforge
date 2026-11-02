import { Icon } from './Icon';

export function RunsLoading() {
  return (
    <div role="status" aria-label="Loading runs" className="runs-loading">
      <span className="sr-only">Loading runs…</span>
      {Array.from({ length: 6 }, (_, index) => (
        <div className="skeleton-row" key={index} aria-hidden="true">
          <span className="skeleton skeleton-square" />
          <div>
            <span className="skeleton skeleton-title" />
            <span className="skeleton skeleton-text" />
          </div>
          <span className="skeleton skeleton-badge" />
        </div>
      ))}
    </div>
  );
}

export function RunsEmpty({ filtered, onReset }: { filtered: boolean; onReset: () => void }) {
  return (
    <div className="empty-state">
      <span className="state-icon">
        <Icon name={filtered ? 'search' : 'runs'} />
      </span>
      <h2>{filtered ? 'No matching runs' : 'No runs yet'}</h2>
      <p>
        {filtered
          ? 'Try another run name, repository, or status.'
          : 'New runs will appear here when they are created.'}
      </p>
      {filtered && (
        <button className="button button-primary" onClick={onReset}>
          Reset search and filters
        </button>
      )}
    </div>
  );
}

export function RunsError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="empty-state error-state" role="alert">
      <span className="state-icon">
        <Icon name="alert" />
      </span>
      <h2>Unable to load runs</h2>
      <p>{message}</p>
      <button className="button button-primary" onClick={onRetry}>
        <Icon name="refresh" />
        Try again
      </button>
    </div>
  );
}
