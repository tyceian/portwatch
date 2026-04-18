import * as path from 'path';
import * as os from 'os';
import { PortMap } from './scanner';
import { Snapshot, createSnapshot, saveSnapshot, loadSnapshot, diffSnapshots } from './snapshot';

const DEFAULT_SNAPSHOT_PATH = path.join(os.homedir(), '.portwatch', 'snapshot.json');

export interface SnapshotManagerOptions {
  snapshotPath?: string;
}

export class SnapshotManager {
  private snapshotPath: string;
  private current: Snapshot | null = null;

  constructor(options: SnapshotManagerOptions = {}) {
    this.snapshotPath = options.snapshotPath ?? DEFAULT_SNAPSHOT_PATH;
  }

  load(): Snapshot | null {
    this.current = loadSnapshot(this.snapshotPath);
    return this.current;
  }

  update(ports: PortMap): { opened: number[]; closed: number[] } {
    const next = createSnapshot(ports);
    const diff = diffSnapshots(this.current, next);
    saveSnapshot(next, this.snapshotPath);
    this.current = next;
    return diff;
  }

  getCurrent(): Snapshot | null {
    return this.current;
  }

  getSnapshotPath(): string {
    return this.snapshotPath;
  }
}
