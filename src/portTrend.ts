import { PortEvent } from './history';

export interface PortTrend {
  port: number;
  openCount: number;
  closeCount: number;
  avgDurationMs: number | null;
  lastSeen: number | null;
  firstSeen: number | null;
  churnRate: number; // opens per minute over observed window
}

export function computePortTrend(port: number, events: PortEvent[]): PortTrend {
  const portEvents = events.filter(e => e.port === port);
  const opens = portEvents.filter(e => e.type === 'open');
  const closes = portEvents.filter(e => e.type === 'close');

  const timestamps = portEvents.map(e => e.timestamp).sort((a, b) => a - b);
  const firstSeen = timestamps.length > 0 ? timestamps[0] : null;
  const lastSeen = timestamps.length > 0 ? timestamps[timestamps.length - 1] : null;

  const durations: number[] = [];
  for (const open of opens) {
    const matchingClose = closes.find(c => c.timestamp > open.timestamp);
    if (matchingClose) {
      durations.push(matchingClose.timestamp - open.timestamp);
    }
  }

  const avgDurationMs =
    durations.length > 0
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length
      : null;

  let churnRate = 0;
  if (firstSeen !== null && lastSeen !== null && lastSeen > firstSeen) {
    const windowMinutes = (lastSeen - firstSeen) / 60000;
    churnRate = windowMinutes > 0 ? opens.length / windowMinutes : 0;
  }

  return {
    port,
    openCount: opens.length,
    closeCount: closes.length,
    avgDurationMs,
    firstSeen,
    lastSeen,
    churnRate,
  };
}

export function computeAllTrends(events: PortEvent[]): PortTrend[] {
  const ports = [...new Set(events.map(e => e.port))];
  return ports.map(port => computePortTrend(port, events)).sort(
    (a, b) => b.openCount - a.openCount
  );
}

export function getHighChurnPorts(trends: PortTrend[], threshold = 1.0): PortTrend[] {
  return trends.filter(t => t.churnRate >= threshold);
}
