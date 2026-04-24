import { formatPortAlert, renderPortAlertList, renderPortAlertTable } from './portAlertFormatter';
import { PortAlertResult } from './portAlert';

const makeAlert = (overrides: Partial<PortAlertResult> = {}): PortAlertResult => ({
  port: 3000,
  rule: 'high-churn',
  severity: 'warning',
  message: 'Port 3000 has unusually high open/close churn',
  triggeredAt: 1700000000000,
  ...overrides,
});

describe('formatPortAlert', () => {
  it('includes severity label', () => {
    const out = formatPortAlert(makeAlert());
    expect(out).toContain('WARNING');
  });

  it('includes the alert message', () => {
    const out = formatPortAlert(makeAlert({ message: 'Test message 9999' }));
    expect(out).toContain('Test message 9999');
  });

  it('includes rule name', () => {
    const out = formatPortAlert(makeAlert({ rule: 'my-rule' }));
    expect(out).toContain('my-rule');
  });
});

describe('renderPortAlertList', () => {
  it('returns no-alert message for empty list', () => {
    const out = renderPortAlertList([]);
    expect(out).toContain('No alerts triggered');
  });

  it('renders one line per alert', () => {
    const alerts = [makeAlert(), makeAlert({ port: 8080, severity: 'critical' })];
    const out = renderPortAlertList(alerts);
    const lines = out.split('\n').filter(Boolean);
    expect(lines).toHaveLength(2);
  });
});

describe('renderPortAlertTable', () => {
  it('returns no-alert message for empty list', () => {
    const out = renderPortAlertTable([]);
    expect(out).toContain('No alerts triggered');
  });

  it('includes header columns', () => {
    const out = renderPortAlertTable([makeAlert()]);
    expect(out).toContain('PORT');
    expect(out).toContain('SEVERITY');
    expect(out).toContain('RULE');
  });

  it('includes alert data row', () => {
    const out = renderPortAlertTable([makeAlert({ port: 4321 })]);
    expect(out).toContain('4321');
    expect(out).toContain('high-churn');
  });
});
