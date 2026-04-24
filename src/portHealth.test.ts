import { computeHealthScore, assessAllPorts, PortHealth } from './portHealth';
import { PortStats } from './portStats';
import { PortTrend } from './portTrend';

function makeStats(overrides: Partial<PortStats> = {}): PortStats {
  return {
    port: 3000,
    openCount: 2,
    closeCount: 1,
    totalDuration: 300,
    avgUptime: 120,
    avgDowntime: 10,
    uptimeRatio: 0.9,
    lastSeen: Date.now(),
    ...overrides,
  };
}

function makeTrend(direction: PortTrend['direction'] = 'stable'): PortTrend {
  return { port: 3000, direction, openRate: 1, closeRate: 1, netDelta: 0 };
}

describe('computeHealthScore', () => {
  it('returns healthy for a stable, high-uptime port', () => {
    const health = computeHealthScore(makeStats(), makeTrend('stable'));
    expect(health.status).toBe('healthy');
    expect(health.score).toBeGreaterThanOrEqual(80);
    expect(health.reasons).toHaveLength(0);
  });

  it('penalises high churn rate', () => {
    // 120 opens in 2 minutes = 60/min, way above threshold of 10
    const stats = makeStats({ openCount: 120, totalDuration: 120 });
    const health = computeHealthScore(stats, makeTrend());
    expect(health.score).toBeLessThan(80);
    expect(health.reasons.some(r => r.includes('churn'))).toBe(true);
  });

  it('penalises low uptime ratio', () => {
    const stats = makeStats({ uptimeRatio: 0.4 });
    const health = computeHealthScore(stats, makeTrend());
    expect(health.score).toBeLessThan(80);
    expect(health.reasons.some(r => r.includes('uptime'))).toBe(true);
  });

  it('penalises unstable trend', () => {
    const health = computeHealthScore(makeStats(), makeTrend('unstable'));
    expect(health.score).toBeLessThan(100);
    expect(health.reasons.some(r => r.includes('Unstable'))).toBe(true);
  });

  it('marks critical when score is very low', () => {
    const stats = makeStats({ uptimeRatio: 0.1, avgDowntime: 120, openCount: 200, totalDuration: 60 });
    const health = computeHealthScore(stats, makeTrend('unstable'));
    expect(['critical', 'unknown']).toContain(health.status);
  });
});

describe('assessAllPorts', () => {
  it('returns a health entry for each port with a matching trend', () => {
    const statsMap = new Map([[3000, makeStats()], [8080, makeStats({ port: 8080 })]]);
    const trendsMap = new Map([[3000, makeTrend()]]);
    const result = assessAllPorts(statsMap, trendsMap);
    expect(result.size).toBe(1);
    expect(result.has(3000)).toBe(true);
    expect(result.has(8080)).toBe(false);
  });

  it('returns empty map when inputs are empty', () => {
    expect(assessAllPorts(new Map(), new Map()).size).toBe(0);
  });
});
