import { RUN_STATUSES, type Run, type RunFilter, type RunSort } from '../types/run';
import { statusLabels } from './StatusBadge';
import { Icon } from './Icon';

type Props = {
  runs: Run[];
  query: string;
  status: RunFilter;
  sort: RunSort;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: RunFilter) => void;
  onSortChange: (value: RunSort) => void;
};

export function RunFilters({
  runs,
  query,
  status,
  sort,
  onQueryChange,
  onStatusChange,
  onSortChange,
}: Props) {
  return (
    <div className="filters">
      <div className="filter-topline">
        <div className="search-field">
          <Icon name="search" />
          <label className="sr-only" htmlFor="run-search">
            Search by run name or repository
          </label>
          <input
            id="run-search"
            type="search"
            placeholder="Search runs or repositories…"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            autoComplete="off"
          />
          {query && (
            <button
              className="icon-button clear-search"
              aria-label="Clear search"
              onClick={() => onQueryChange('')}
            >
              <Icon name="close" />
            </button>
          )}
        </div>
        <div className="sort-field">
          <label htmlFor="run-sort">Sort by:</label>
          <select
            id="run-sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as RunSort)}
          >
            <option value="newest">Date · newest first</option>
            <option value="oldest">Date · oldest first</option>
            <option value="longest">Duration · longest first</option>
            <option value="shortest">Duration · shortest first</option>
          </select>
        </div>
      </div>
      <div className="status-filters" role="group" aria-label="Filter by status">
        {(['all', ...RUN_STATUSES] as const).map((value) => (
          <button
            key={value}
            className="filter-button"
            aria-pressed={status === value}
            onClick={() => onStatusChange(value)}
          >
            {value !== 'all' && <span className={`filter-dot dot-${value}`} />}
            {value === 'all' ? 'All' : statusLabels[value]}
            <span className="filter-count">
              {value === 'all' ? runs.length : runs.filter((run) => run.status === value).length}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
