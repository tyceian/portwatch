import { PortEvent } from './history';

export interface PortStats {
  port: number;
  openCount: number;
  closeCount: number;
  lastSeen: number | null;
  firstSeen: number | null;
  totalUptime: number;
  avgSessionMs: number;
}

export interface StatsMap {
  [port: number]: PortStats;
}

function emptyStats(port: number): PortStats {
  return {
    port,
    openCount: 0,
    closeCount: 0,
    lastSeen: null,
    firstSeen: null,
    totalUptime: 0,
    avgSessionMs: 0,
  };
}

export function computeStats(events: PortEvent[]): StatsMap {
  const stats: StatsMap = {};
  const openTimes: Record<number, number> = {};

  const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);

  for (const event of sorted) {
    const { port, type, timestamp } = event;
    if (!stats[port]) stats[port] = emptyStats(port);
    const s = stats[port];

    if (s.firstSeen === null || timestamp < s.firstSeen) s.firstSeen = timestamp;
    if (s.lastSeen === null || timestamp > s.lastSeen) s.lastSeen = timestamp;

    if (type === 'open') {
      s.openCount++;
      openTimes[port] = timestamp;
    } else if (type === 'close') {
      s.closeCount++;
      if (openTimes[port] !== undefined) {
        const duration = timestamp - openTimes[port];
        s.totalUptime += duration;
        delete openTimes[port];
      }
    }
  }

  for (const port of Object.keys(stats).map(Number)) {
    const s = stats[port];
    if (s.closeCount > 0) {
      s.avgSessionMs = Math.round(s.totalUptime / s.closeCount);
    }
  }

  return stats;
}

export function getTopPorts(statsMap: StatsMap, limit = 5): PortStats[] {
  return Object.values(statsMap)
    .sort((a, b) => b.openCount - a.openCount)
    .slice(0, limit);
}
