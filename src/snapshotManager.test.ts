import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { SnapshotManager } from './snapshotManager';

const tmpPath = path.join(os.tmpdir(), 'portwatch-manager-test.json');

const ports1 = { 3000: { pid: 1, process: 'node', protocol: 'TCP' } };
const ports2 = {
  3000: { pid: 1, process: 'node', protocol: 'TCP' },
  4000: { pid: 2, process: 'ruby', protocol: 'TCP' },
};

afterEach(() => {
  if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
});

describe('SnapshotManager', () => {
  it('should return null before any snapshot exists', () => {
    const mgr = new SnapshotManager({ snapshotPath: tmpPath });
    expect(mgr.load()).toBeNull();
  });

  it('should detect all ports as opened on first update', () => {
    const mgr = new SnapshotManager({ snapshotPath: tmpPath });
    mgr.load();
    const diff = mgr.update(ports1);
    expect(diff.opened).toContain(3000);
    expect(diff.closed).toHaveLength(0);
  });

  it('should detect opened and closed ports across updates', () => {
    const mgr = new SnapshotManager({ snapshotPath: tmpPath });
    mgr.load();
    mgr.update(ports1);
    const diff = mgr.update(ports2);
    expect(diff.opened).toContain(4000);
    expect(diff.closed).toHaveLength(0);
  });

  it('should persist snapshot between manager instances', () => {
    const mgr1 = new SnapshotManager({ snapshotPath: tmpPath });
    mgr1.load();
    mgr1.update(ports1);

    const mgr2 = new SnapshotManager({ snapshotPath: tmpPath });
    const loaded = mgr2.load();
    expect(loaded).not.toBeNull();
    expect(loaded?.ports).toEqual(ports1);
  });
});
