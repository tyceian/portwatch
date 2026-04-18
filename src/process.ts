import { execSync } from 'child_process';

export interface ProcessInfo {
  pid: number;
  name: string;
  port: number;
  protocol: string;
}

export function getProcessForPort(port: number): ProcessInfo | null {
  try {
    const output = execSync(`lsof -iTCP:${port} -sTCP:LISTEN -n -P`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const lines = output.trim().split('\n').slice(1);
    if (!lines.length) return null;
    const parts = lines[0].split(/\s+/);
    if (parts.length < 9) return null;
    return {
      pid: parseInt(parts[1], 10),
      name: parts[0],
      port,
      protocol: 'TCP',
    };
  } catch {
    return null;
  }
}

export function getProcessMap(ports: number[]): Map<number, ProcessInfo> {
  const map = new Map<number, ProcessInfo>();
  for (const port of ports) {
    const info = getProcessForPort(port);
    if (info) map.set(port, info);
  }
  return map;
}

export function formatProcessInfo(info: ProcessInfo): string {
  return `${info.name} (pid ${info.pid}) on port ${info.port}/${info.protocol}`;
}
