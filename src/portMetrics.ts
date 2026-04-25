// Port metrics: uptime, downtime, and availability tracking

export interface PortMetrics {
  port: number;
  firstSeen: number;
  lastSeen: number;
  totalUptime: number;   // ms
  totalDowntime: number; // ms
  openCount: number;
  closeCount: number;
  availabilityPct: number;
}

interface MetricsState {
  metrics: Map<number, PortMetrics>;
  windowStart: number;
}

const state: MetricsState = {
  metrics: new Map(),
  windowStart: Date.now(),
};

export function resetMetrics(): void {
  state.metrics.clear();
  state.windowStart = Date.now();
}

export function recordOpen(port: number, at = Date.now()): void {
  const m = state.metrics.get(port) ?? {
    port,
    firstSeen: at,
    lastSeen: at,
    totalUptime: 0,
    totalDowntime: 0,
    openCount: 0,
    closeCount: 0,
    availabilityPct: 100,
  };
  m.openCount += 1;
  m.lastSeen = at;
  state.metrics.set(port, m);
}

export function recordClose(port: number, at = Date.now()): void {
  const m = state.metrics.get(port);
  if (!m) return;
  m.closeCount += 1;
  m.lastSeen = at;
  state.metrics.set(port, m);
}

export function recordUptime(port: number, ms: number): void {
  const m = state.metrics.get(port);
  if (!m) return;
  m.totalUptime += ms;
  const window = Date.now() - state.windowStart;
  m.availabilityPct = window > 0 ? Math.min(100, (m.totalUptime / window) * 100) : 100;
  state.metrics.set(port, m);
}

export function getMetrics(port: number): PortMetrics | undefined {
  return state.metrics.get(port);
}

export function listMetrics(): PortMetrics[] {
  return Array.from(state.metrics.values()).sort((a, b) => a.port - b.port);
}
