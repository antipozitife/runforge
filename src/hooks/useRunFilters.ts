import { useEffect, useState } from 'react';
import { RUN_STATUSES, type RunFilter, type RunSort } from '../types/run';

function readFilters() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const sort = params.get('sort');
  return {
    query: params.get('q') ?? '',
    status: (RUN_STATUSES.some((value) => value === status) ? status : 'all') as RunFilter,
    sort: (
      sort === 'oldest' || sort === 'longest' || sort === 'shortest' ? sort : 'newest'
    ) as RunSort,
  };
}

export function useRunFilters() {
  const [filters, setFilters] = useState(readFilters);

  useEffect(() => {
    const syncFromUrl = () => setFilters(readFilters());
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const values = {
      q: filters.query,
      status: filters.status === 'all' ? '' : filters.status,
      sort: filters.sort === 'newest' ? '' : filters.sort,
    };
    for (const [key, value] of Object.entries(values)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, '', url);
  }, [filters]);

  return {
    ...filters,
    setQuery: (query: string) => setFilters((current) => ({ ...current, query })),
    setStatus: (status: RunFilter) => setFilters((current) => ({ ...current, status })),
    setSort: (sort: RunSort) => setFilters((current) => ({ ...current, sort })),
    reset: () => setFilters({ query: '', status: 'all', sort: 'newest' }),
  };
}
