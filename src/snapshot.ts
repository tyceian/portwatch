import * as fs from 'fs';
import * as path from 'path';
import { PortMap } from './scanner';

export interface Snapshot {
  timestamp: number;
  ports: PortMap;
}

export function createSnapshot(ports: PortMap): Snapshot {
  return {
    timestamp: Date.now(),
    ports,
  };
}

export function saveSnapshot(snapshot: Snapshot, filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf-8');
}

export function loadSnapshot(filePath: string): Snapshot | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as Snapshot;
  } catch {
    return null;
  }
}

export function diffSnapshots(
  prev: Snapshot | null,
  curr: Snapshot
): { opened: number[]; closed: number[] } {
  if (!prev) return { opened: Object.keys(curr.ports).map(Number), closed: [] };
  const prevPorts = new Set(Object.keys(prev.ports).map(Number));
  const currPorts = new Set(Object.keys(curr.ports).map(Number));
  const opened = [...currPorts].filter((p) => !prevPorts.has(p));
  const closed = [...prevPorts].filter((p) => !currPorts.has(p));
  return { opened, closed };
}
