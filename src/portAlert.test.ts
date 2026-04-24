import { evaluateRules, defaultRules, PortAlertRule } from './portAlert';
import { emptyStats } from './portStats';
import { computePortTrend } from './portTrend';
import { computeHealthScore } from './portHealth';

const baseTrend = computePortTrend([]);
const baseHealth = computeHealthScore(emptyStats(), baseTrend);

describe('evaluateRules', () => {
  it('returns empty array when no rules match', () => {
    const results = evaluateRules(3000, emptyStats(), baseTrend, baseHealth);
    expect(results).toHaveLength(0);
  });

  it('triggers high-churn rule when churn exceeds threshold', () => {
    const trend = { ...baseTrend, openCount: 15, closeCount: 10 };
    const results = evaluateRules(3000, emptyStats(), trend, baseHealth);
    const names = results.map((r) => r.rule);
    expect(names).toContain('high-churn');
  });

  it('triggers low-health rule when score is below 40', () => {
    const health = { ...baseHealth, score: 20 };
    const results = evaluateRules(3000, emptyStats(), baseTrend, health);
    const names = results.map((r) => r.rule);
    expect(names).toContain('low-health');
  });

  it('triggers frequent-closes rule when closes outnumber opens', () => {
    const stats = { ...emptyStats(), openCount: 2, closeCount: 10 };
    const results = evaluateRules(3000, stats, baseTrend, baseHealth);
    const names = results.map((r) => r.rule);
    expect(names).toContain('frequent-closes');
  });

  it('triggers long-lived rule when avgDuration > 1 hour', () => {
    const stats = { ...emptyStats(), avgDuration: 7200_000 };
    const results = evaluateRules(3000, stats, baseTrend, baseHealth);
    const names = results.map((r) => r.rule);
    expect(names).toContain('long-lived');
  });

  it('includes correct port and severity in result', () => {
    const health = { ...baseHealth, score: 10 };
    const results = evaluateRules(8080, emptyStats(), baseTrend, health);
    const critical = results.find((r) => r.rule === 'low-health');
    expect(critical?.port).toBe(8080);
    expect(critical?.severity).toBe('critical');
  });

  it('respects custom rules', () => {
    const custom: PortAlertRule[] = [
      {
        name: 'always-fires',
        severity: 'info',
        check: () => true,
        message: (p) => `custom alert on ${p}`,
      },
    ];
    const results = evaluateRules(9000, emptyStats(), baseTrend, baseHealth, custom);
    expect(results).toHaveLength(1);
    expect(results[0].rule).toBe('always-fires');
  });
});
