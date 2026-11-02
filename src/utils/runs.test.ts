import { describe, expect, it } from 'vitest';
import { formatDate, formatDuration } from './runs';

describe('форматирование', () => {
  it('различает нулевую и неизвестную длительность, поддерживает часы', () => {
    expect(formatDuration()).toBe('—');
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(192)).toBe('3m 12s');
    expect(formatDuration(3601)).toBe('1h 0m 1s');
  });

  it('показывает московское время независимо от часового пояса устройства', () => {
    expect(formatDate('2026-11-02T08:42:00Z')).toContain('11:42');
    expect(formatDate('not-a-date')).toBe('Date unavailable');
  });
});
