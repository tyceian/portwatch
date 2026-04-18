import { createSnapshot, diffSnapshots, saveSnapshot, loadSnapshot } from './snapshot';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const samplePorts = {
  3000: { pid: 1234, process: 'node', protocol: 'TCP' },
  8080: { pid: 5678, process: 'python', protocol: 'TCP' },
};

describe('createSnapshot', () => {
  it('should include a timestamp and ports', () => {
    const snap = createSnapshot(samplePorts);
    expect(snap.ports).toEqual(samplePorts);
    expect(typeof snap.timestamp).toBe('number');
  });
});

describe('diffSnapshots', () => {
  it('should return all ports as opened when prev is null', () => {
    const curr = createSnapshot(samplePorts);
    const diff = diffSnapshots(null, curr);
    expect(diff.opened).toEqual(expect.arrayContaining([3000, 8080]));
    expect(diff.closed).toHaveLength(0);
  });

  it('should detect newly opened ports', () => {
    const prev = createSnapshot({ 3000: samplePorts[3000] });
    const curr = createSnapshot(samplePorts);
    const diff = diffSnapshots(prev, curr);
    expect(diff.opened).toContain(8080);
    expect(diff.closed).toHaveLength(0);
  });

  it('should detect closed ports', () => {
    const prev = createSnapshot(samplePorts);
    const curr = createSnapshot({ 3000: samplePorts[3000] });
    const diff = diffSnapshots(prev, curr);
    expect(diff.closed).toContain(8080);
    expect(diff.opened).toHaveLength(0);
  });
});

describe('saveSnapshot / loadSnapshot', () => {
  it('should persist and reload a snapshot', () => {
    const filePath = path.join(os.tmpdir(), 'portwatch-test-snapshot.json');
    const snap = createSnapshot(samplePorts);
    saveSnapshot(snap, filePath);
    const loaded = loadSnapshot(filePath);
    expect(loaded).not.toBeNull();
    expect(loaded?.ports).toEqual(samplePorts);
    fs.unlinkSync(filePath);
  });

  it('should return null for missing file', () => {
    expect(loadSnapshot('/tmp/portwatch-nonexistent.json')).toBeNull();
  });
});
