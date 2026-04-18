import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface PortwatchConfig {
  interval: number;
  ignorePorts: number[];
  alertOnNew: boolean;
  alertOnClose: boolean;
  notifySound: boolean;
  watchPorts: number[];
}

const DEFAULT_CONFIG: PortwatchConfig = {
  interval: 2000,
  ignorePorts: [],
  alertOnNew: true,
  alertOnClose: true,
  notifySound: false,
  watchPorts: [],
};

const CONFIG_PATHS = [
  path.join(process.cwd(), '.portwatchrc.json'),
  path.join(os.homedir(), '.portwatchrc.json'),
];

export function loadConfig(overridePath?: string): PortwatchConfig {
  const searchPaths = overridePath ? [overridePath] : CONFIG_PATHS;

  for (const configPath of searchPaths) {
    if (fs.existsSync(configPath)) {
      try {
        const raw = fs.readFileSync(configPath, 'utf-8');
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_CONFIG, ...parsed };
      } catch (err) {
        console.warn(`[portwatch] Failed to parse config at ${configPath}:`, err);
      }
    }
  }

  return { ...DEFAULT_CONFIG };
}

export function validateConfig(config: PortwatchConfig): string[] {
  const errors: string[] = [];

  if (config.interval < 500) {
    errors.push('interval must be at least 500ms');
  }

  if (!Array.isArray(config.ignorePorts)) {
    errors.push('ignorePorts must be an array');
  }

  if (!Array.isArray(config.watchPorts)) {
    errors.push('watchPorts must be an array');
  }

  return errors;
}
