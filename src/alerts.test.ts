import { formatAlert, createAlert, shouldAlert, PortAlert } from './alerts';

describe('createAlert', () => {
  it('creates an alert with correct fields', () => {
    const alert = createAlert(3000, 'port opened', 'info', 1234, 'node');
    expect(alert.port).toBe(3000);
    expect(alert.message).toBe('port opened');
    expect(alert.level).toBe('info');
    expect(alert.pid).toBe(1234);
    expect(alert.process).toBe('node');
    expect(alert.timestamp).toBeInstanceOf(Date);
  });

  it('defaults level to info', () => {
    const alert = createAlert(8080, 'test');
    expect(alert.level).toBe('info');
  });
});

describe('shouldAlert', () => {
  it('returns true when no filters set', () => {
    expect(shouldAlert(3000, {})).toBe(true);
  });

  it('returns false for ignored ports', () => {
    expect(shouldAlert(3000, { ignorePorts: [3000, 4000] })).toBe(false);
  });

  it('returns true only for watched ports', () => {
    expect(shouldAlert(3000, { watchPorts: [3000] })).toBe(true);
    expect(shouldAlert(4000, { watchPorts: [3000] })).toBe(false);
  });

  it('ignorePorts takes priority', () => {
    expect(shouldAlert(3000, { watchPorts: [3000], ignorePorts: [3000] })).toBe(false);
  });
});

describe('formatAlert', () => {
  it('returns a non-empty string', () => {
    const alert = createAlert(5000, 'new connection', 'warn', 999, 'python');
    const output = formatAlert(alert);
    expect(typeof output).toBe('string');
    expect(output.length).toBeGreaterThan(0);
    expect(output).toContain('5000');
  });
});
