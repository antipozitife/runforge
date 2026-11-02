type IconName =
  | 'bolt'
  | 'runs'
  | 'search'
  | 'refresh'
  | 'arrow'
  | 'branch'
  | 'repo'
  | 'close'
  | 'terminal'
  | 'check'
  | 'clock'
  | 'alert';

const paths: Record<IconName, string> = {
  bolt: 'm13 2-9 12h7l-1 8 10-12h-7l1-8Z',
  runs: 'M4 5h16v14H4z M4 9h16 M8 13h2 M8 16h6',
  search: 'm21 21-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  refresh: 'M20 7v5h-5 M4 17v-5h5 M6.1 6a8 8 0 0 1 13.4 3 M4.5 15A8 8 0 0 0 18 18',
  arrow: 'M5 12h14 m-5-5 5 5-5 5',
  branch:
    'M6 6v12 M18 6v3a6 6 0 0 1-6 6H6 M9 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M9 21a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M21 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  repo: 'M4 4a2 2 0 0 1 2-2h14v20H6a2 2 0 0 1-2-2V4Z M4 18h16 M8 6h8 M8 10h5',
  close: 'm6 6 12 12 M6 18 18 6',
  terminal: 'm5 7 4 5-4 5 M13 17h6',
  check: 'm5 12 4 4L19 6',
  clock: 'M12 8v4l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  alert: 'M12 8v5 M12 17h.01 M12 2 2 21h20L12 2Z',
};

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
