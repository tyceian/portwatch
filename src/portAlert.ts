import { PortHealth } from './portHealth';
import { PortTrend } from './portTrend';
import { PortStats } from './portStats';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface PortAlertRule {
  name: string;
  severity: AlertSeverity;
  check: (stats: PortStats, trend: PortTrend, health: PortHealth) => boolean;
  message: (port: number) => string;
}

export interface PortAlertResult {
  port: number;
  rule: string;
  severity: AlertSeverity;
  message: string;
  triggeredAt: number;
}

export const defaultRules: PortAlertRule[] = [
  {
    name: 'high-churn',
    severity: 'warning',
    check: (_s, trend) => trend.openCount + trend.closeCount > 20,
    message: (port) => `Port ${port} has unusually high open/close churn`,
  },
  {
    name: 'low-health',
    severity: 'critical',
    check: (_s, _t, health) => health.score < 40,
    message: (port) => `Port ${port} health score is critically low`,
  },
  {
    name: 'frequent-closes',
    severity: 'warning',
    check: (stats) => stats.closeCount > 0 && stats.openCount / stats.closeCount < 0.5,
    message: (port) => `Port ${port} closes more often than it opens`,
  },
  {
    name: 'long-lived',
    severity: 'info',
    check: (stats) => stats.avgDuration > 3600_000,
    message: (port) => `Port ${port} connections are unusually long-lived`,
  },
];

export function evaluateRules(
  port: number,
  stats: PortStats,
  trend: PortTrend,
  health: PortHealth,
  rules: PortAlertRule[] = defaultRules
): PortAlertResult[] {
  const results: PortAlertResult[] = [];
  for (const rule of rules) {
    if (rule.check(stats, trend, health)) {
      results.push({
        port,
        rule: rule.name,
        severity: rule.severity,
        message: rule.message(port),
        triggeredAt: Date.now(),
      });
    }
  }
  return results;
}
