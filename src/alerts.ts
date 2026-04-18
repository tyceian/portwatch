import chalk from 'chalk';

export type AlertLevel = 'info' | 'warn' | 'error';

export interface PortAlert {
  port: number;
  pid?: number;
  process?: string;
  level: AlertLevel;
  message: string;
  timestamp: Date;
}

export interface AlertConfig {
  watchPorts?: number[];
  ignorePorts?: number[];
  notifyOnNew?: boolean;
  notifyOnClose?: boolean;
}

const levelColors: Record<AlertLevel, (s: string) => string> = {
  info: chalk.cyan,
  warn: chalk.yellow,
  error: chalk.red,
};

export function formatAlert(alert: PortAlert): string {
  const time = alert.timestamp.toLocaleTimeString();
  const color = levelColors[alert.level];
  const prefix = color(`[${alert.level.toUpperCase()}]`);
  const portInfo = chalk.bold(`port ${alert.port}`);
  const procInfo = alert.process ? chalk.gray(` (${alert.process} pid:${alert.pid})`) : '';
  return `${chalk.gray(time)} ${prefix} ${portInfo}${procInfo} — ${alert.message}`;
}

export function createAlert(
  port: number,
  message: string,
  level: AlertLevel = 'info',
  pid?: number,
  process?: string
): PortAlert {
  return { port, pid, process, level, message, timestamp: new Date() };
}

export function shouldAlert(port: number, config: AlertConfig): boolean {
  if (config.ignorePorts?.includes(port)) return false;
  if (config.watchPorts && config.watchPorts.length > 0) {
    return config.watchPorts.includes(port);
  }
  return true;
}
