import {
  recordOpen,
  recordClose,
  recordUptime,
  getMetrics,
  listMetrics,
  resetMetrics,
} from './portMetrics';
import {
  renderMetricsTable,
  renderMetricsSummary,
  formatMetricsInline,
} from './portMetricsFormatter';

export function handleRecordOpen(port: number): void {
  recordOpen(port);
  console.log(`recorded open for port ${port}`);
}

export function handleRecordClose(port: number): void {
  recordClose(port);
  console.log(`recorded close for port ${port}`);
}

export function handleRecordUptime(port: number, ms: number): void {
  recordUptime(port, ms);
  console.log(`added ${ms}ms uptime to port ${port}`);
}

export function handleGetMetrics(port: number): void {
  const m = getMetrics(port);
  if (!m) {
    console.log(`no metrics for port ${port}`);
    return;
  }
  console.log(formatMetricsInline(m));
}

export function handleListMetrics(): void {
  const all = listMetrics();
  console.log(renderMetricsTable(all));
  console.log();
  console.log(renderMetricsSummary(all));
}

export function handleResetMetrics(): void {
  resetMetrics();
  console.log('metrics reset');
}
