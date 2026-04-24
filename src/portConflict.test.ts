import { detectConflicts, hasConflicts, formatConflict } from './portConflict';
import { PortMap } from './scanner';

const singleEntry: PortMap = {
  3000: [{ pid: 101, process: 'node', port: 3000, proto: 'TCP' }],
};

const conflictMap: PortMap = {
  8080: [
    { pid: 201, process: 'nginx', port: 8080, proto: 'TCP' },
    { pid: 202, process: 'caddy', port: 8080, proto: 'TCP' },
  ],
  3000: [{ pid: 101, process: 'node', port: 3000, proto: 'TCP' }],
};

const samePidMap: PortMap = {
  9000: [
    { pid: 300, process: 'app', port: 9000, proto: 'TCP' },
    { pid: 300, process: 'app', port: 9000, proto: 'TCP' },
  ],
};

describe('detectConflicts', () => {
  it('returns empty array when no conflicts', () => {
    expect(detectConflicts(singleEntry)).toEqual([]);
  });

  it('detects a conflict between two different PIDs on same port', () => {
    const result = detectConflicts(conflictMap);
    expect(result).toHaveLength(1);
    expect(result[0].port).toBe(8080);
    expect(result[0].pids).toContain(201);
    expect(result[0].pids).toContain(202);
  });

  it('does not flag same PID appearing twice', () => {
    expect(detectConflicts(samePidMap)).toEqual([]);
  });

  it('includes process names in conflict', () => {
    const result = detectConflicts(conflictMap);
    expect(result[0].processes).toContain('nginx');
    expect(result[0].processes).toContain('caddy');
  });

  it('sorts conflicts by port number', () => {
    const multi: PortMap = {
      9090: [
        { pid: 1, process: 'a', port: 9090, proto: 'TCP' },
        { pid: 2, process: 'b', port: 9090, proto: 'TCP' },
      ],
      8080: [
        { pid: 3, process: 'c', port: 8080, proto: 'TCP' },
        { pid: 4, process: 'd', port: 8080, proto: 'TCP' },
      ],
    };
    const result = detectConflicts(multi);
    expect(result[0].port).toBe(8080);
    expect(result[1].port).toBe(9090);
  });
});

describe('hasConflicts', () => {
  it('returns false when no conflicts', () => {
    expect(hasConflicts(singleEntry)).toBe(false);
  });

  it('returns true when conflicts exist', () => {
    expect(hasConflicts(conflictMap)).toBe(true);
  });
});

describe('formatConflict', () => {
  it('formats a conflict with label', () => {
    const conflict = { port: 80, pids: [1, 2], processes: ['nginx', 'apache'], label: 'HTTP' };
    const out = formatConflict(conflict);
    expect(out).toContain('Port 80');
    expect(out).toContain('HTTP');
    expect(out).toContain('nginx');
    expect(out).toContain('apache');
  });

  it('formats a conflict without label', () => {
    const conflict = { port: 54321, pids: [10, 20], processes: ['foo', 'bar'], label: null };
    const out = formatConflict(conflict);
    expect(out).not.toContain('(');
    expect(out).toContain('54321');
  });
});
