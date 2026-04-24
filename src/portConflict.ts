import { PortMap } from './scanner';
import { getLabelForPort } from './portLabel';

export interface PortConflict {
  port: number;
  pids: number[];
  processes: string[];
  label: string | null;
}

/**
 * Detects ports that are being listened on by more than one process (PID).
 * This can happen with SO_REUSEPORT or misconfigured services.
 */
export function detectConflicts(portMap: PortMap): PortConflict[] {
  const conflicts: PortConflict[] = [];

  for (const [portStr, entries] of Object.entries(portMap)) {
    const port = Number(portStr);
    if (entries.length < 2) continue;

    const pids = entries.map((e) => e.pid);
    const processes = entries.map((e) => e.process);
    const uniquePids = [...new Set(pids)];

    if (uniquePids.length < 2) continue;

    conflicts.push({
      port,
      pids: uniquePids,
      processes: [...new Set(processes)],
      label: getLabelForPort(port) ?? null,
    });
  }

  return conflicts.sort((a, b) => a.port - b.port);
}

/**
 * Returns true if any conflicts exist in the given port map.
 */
export function hasConflicts(portMap: PortMap): boolean {
  return detectConflicts(portMap).length > 0;
}

/**
 * Formats a single conflict into a human-readable summary string.
 */
export function formatConflict(conflict: PortConflict): string {
  const label = conflict.label ? ` (${conflict.label})` : '';
  const procs = conflict.processes.join(', ');
  const pids = conflict.pids.join(', ');
  return `Port ${conflict.port}${label}: conflict between [${procs}] — PIDs: ${pids}`;
}
