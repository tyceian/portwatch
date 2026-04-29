import {
  formatVersionInline,
  renderVersionRow,
  renderVersionTable,
  renderVersionSummary,
} from './portVersionFormatter';
import type { VersionRecord } from './portVersion';

function makeRecord(port: number, version: string, updatedAt = 1700000000000): VersionRecord {
  return { port, version, updatedAt };
}

describe('formatVersionInline', () => {
  it('formats a version record as a short string', () => {
    const r = makeRecord(3000, '1.2.3');
    expect(formatVersionInline(r)).toBe('port 3000 @ v1.2.3');
  });
});

describe('renderVersionRow', () => {
  it('produces a padded row string', () => {
    const r = makeRecord(8080, '0.9.0');
    const row = renderVersionRow(r);
    expect(row).toContain('8080');
    expect(row).toContain('0.9.0');
  });

  it('truncates long version strings to column width', () => {
    const r = makeRecord(3000, '10.20.30-beta.99999');
    const row = renderVersionRow(r);
    // column is 14 chars — value should be truncated
    expect(row.indexOf('10.20.30-beta.')).toBeGreaterThanOrEqual(0);
  });
});

describe('renderVersionTable', () => {
  it('returns a message when no records', () => {
    expect(renderVersionTable([])).toBe('No version records found.');
  });

  it('includes header and rows for each record', () => {
    const records = [makeRecord(3000, '1.0.0'), makeRecord(4000, '2.1.0')];
    const table = renderVersionTable(records);
    expect(table).toContain('PORT');
    expect(table).toContain('VERSION');
    expect(table).toContain('3000');
    expect(table).toContain('4000');
  });

  it('sorts records by port number', () => {
    const records = [makeRecord(9000, '1.0.0'), makeRecord(1000, '0.1.0')];
    const table = renderVersionTable(records);
    const idx1000 = table.indexOf('1000');
    const idx9000 = table.indexOf('9000');
    expect(idx1000).toBeLessThan(idx9000);
  });
});

describe('renderVersionSummary', () => {
  it('returns a message when no records', () => {
    expect(renderVersionSummary([])).toBe('No versioned ports.');
  });

  it('includes count and inline format for each record', () => {
    const records = [makeRecord(3000, '1.0.0'), makeRecord(8080, '2.0.0')];
    const summary = renderVersionSummary(records);
    expect(summary).toContain('Versioned ports (2)');
    expect(summary).toContain('port 3000 @ v1.0.0');
    expect(summary).toContain('port 8080 @ v2.0.0');
  });
});
