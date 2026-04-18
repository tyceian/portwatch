import { SnapshotManager } from './snapshotManager';
import { colorize } from './formatter';

export function printSnapshotStatus(manager: SnapshotManager): void {
  const snap = manager.getCurrent();
  if (!snap) {
    console.log(colorize('yellow', 'No snapshot loaded.'));
    return;
  }
  const portCount = Object.keys(snap.ports).length;
  const ts = new Date(snap.timestamp).toLocaleString();
  console.log(colorize('cyan', `Snapshot taken at: ${ts}`));
  console.log(colorize('cyan', `Active ports: ${portCount}`));
  for (const [port, info] of Object.entries(snap.ports)) {
    console.log(`  ${colorize('green', port)} — ${info.process} (PID ${info.pid})`);
  }
}

export function printDiff(diff: { opened: number[]; closed: number[] }): void {
  if (diff.opened.length === 0 && diff.closed.length === 0) {
    console.log(colorize('cyan', 'No port changes detected.'));
    return;
  }
  for (const port of diff.opened) {
    console.log(colorize('green', `[OPENED] :${port}`));
  }
  for (const port of diff.closed) {
    console.log(colorize('red', `[CLOSED] :${port}`));
  }
}
