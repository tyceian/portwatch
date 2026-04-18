import { execSync } from 'child_process';

export interface PortInfo {
  port: number;
  pid: number;
  process: string;
  protocol: 'tcp' | 'udp';
}

function parseLsofLine(line: string): PortInfo | null {
  const parts = line.trim().split(/\s+/);
  if (parts.length < 9) return null;

  const processName = parts[0];
  const pid = parseInt(parts[1], 10);
  const protocol = parts[7].toLowerCase() as 'tcp' | 'udp';
  const addressPart = parts[8];

  const portMatch = addressPart.match(/(\d+)$/);
  if (!portMatch) return null;

  const port = parseInt(portMatch[1], 10);
  if (isNaN(port) || isNaN(pid)) return null;

  return { port, pid, process: processName, protocol };
}

export function scanPorts(): PortInfo[] {
  try {
    const output = execSync('lsof -iTCP -iUDP -nP -sTCP:LISTEN', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });

    const lines = output.split('\n').slice(1); // skip header
    const results: PortInfo[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;
      const info = parseLsofLine(line);
      if (info) results.push(info);
    }

    return results;
  } catch {
    return [];
  }
}

export function getActivePorts(): Set<number> {
  return new Set(scanPorts().map((p) => p.port));
}
