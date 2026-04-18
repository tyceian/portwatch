import { getCachedProcess, invalidateCache, getCacheSize } from './processCache';
import * as processModule from './process';

jest.mock('./process');
const mockGet = processModule.getProcessForPort as jest.MockedFunction<typeof processModule.getProcessForPort>;

const fakeInfo = { pid: 99, name: 'ruby', port: 4567, protocol: 'TCP' };

beforeEach(() => {
  invalidateCache();
  jest.clearAllMocks();
});

describe('getCachedProcess', () => {
  it('fetches and caches process info', () => {
    mockGet.mockReturnValue(fakeInfo);
    const result = getCachedProcess(4567);
    expect(result).toEqual(fakeInfo);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it('returns cached value on second call', () => {
    mockGet.mockReturnValue(fakeInfo);
    getCachedProcess(4567);
    getCachedProcess(4567);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it('returns null and removes entry when process gone', () => {
    mockGet.mockReturnValue(null);
    const result = getCachedProcess(4567);
    expect(result).toBeNull();
    expect(getCacheSize()).toBe(0);
  });
});

describe('invalidateCache', () => {
  it('clears a single port', () => {
    mockGet.mockReturnValue(fakeInfo);
    getCachedProcess(4567);
    invalidateCache(4567);
    expect(getCacheSize()).toBe(0);
  });

  it('clears all entries', () => {
    mockGet.mockReturnValue(fakeInfo);
    getCachedProcess(4567);
    getCachedProcess(4567);
    invalidateCache();
    expect(getCacheSize()).toBe(0);
  });
});
