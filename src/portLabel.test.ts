import {
  getLabelForPort,
  getKnownPorts,
  isWellKnownPort,
  addCustomLabel,
  formatPortWithLabel,
} from './portLabel';

describe('getLabelForPort', () => {
  it('returns known label for well-known port', () => {
    const result = getLabelForPort(3306);
    expect(result.label).toBe('MySQL');
    expect(result.isKnown).toBe(true);
    expect(result.port).toBe(3306);
  });

  it('returns generic label for unknown port', () => {
    const result = getLabelForPort(12345);
    expect(result.label).toBe('Port 12345');
    expect(result.isKnown).toBe(false);
  });

  it('handles vite port', () => {
    const result = getLabelForPort(5173);
    expect(result.label).toBe('Vite');
    expect(result.isKnown).toBe(true);
  });
});

describe('getKnownPorts', () => {
  it('returns an array of numbers', () => {
    const ports = getKnownPorts();
    expect(Array.isArray(ports)).toBe(true);
    expect(ports.every((p) => typeof p === 'number')).toBe(true);
  });

  it('includes common ports', () => {
    const ports = getKnownPorts();
    expect(ports).toContain(80);
    expect(ports).toContain(443);
    expect(ports).toContain(5432);
  });
});

describe('isWellKnownPort', () => {
  it('returns true for known ports', () => {
    expect(isWellKnownPort(6379)).toBe(true);
    expect(isWellKnownPort(27017)).toBe(true);
  });

  it('returns false for unknown ports', () => {
    expect(isWellKnownPort(19999)).toBe(false);
  });
});

describe('addCustomLabel', () => {
  it('adds a custom label and retrieves it', () => {
    addCustomLabel(7777, 'My Custom Service');
    const result = getLabelForPort(7777);
    expect(result.label).toBe('My Custom Service');
    expect(result.isKnown).toBe(true);
  });

  it('throws on invalid port number', () => {
    expect(() => addCustomLabel(0, 'Bad')).toThrow();
    expect(() => addCustomLabel(99999, 'Bad')).toThrow();
  });
});

describe('formatPortWithLabel', () => {
  it('formats known port with label', () => {
    expect(formatPortWithLabel(8080)).toBe('8080 (HTTP Proxy)');
  });

  it('formats unknown port without label', () => {
    expect(formatPortWithLabel(11111)).toBe('11111');
  });
});
