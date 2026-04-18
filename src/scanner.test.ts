import { describe, it, expect, vi, beforeEach } from 'vitest';
import { execSync } from 'child_process';
import { scanPorts, getActivePorts } from './scanner';

vi.mock('child_process');

const MOCK_LSOF_OUTPUT = `COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node     1234 dev    22u  IPv4  12345      0t0  TCP *:3000 (LISTEN)
python   5678 dev    10u  IPv4  67890      0t0  TCP *:8080 (LISTEN)
`;

describe('scanPorts', () => {
  beforeEach(() => {
    vi.mocked(execSync).mockReturnValue(MOCK_LSOF_OUTPUT);
  });

  it('returns parsed port info from lsof output', () => {
    const ports = scanPorts();
    expect(ports).toHaveLength(2);
  });

  it('correctly parses port number and pid', () => {
    const ports = scanPorts();
    expect(ports[0].port).toBe(3000);
    expect(ports[0].pid).toBe(1234);
    expect(ports[0].process).toBe('node');
  });

  it('returns empty array when execSync throws', () => {
    vi.mocked(execSync).mockImplementation(() => { throw new Error('not found'); });
    const ports = scanPorts();
    expect(ports).toEqual([]);
  });
});

describe('getActivePorts', () => {
  it('returns a set of port numbers', () => {
    vi.mocked(execSync).mockReturnValue(MOCK_LSOF_OUTPUT);
    const active = getActivePorts();
    expect(active.has(3000)).toBe(true);
    expect(active.has(8080)).toBe(true);
  });
});
