import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { loadConfig, validateConfig, PortwatchConfig } from './config';

jest.mock('fs');

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('loadConfig', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns default config when no file exists', () => {
    mockedFs.existsSync.mockReturnValue(false);
    const config = loadConfig();
    expect(config.interval).toBe(2000);
    expect(config.alertOnNew).toBe(true);
    expect(config.ignorePorts).toEqual([]);
  });

  it('merges file config with defaults', () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(JSON.stringify({ interval: 3000, notifySound: true }));
    const config = loadConfig('/fake/.portwatchrc.json');
    expect(config.interval).toBe(3000);
    expect(config.notifySound).toBe(true);
    expect(config.alertOnClose).toBe(true);
  });

  it('falls back to defaults on invalid JSON', () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue('not json {{');
    const config = loadConfig('/fake/.portwatchrc.json');
    expect(config.interval).toBe(2000);
  });
});

describe('validateConfig', () => {
  const base: PortwatchConfig = {
    interval: 2000,
    ignorePorts: [],
    alertOnNew: true,
    alertOnClose: true,
    notifySound: false,
    watchPorts: [],
  };

  it('returns no errors for valid config', () => {
    expect(validateConfig(base)).toHaveLength(0);
  });

  it('errors when interval is too low', () => {
    const errors = validateConfig({ ...base, interval: 100 });
    expect(errors).toContain('interval must be at least 500ms');
  });

  it('errors when ignorePorts is not an array', () => {
    const errors = validateConfig({ ...base, ignorePorts: 'bad' as any });
    expect(errors).toContain('ignorePorts must be an array');
  });
});
