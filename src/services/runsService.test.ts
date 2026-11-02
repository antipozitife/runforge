import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { listRuns } from './runsService';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('mock-сервис', () => {
  it('возвращает все статусы с задержкой и независимые копии данных', async () => {
    const onResolved = vi.fn();
    const first = listRuns();
    void first.then(onResolved);
    await vi.advanceTimersByTimeAsync(649);
    expect(onResolved).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    const data = await first;
    expect(data.length).toBeGreaterThanOrEqual(6);
    expect(new Set(data.map((run) => run.status)).size).toBe(4);
    data[0].logs.push('mutation');
    const next = listRuns();
    await vi.runAllTimersAsync();
    expect((await next)[0].logs).not.toContain('mutation');
  });

  it('возвращает контролируемую ошибку', async () => {
    const result = expect(listRuns({ shouldFail: true })).rejects.toThrow(
      'Unable to fetch runs',
    );
    await vi.runAllTimersAsync();
    await result;
  });

  it('отменяет запрос и удаляет таймер', async () => {
    const controller = new AbortController();
    const result = expect(listRuns({ signal: controller.signal })).rejects.toMatchObject({
      name: 'AbortError',
    });
    controller.abort();
    await result;
    expect(vi.getTimerCount()).toBe(0);
  });
});
