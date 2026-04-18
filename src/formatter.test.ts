import { renderAlert, formatAlertText, formatAlertJson, FormatOptions } from './formatter';
import { Alert } from './alerts';

const baseAlert: Alert = {
  type: 'open',
  port: 3000,
  process: 'node',
  pid: 1234,
  timestamp: new Date('2024-01-15T10:30:00.000Z'),
};

const textOpts: FormatOptions = { format: 'text', color: false, timestamp: false };

describe('formatAlertText', () => {
  it('includes port and process name', () => {
    const result = formatAlertText(baseAlert, textOpts);
    expect(result).toContain('3000');
    expect(result).toContain('node');
    expect(result).toContain('1234');
  });

  it('shows OPEN for open alerts', () => {
    const result = formatAlertText(baseAlert, textOpts);
    expect(result).toContain('OPEN');
  });

  it('shows CLOSE for close alerts', () => {
    const result = formatAlertText({ ...baseAlert, type: 'close' }, textOpts);
    expect(result).toContain('CLOSE');
  });

  it('includes timestamp when enabled', () => {
    const result = formatAlertText(baseAlert, { ...textOpts, timestamp: true });
    expect(result).toContain('2024-01-15');
  });

  it('compact format omits process info', () => {
    const result = formatAlertText(baseAlert, { ...textOpts, format: 'compact' });
    expect(result).not.toContain('node');
    expect(result).toContain('3000');
  });

  it('handles missing process gracefully', () => {
    const alert = { ...baseAlert, process: undefined, pid: undefined };
    const result = formatAlertText(alert, textOpts);
    expect(result).toContain('unknown');
  });
});

describe('formatAlertJson', () => {
  it('returns valid JSON', () => {
    const result = formatAlertJson(baseAlert);
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('includes all fields', () => {
    const parsed = JSON.parse(formatAlertJson(baseAlert));
    expect(parsed.port).toBe(3000);
    expect(parsed.process).toBe('node');
    expect(parsed.type).toBe('open');
  });
});

describe('renderAlert', () => {
  it('delegates to json formatter when format is json', () => {
    const result = renderAlert(baseAlert, { format: 'json', color: false, timestamp: false });
    expect(() => JSON.parse(result)).not.toThrow();
  });
});
