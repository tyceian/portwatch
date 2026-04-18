import { PortAlert, AlertConfig, createAlert, formatAlert, shouldAlert } from './alerts';

export type PortMap = Map<number, { pid: number; process: string }>;

export interface NotifierOptions {
  config: AlertConfig;
  onAlert?: (alert: PortAlert) => void;
}

export function diffPortMaps(
  previous: PortMap,
  current: PortMap
): { opened: number[]; closed: number[] } {
  const opened = [...current.keys()].filter((p) => !previous.has(p));
  const closed = [...previous.keys()].filter((p) => !current.has(p));
  return { opened, closed };
}

export function processPortDiff(
  previous: PortMap,
  current: PortMap,
  options: NotifierOptions
): PortAlert[] {
  const { config, onAlert } = options;
  const { opened, closed } = diffPortMaps(previous, current);
  const alerts: PortAlert[] = [];

  if (config.notifyOnNew !== false) {
    for (const port of opened) {
      if (!shouldAlert(port, config)) continue;
      const entry = current.get(port);
      const alert = createAlert(port, 'port opened', 'info', entry?.pid, entry?.process);
      alerts.push(alert);
      onAlert ? onAlert(alert) : console.log(formatAlert(alert));
    }
  }

  if (config.notifyOnClose !== false) {
    for (const port of closed) {
      if (!shouldAlert(port, config)) continue;
      const entry = previous.get(port);
      const alert = createAlert(port, 'port closed', 'warn', entry?.pid, entry?.process);
      alerts.push(alert);
      onAlert ? onAlert(alert) : console.log(formatAlert(alert));
    }
  }

  return alerts;
}
