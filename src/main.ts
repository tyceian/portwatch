#!/usr/bin/env node

/**
 * portwatch — main entry point
 * Wires together CLI parsing, config loading, scanning, and watching.
 */

import { parseArgs, printHelp } from './cli';
import { loadConfig, validateConfig } from './config';
import { startWatcher } from './watcher';
import { getActivePorts } from './scanner';
import { loadHistory } from './history';
import { renderAlert } from './formatter';
import { printSnapshotStatus, printDiff } from './snapshotCli';
import { createSnapshot, loadSnapshot, diffSnapshots } from './snapshot';
import { renderStatsTable, renderTopPorts } from './portStatsFormatter';
import { computeStats, getTopPorts } from './portStats';
import { renderLabelTable } from './portLabelFormatter';
import { getKnownPorts } from './portLabel';

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  // Load and validate config (merges file config with CLI flags)
  const rawConfig = loadConfig(args.config);
  const config = validateConfig({ ...rawConfig, ...args });

  // Sub-commands
  switch (args.command) {
    case 'snapshot': {
      const ports = await getActivePorts();
      const snap = createSnapshot(ports);
      if (args.compare) {
        const previous = loadSnapshot(args.compare);
        const diff = diffSnapshots(previous, snap);
        printDiff(diff);
      } else {
        printSnapshotStatus(snap);
      }
      process.exit(0);
    }

    case 'history': {
      const events = loadHistory(config.historyFile);
      if (events.length === 0) {
        console.log('No history recorded yet.');
      } else {
        for (const ev of events) {
          console.log(renderAlert(ev as any, config));
        }
      }
      process.exit(0);
    }

    case 'stats': {
      const events = loadHistory(config.historyFile);
      const stats = computeStats(events);
      const top = getTopPorts(stats, 10);
      console.log(renderStatsTable(stats));
      console.log(renderTopPorts(top));
      process.exit(0);
    }

    case 'labels': {
      const known = getKnownPorts();
      console.log(renderLabelTable(known));
      process.exit(0);
    }

    case 'watch':
    default: {
      // Default behaviour: start the watcher loop
      console.log(`portwatch starting (interval: ${config.interval}ms)…`);
      await startWatcher(config);
      break;
    }
  }
}

main().catch((err) => {
  console.error('portwatch error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
