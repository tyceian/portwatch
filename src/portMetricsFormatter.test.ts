import { PortMetrics } from './portMetrics';
import {
  formatMetricsInline,
  renderMetricsRow,
  renderMetricsTable,
  renderMetricsSummary,
} from './portMetricsFormatter';

function makeMetrics(overrides: Partial<PortMetrics> = {}): PortMetrics {
  return {
    port: 3000,
    firstSeen: 0,
    lastSeen: 1000,
    totalUptime: 60_000,
    totalDowntime: 0,
    openCount: 3,
    closeCount: 2,
    availabilityPct: 98.5,
    ...overrides,
  };
}

test('formatMetricsInline contains port and opens', () => {
  const line = formatMetricsInline(makeMetrics());
  expect(line).toContain('3000');
  expect(line).toContain('opens=3');
  expect(line).toContain('closes=2');
});

test('formatMetricsInline shows availability', () => {
  const line = formatMetricsInline(makeMetrics({ availabilityPct: 72.3 }));
  expect(line).toContain('72.3%');
});

test('renderMetricsRow pads columns', () => {
  const row = renderMetricsRow(makeMetrics());
  expect(row).toContain('3000');
  expect(row.length).toBeGreaterThan(20);
});

test('renderMetricsTable shows header', () => {
  const table = renderMetricsTable([makeMetrics()]);
  expect(table).toContain('PORT');
  expect(table).toContain('AVAIL');
});

test('renderMetricsTable empty message', () => {
  const table = renderMetricsTable([]);
  expect(table).toContain('no metrics');
});

test('renderMetricsSummary shows count', () => {
  const summary = renderMetricsSummary([makeMetrics(), makeMetrics({ port: 8080 })]);
  expect(summary).toContain('2 port(s)');
});

test('renderMetricsSummary empty', () => {
  const summary = renderMetricsSummary([]);
  expect(summary).toContain('no metrics');
});
