import { renderSilenceList, renderSilenceTable, formatSilenceRow } from './portSilenceFormatter';
import { SilenceRule } from './portSilence';

const permanent: SilenceRule = { port: 3000, until: 0, reason: 'noisy' };
const timed: SilenceRule = { port: 8080, until: Date.now() + 120_000 };
const expired: SilenceRule = { port: 9000, until: Date.now() - 1 };

describe('formatSilenceRow', () => {
  it('includes the port number', () => {
    expect(formatSilenceRow(permanent)).toContain('3000');
  });

  it('shows permanent for until=0', () => {
    expect(formatSilenceRow(permanent)).toContain('permanent');
  });

  it('shows remaining time for timed rule', () => {
    const row = formatSilenceRow(timed);
    expect(row).toMatch(/\d+m/);
  });

  it('includes reason when provided', () => {
    expect(formatSilenceRow(permanent)).toContain('noisy');
  });

  it('omits reason when not provided', () => {
    expect(formatSilenceRow(timed)).not.toContain('—');
  });
});

describe('renderSilenceList', () => {
  it('returns empty message for no rules', () => {
    expect(renderSilenceList([])).toContain('No ports');
  });

  it('includes header with count', () => {
    expect(renderSilenceList([permanent, timed])).toContain('2');
  });

  it('renders each rule as a row', () => {
    const output = renderSilenceList([permanent]);
    expect(output).toContain('3000');
  });
});

describe('renderSilenceTable', () => {
  it('returns empty message for no rules', () => {
    expect(renderSilenceTable([])).toContain('No silenced ports');
  });

  it('includes column headers', () => {
    const output = renderSilenceTable([permanent]);
    expect(output).toContain('PORT');
    expect(output).toContain('EXPIRES');
  });

  it('shows expired label for past timestamp', () => {
    const output = renderSilenceTable([expired]);
    expect(output).toContain('expired');
  });
});
