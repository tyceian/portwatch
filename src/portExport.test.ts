import { buildExport, exportToJson, exportToCsv, importFromJson } from './portExport';
import { PortEvent } from './history';

const makeEvent = (port: number, type: 'open' | 'close', ts = Date.now()): PortEvent => ({
  port,
  type,
  timestamp: ts,
  pid: 1234,
  processName: 'node',
});

const base = buildExport(
  [makeEvent(3000, 'open'), makeEvent(3000, 'close')],
  {},
  {},
  [],
  [],
  { 3000: ['web'] },
  { 3000: 'dev server' }
);

describe('buildExport', () => {
  it('includes version and exportedAt', () => {
    expect(base.version).toBe('1.0');
    expect(base.exportedAt).toBeTruthy();
  });

  it('captures history', () => {
    expect(base.history).toHaveLength(2);
  });

  it('captures tags and notes', () => {
    expect(base.tags[3000]).toEqual(['web']);
    expect(base.notes[3000]).toBe('dev server');
  });
});

describe('exportToJson', () => {
  it('produces valid JSON', () => {
    const json = exportToJson(base);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('round-trips via importFromJson', () => {
    const json = exportToJson(base);
    const imported = importFromJson(json);
    expect(imported.version).toBe('1.0');
    expect(imported.history).toHaveLength(2);
  });
});

describe('exportToCsv', () => {
  it('has header row', () => {
    const csv = exportToCsv(base.history);
    expect(csv.startsWith('timestamp,port,type,pid,process')).toBe(true);
  });

  it('has one row per event', () => {
    const csv = exportToCsv(base.history);
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(3); // header + 2 events
  });
});

describe('importFromJson', () => {
  it('throws on invalid format', () => {
    expect(() => importFromJson('{"foo":1}')).toThrow('Invalid export format');
  });
});
