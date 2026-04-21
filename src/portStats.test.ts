import { computeStats, getTopPorts, PortStats } from './portStats';
import { PortEvent } from './history';

function makeEvent(port: number, type: 'open' | 'close', timestamp: number): PortEvent {
  return { port, type, timestamp, pid: undefined, process: undefined };
}

describe('computeStats', () => {
  it('returns empty map for no events', () => {
    expect(computeStats([])).toEqual({});
  });

  it('counts opens and closes per port', () => {
    const events = [
      makeEvent(3000, 'open', 1000),
      makeEvent(3000, 'close', 2000),
      makeEvent(3000, 'open', 3000),
    ];
    const stats = computeStats(events);
    expect(stats[3000].openCount).toBe(2);
    expect(stats[3000].closeCount).toBe(1);
  });

  it('tracks firstSeen and lastSeen', () => {
    const events = [
      makeEvent(8080, 'open', 500),
      makeEvent(8080, 'close', 1500),
    ];
    const stats = computeStats(events);
    expect(stats[8080].firstSeen).toBe(500);
    expect(stats[8080].lastSeen).toBe(1500);
  });

  it('calculates totalUptime and avgSessionMs', () => {
    const events = [
      makeEvent(4000, 'open', 0),
      makeEvent(4000, 'close', 2000),
      makeEvent(4000, 'open', 3000),
      makeEvent(4000, 'close', 5000),
    ];
    const stats = computeStats(events);
    expect(stats[4000].totalUptime).toBe(4000);
    expect(stats[4000].avgSessionMs).toBe(2000);
  });

  it('handles multiple ports independently', () => {
    const events = [
      makeEvent(3000, 'open', 100),
      makeEvent(4000, 'open', 200),
      makeEvent(3000, 'close', 300),
    ];
    const stats = computeStats(events);
    expect(stats[3000].openCount).toBe(1);
    expect(stats[4000].openCount).toBe(1);
    expect(stats[3000].closeCount).toBe(1);
    expect(stats[4000].closeCount).toBe(0);
  });
});

describe('getTopPorts', () => {
  it('returns ports sorted by openCount descending', () => {
    const statsMap = {
      3000: { port: 3000, openCount: 5, closeCount: 5, lastSeen: 0, firstSeen: 0, totalUptime: 0, avgSessionMs: 0 },
      4000: { port: 4000, openCount: 10, closeCount: 8, lastSeen: 0, firstSeen: 0, totalUptime: 0, avgSessionMs: 0 },
      5000: { port: 5000, openCount: 2, closeCount: 1, lastSeen: 0, firstSeen: 0, totalUptime: 0, avgSessionMs: 0 },
    };
    const top = getTopPorts(statsMap, 2);
    expect(top[0].port).toBe(4000);
    expect(top[1].port).toBe(3000);
    expect(top.length).toBe(2);
  });

  it('returns all if limit exceeds entries', () => {
    const statsMap = {
      3000: { port: 3000, openCount: 1, closeCount: 0, lastSeen: 0, firstSeen: 0, totalUptime: 0, avgSessionMs: 0 },
    };
    expect(getTopPorts(statsMap, 10).length).toBe(1);
  });
});
