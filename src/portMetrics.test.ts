import {
  recordOpen,
  recordClose,
  recordUptime,
  getMetrics,
  listMetrics,
  resetMetrics,
} from './portMetrics';

beforeEach(() => resetMetrics());

test('recordOpen creates entry', () => {
  recordOpen(3000, 1000);
  const m = getMetrics(3000);
  expect(m).toBeDefined();
  expect(m!.port).toBe(3000);
  expect(m!.openCount).toBe(1);
  expect(m!.closeCount).toBe(0);
});

test('recordOpen increments openCount', () => {
  recordOpen(3000, 1000);
  recordOpen(3000, 2000);
  expect(getMetrics(3000)!.openCount).toBe(2);
});

test('recordClose increments closeCount', () => {
  recordOpen(3000, 1000);
  recordClose(3000, 2000);
  const m = getMetrics(3000)!;
  expect(m.closeCount).toBe(1);
});

test('recordClose on unknown port is no-op', () => {
  expect(() => recordClose(9999)).not.toThrow();
  expect(getMetrics(9999)).toBeUndefined();
});

test('recordUptime accumulates', () => {
  recordOpen(3000, 1000);
  recordUptime(3000, 5000);
  recordUptime(3000, 3000);
  expect(getMetrics(3000)!.totalUptime).toBe(8000);
});

test('availabilityPct is clamped to 100', () => {
  recordOpen(4000, 1000);
  recordUptime(4000, 999_999_999);
  expect(getMetrics(4000)!.availabilityPct).toBeLessThanOrEqual(100);
});

test('listMetrics returns sorted by port', () => {
  recordOpen(8080);
  recordOpen(3000);
  recordOpen(5000);
  const ports = listMetrics().map(m => m.port);
  expect(ports).toEqual([3000, 5000, 8080]);
});

test('resetMetrics clears all', () => {
  recordOpen(3000);
  resetMetrics();
  expect(listMetrics()).toHaveLength(0);
});
