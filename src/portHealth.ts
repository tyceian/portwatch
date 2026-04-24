import { PortStats } from './portStats';
import { PortTrend } from './portTrend';

export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'unknown';

export interface PortHealth {
  port: number;
  status: HealthStatus;
  score: number; // 0-100
  reasons: string[];
}

export interface HealthThresholds {
  maxChurnRate: number;   // events per minute
  maxDowntime: number;    // seconds
  minUptimeRatio: number; // 0-1
}

const DEFAULT_THRESHOLDS: HealthThresholds = {
  maxChurnRate: 10,
  maxDowntime: 30,
  minUptimeRatio: 0.8,
};

export function computeHealthScore(
  stats: PortStats,
  trend: PortTrend,
  thresholds: HealthThresholds = DEFAULT_THRESHOLDS
): PortHealth {
  const reasons: string[] = [];
  let score = 100;

  const durationMinutes = stats.totalDuration / 60;
  const churnRate = durationMinutes > 0 ? stats.openCount / durationMinutes : 0;

  if (churnRate > thresholds.maxChurnRate) {
    score -= 30;
    reasons.push(`High churn rate: ${churnRate.toFixed(1)} opens/min`);
  }

  if (stats.uptimeRatio < thresholds.minUptimeRatio) {
    score -= 25;
    reasons.push(`Low uptime: ${(stats.uptimeRatio * 100).toFixed(0)}%`);
  }

  if (stats.avgDowntime > thresholds.maxDowntime) {
    score -= 20;
    reasons.push(`High avg downtime: ${stats.avgDowntime.toFixed(0)}s`);
  }

  if (trend.direction === 'unstable') {
    score -= 15;
    reasons.push('Unstable open/close pattern detected');
  }

  score = Math.max(0, score);

  const status: HealthStatus =
    score >= 80 ? 'healthy' :
    score >= 50 ? 'warning' :
    score >= 20 ? 'critical' : 'unknown';

  return { port: stats.port, status, score, reasons };
}

export function assessAllPorts(
  statsMap: Map<number, PortStats>,
  trendsMap: Map<number, PortTrend>,
  thresholds?: HealthThresholds
): Map<number, PortHealth> {
  const result = new Map<number, PortHealth>();
  for (const [port, stats] of statsMap) {
    const trend = trendsMap.get(port);
    if (trend) {
      result.set(port, computeHealthScore(stats, trend, thresholds));
    }
  }
  return result;
}
