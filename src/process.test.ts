import { getProcessForPort, getProcessMap, formatProcessInfo, ProcessInfo } from './process';
import { execSync } from 'child_process';

jest.mock('child_process');
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

const MOCK_LSOF = `COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    1234 dev   23u  IPv4  12345      0t0  TCP *:3000 (LISTEN)`;

describe('getProcessForPort', () => {
  it('returns process info for a listening port', () => {
    mockExecSync.mockReturnValue(MOCK_LSOF as any);
    const info = getProcessForPort(3000);
    expect(info).not.toBeNull();
    expect(info?.pid).toBe(1234);
    expect(info?.name).toBe('node');
    expect(info?.port).toBe(3000);
  });

  it('returns null when lsof throws', () => {
    mockExecSync.mockImplementation(() => { throw new Error('no output'); });
    const info = getProcessForPort(9999);
    expect(info).toBeNull();
  });

  it('returns null for empty output', () => {
    mockExecSync.mockReturnValue('COMMAND PID\n' as any);
    const info = getProcessForPort(8080);
    expect(info).toBeNull();
  });
});

describe('getProcessMap', () => {
  it('builds a map from ports to process info', () => {
    mockExecSync.mockReturnValue(MOCK_LSOF as any);
    const map = getProcessMap([3000]);
    expect(map.size).toBe(1);
    expect(map.get(3000)?.pid).toBe(1234);
  });
});

describe('formatProcessInfo', () => {
  it('formats info string correctly', () => {
    const info: ProcessInfo = { pid: 42, name: 'python', port: 8000, protocol: 'TCP' };
    expect(formatProcessInfo(info)).toBe('python (pid 42) on port 8000/TCP');
  });
});
