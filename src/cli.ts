#!/usr/bin/env node
import { loadConfig, validateConfig } from './config';
import { startWatcher } from './watcher';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
portwatch — monitor local port activity

Usage:
  portwatch [options]

Options:
  --config <path>   Path to config file
  --interval <ms>   Poll interval in milliseconds (default: 2000)
  --help            Show this help message
`);
}

function parseArgs(argv: string[]): { configPath?: string; interval?: number; help: boolean } {
  const result: { configPath?: string; interval?: number; help: boolean } = { help: false };

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--help' || argv[i] === '-h') {
      result.help = true;
    } else if (argv[i] === '--config' && argv[i + 1]) {
      result.configPath = argv[++i];
    } else if (argv[i] === '--interval' && argv[i + 1]) {
      result.interval = parseInt(argv[++i], 10);
    }
  }

  return result;
}

async function main() {
  const parsed = parseArgs(args);

  if (parsed.help) {
    printHelp();
    process.exit(0);
  }

  const config = loadConfig(parsed.configPath);

  if (parsed.interval) {
    config.interval = parsed.interval;
  }

  const errors = validateConfig(config);
  if (errors.length > 0) {
    console.error('[portwatch] Invalid config:');
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log(`[portwatch] Starting with interval=${config.interval}ms`);
  startWatcher(config.interval);
}

main().catch(err => {
  console.error('[portwatch] Fatal error:', err);
  process.exit(1);
});
