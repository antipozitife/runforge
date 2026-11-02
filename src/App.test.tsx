import { StrictMode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { mockRuns } from './data/runs';
import { listRuns } from './services/runsService';

vi.mock('./services/runsService', () => ({ listRuns: vi.fn() }));
const mockedListRuns = vi.mocked(listRuns);

function renderApp() {
  const user = userEvent.setup();
  render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  return user;
}

async function getRunButtons() {
  return within(await screen.findByRole('list', { name: 'Run list' })).getAllByRole(
    'button',
  );
}

beforeEach(() => {
  mockedListRuns.mockResolvedValue(mockRuns);
});

describe('страница Runs', () => {
  it('показывает загрузку, затем все 8 запусков', async () => {
    let complete!: (runs: typeof mockRuns) => void;
    mockedListRuns.mockImplementation(
      () =>
        new Promise((resolve) => {
          complete = resolve;
        }),
    );
    renderApp();
    expect(screen.getByRole('status', { name: 'Loading runs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeDisabled();
    complete(mockRuns);
    expect(await getRunButtons()).toHaveLength(8);
    expect(screen.queryByRole('status', { name: 'Loading runs' })).not.toBeInTheDocument();
  });

  it('фильтрует по каждому статусу и возвращает полный список по All', async () => {
    const user = renderApp();
    await getRunButtons();
    for (const [label, count] of [
      ['Queued', 2],
      ['Running', 2],
      ['Succeeded', 3],
      ['Failed', 1],
    ] as const) {
      const filter = screen.getByRole('button', { name: new RegExp(`^${label}`) });
      await user.click(filter);
      expect(filter).toHaveAttribute('aria-pressed', 'true');
      const buttons = await getRunButtons();
      expect(buttons).toHaveLength(count);
      buttons.forEach((button) => expect(button).toHaveTextContent(label));
    }
    await user.click(screen.getByRole('button', { name: /^All/ }));
    expect(await getRunButtons()).toHaveLength(8);
  });

  it('ищет по названию и репозиторию без учёта регистра, совмещает поиск со статусом', async () => {
    const user = renderApp();
    await getRunButtons();
    const search = screen.getByRole('searchbox');
    await user.type(search, '  CHECKOUT  ');
    expect(await getRunButtons()).toHaveLength(1);
    expect(screen.getByRole('button', { name: /Fix checkout tests/ })).toBeInTheDocument();
    await user.clear(search);
    await user.type(search, 'WEB-platform');
    expect(await getRunButtons()).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: /^Running/ }));
    expect(await getRunButtons()).toHaveLength(1);
    expect(screen.getByRole('button', { name: /Auth refactor/ })).toBeInTheDocument();
    expect(window.location.search).toContain('status=running');
    expect(new URLSearchParams(window.location.search).get('q')).toBe('WEB-platform');
  });

  it('показывает пустой результат и сбрасывает поиск вместе с фильтром', async () => {
    const user = renderApp();
    await getRunButtons();
    await user.click(screen.getByRole('button', { name: /^Queued/ }));
    await user.type(screen.getByRole('searchbox'), 'нет-такого-запуска');
    expect(screen.getByRole('heading', { name: 'No matching runs' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reset search and filters' }));
    expect(await getRunButtons()).toHaveLength(8);
    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(screen.getByRole('button', { name: /^All/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('открывает детали с логами и результатом с клавиатуры и возвращает фокус', async () => {
    const user = renderApp();
    await getRunButtons();
    const trigger = screen.getByRole('button', { name: /Fix checkout tests/ });
    trigger.focus();
    await user.keyboard('{Enter}');
    const dialog = await screen.findByRole('dialog', { name: 'Fix checkout tests' });
    expect(within(dialog).getByText('11:33:12 Tests: 24 passed, 0 failed')).toBeInTheDocument();
    expect(within(dialog).getByText(/Fixed checkout amount rounding assertions/)).toBeInTheDocument();
    expect(within(dialog).getByText('fix/checkout-tests')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Close details' })).toHaveFocus();
    await user.click(within(dialog).getByRole('button', { name: 'Back to runs' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('обрабатывает отсутствие длительности и результата', async () => {
    const user = renderApp();
    await getRunButtons();
    const queuedRun = screen.getByRole('button', { name: /Update dependencies/ });
    expect(within(queuedRun).getByLabelText('Duration: not available yet')).toHaveTextContent(
      '—',
    );
    await user.click(queuedRun);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Not available yet')).toBeInTheDocument();
    expect(within(dialog).getByText(/waiting for an available worker/)).toBeInTheDocument();
  });

  it('показывает ошибку и успешно загружает данные при повторе', async () => {
    window.history.replaceState(null, '', '/?mock=error');
    mockedListRuns.mockImplementation((options) =>
      options?.shouldFail
        ? Promise.reject(new Error('Test request failed'))
        : Promise.resolve(mockRuns),
    );
    const user = renderApp();
    expect(await screen.findByRole('alert')).toHaveTextContent('Test request failed');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await getRunButtons()).toHaveLength(8);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('восстанавливает поиск, статус и сортировку из URL', async () => {
    window.history.replaceState(null, '', '/?status=succeeded&q=web&sort=oldest');
    renderApp();
    expect(await getRunButtons()).toHaveLength(1);
    expect(screen.getByRole('button', { name: /Improve README/ })).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('web');
    expect(screen.getByRole('combobox', { name: 'Sort by:' })).toHaveValue('oldest');
    expect(screen.getByRole('button', { name: /^Succeeded/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('сортирует по дате и длительности, неизвестную длительность помещает в конец', async () => {
    const user = renderApp();
    expect((await getRunButtons())[0]).toHaveTextContent('Auth refactor');
    await user.selectOptions(screen.getByRole('combobox'), 'oldest');
    expect((await getRunButtons())[0]).toHaveTextContent('Accessibility audit');
    await user.selectOptions(screen.getByRole('combobox'), 'longest');
    const buttons = await getRunButtons();
    expect(buttons[0]).toHaveTextContent('Migrate database schema');
    expect(buttons.slice(-2).every((button) => button.textContent?.includes('Queued'))).toBe(true);
    await user.selectOptions(screen.getByRole('combobox'), 'shortest');
    expect((await getRunButtons())[0]).toHaveTextContent('Improve README');
    expect(new URLSearchParams(window.location.search).get('sort')).toBe('shortest');
  });

  it('различает пустую базу и пустой результат поиска', async () => {
    mockedListRuns.mockResolvedValue([]);
    renderApp();
    expect(await screen.findByRole('heading', { name: 'No runs yet' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Reset search and filters' }),
    ).not.toBeInTheDocument();
  });

  it('обновляет данные, сохраняя выбранный фильтр', async () => {
    const user = renderApp();
    await getRunButtons();
    await user.click(screen.getByRole('button', { name: /^Failed/ }));
    await user.click(screen.getByRole('button', { name: 'Refresh' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Refresh' })).toBeEnabled());
    expect(await getRunButtons()).toHaveLength(1);
    expect(screen.getByRole('button', { name: /^Failed/ })).toHaveAttribute('aria-pressed', 'true');
  });
});
