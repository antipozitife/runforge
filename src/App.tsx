import { useState } from 'react';
import type { Run } from './types/run';
import { useRuns } from './hooks/useRuns';
import { useRunFilters } from './hooks/useRunFilters';
import { selectRuns } from './utils/runs';
import { WorkspaceShell } from './components/WorkspaceShell';
import { Icon } from './components/Icon';
import { RunFilters } from './components/RunFilters';
import { RunsList } from './components/RunsList';
import { RunDetails } from './components/RunDetails';
import { RunsEmpty, RunsError, RunsLoading } from './components/RunsStates';

export default function App() {
  const [simulateError] = useState(
    () => new URLSearchParams(window.location.search).get('mock') === 'error',
  );
  const { state, reload } = useRuns(simulateError);
  const filters = useRunFilters();
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);
  const runs = state.status === 'success' ? state.runs : [];
  const visibleRuns = selectRuns(runs, filters.query, filters.status, filters.sort);
  const hasFilters = Boolean(filters.query.trim()) || filters.status !== 'all';

  return (
    <WorkspaceShell>
      <div className="page-heading">
        <div>
          <p className="eyebrow">AGENT OPERATIONS</p>
          <h1>Runs</h1>
          <p className="page-description">Your agents are working. Every run stays in view.</p>
        </div>
        <button
          className="button button-accent refresh-button"
          onClick={reload}
          disabled={state.status === 'loading'}
        >
          <Icon name="refresh" />
          Refresh
        </button>
      </div>

      <section className="overview" aria-label="Run overview">
        {[
          {
            label: 'Total runs',
            count: runs.length,
            icon: 'runs' as const,
            hint: 'In this workspace',
          },
          {
            label: 'In progress',
            count: runs.filter((run) => run.status === 'running').length,
            icon: 'bolt' as const,
            hint: 'Agents working',
          },
          {
            label: 'Completed',
            count: runs.filter((run) => run.status === 'succeeded').length,
            icon: 'check' as const,
            hint: 'Successful results',
          },
          {
            label: 'Failed',
            count: runs.filter((run) => run.status === 'failed').length,
            icon: 'alert' as const,
            hint: 'Need attention',
          },
        ].map((item) => (
          <div className="overview-item" key={item.label}>
            <div className="overview-label">
              <span>{item.label}</span>
              <Icon name={item.icon} />
            </div>
            <strong>
              {state.status === 'success' ? item.count : '—'}
            </strong>
            <span className="overview-hint">{item.hint}</span>
          </div>
        ))}
      </section>

      <section className="runs-panel" aria-labelledby="runs-title">
        <div className="panel-heading">
          <h2 id="runs-title">All runs</h2>
          <span className="panel-caption">Every task tells its own story</span>
        </div>
        <RunFilters
          runs={runs}
          query={filters.query}
          status={filters.status}
          sort={filters.sort}
          onQueryChange={filters.setQuery}
          onStatusChange={filters.setStatus}
          onSortChange={filters.setSort}
        />
        {state.status === 'loading' && <RunsLoading />}
        {state.status === 'error' && <RunsError message={state.message} onRetry={reload} />}
        {state.status === 'success' &&
          (visibleRuns.length ? (
            <RunsList runs={visibleRuns} onSelect={setSelectedRun} />
          ) : (
            <RunsEmpty filtered={hasFilters} onReset={filters.reset} />
          ))}
        <div className="panel-footer">
          <span role="status">
            {state.status === 'success'
              ? `Showing ${visibleRuns.length} of ${runs.length} runs`
              : state.status === 'loading'
                ? 'Fetching data…'
                : 'Data unavailable'}
          </span>
          <span>Moscow time · UTC+3</span>
        </div>
      </section>
      <footer className="page-footer">
        <span>
          RUNFORGE <span className="footer-divider">/</span> BUILT FOR BUILDERS
        </span>
        <span>Local demo · data does not update automatically</span>
      </footer>
      {selectedRun && <RunDetails run={selectedRun} onClose={() => setSelectedRun(null)} />}
    </WorkspaceShell>
  );
}
