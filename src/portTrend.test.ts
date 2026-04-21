import { computePortTrend, computeAllTrends, getHighChurnPorts } from './portTrend';
import { PortEvent } from './history';

function makeEvent(port: number, type: 'open' | 'close', timestamp: number): PortEvent {
  return { port, type, timestamp, pid: undefined, process: undefined };
}

describe('computePortTrend', () => {
  it('returns zeros for empty events', () => {
    const trend = computePortTrend(3000, []);
    expect(trend.openCount).toBe(0);
    expect(trend.closeCount).toBe(0);
    expect(trend.avgDurationMs).toBeNull();
    expect(trend.firstSeen).toBeNull();
    expect(trend.lastSeen).toBeNull();
    expect(trend.churnRate).toBe(0);
  });

  it('counts opens and closes correctly', () => {
    const events = [
      makeEvent(3000, 'open', 1000),
      makeEvent(3000, 'close', 2000),
      makeEvent(3000, 'open', 3000),
    ];
    const trend = computePortTrend(3000, events);
    expect(trend.openCount).toBe(2);
    expect(trend.closeCount).toBe(1);
  });

  it('calculates avgDurationMs from matched open/close pairs', () => {
    const events = [
      makeEvent(3000, 'open', 0),
      makeEvent(3000, 'close', 4000),
    ];
    const trend = computePortTrend(3000, events);
    expect(trend.avgDurationMs).toBe(4000);
  });

  it('sets firstSeen and lastSeen correctly', () => {
    const events = [
      makeEvent(3000, 'open', 5000),
      makeEvent(3000, 'close', 10000),
    ];
    const trend = computePortTrend(3000, events);
    expect(trend.firstSeen).toBe(5000);
    expect(trend.lastSeen).toBe(10000);
  });

  it('ignores events for other ports', () => {
    const events = [
      makeEvent(4000, 'open', 1000),
      makeEvent(3000, 'open', 2000),
    ];
    const trend = computePortTrend(3000, events);
    expect(trend.openCount).toBe(1);
  });
});

describe('computeAllTrends', () => {
  it('returns a trend per unique port sorted by openCount desc', () => {
    const events = [
      makeEvent(3000, 'open', 1000),
      makeEvent(3000, 'open', 2000),
      makeEvent(4000, 'open', 3000),
    ];
    const trends = computeAllTrends(events);
    expect(trends).toHaveLength(2);
    expect(trends[0].port).toBe(3000);
    expect(trends[1].port).toBe(4000);
  });
});

describe('getHighChurnPorts', () => {
  it('filters ports below threshold', () => {
    const events = [
      makeEvent(3000, 'open', 0),
      makeEvent(3000, 'open', 30000),
      makeEvent(3000, 'open', 60000),
    ];
    const trends = computeAllTrends(events);
    const high = getHighChurnPorts(trends, 2.0);
    expect(high).toHaveLength(1);
    expect(high[0].port).toBe(3000);
  });
});
