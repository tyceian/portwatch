import {
  handleSetLifecycle,
  handleRemoveLifecycle,
  handleGetLifecycle,
  handleListLifecycles,
  handleLifecycleSummary,
} from './portLifecycleManager';
import { clearLifecycles } from './portLifecycle';

beforeEach(() => {
  clearLifecycles();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('handleSetLifecycle', () => {
  it('sets a valid phase and logs confirmation', () => {
    handleSetLifecycle(3000, 'development', 'my dev server');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('3000'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('DEVELOPMENT'));
  });

  it('rejects an invalid phase', () => {
    handleSetLifecycle(3000, 'unknown');
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Invalid phase'));
  });
});

describe('handleRemoveLifecycle', () => {
  it('removes an existing lifecycle', () => {
    handleSetLifecycle(3000, 'staging');
    handleRemoveLifecycle(3000);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('removed'));
  });

  it('warns when no lifecycle is set', () => {
    handleRemoveLifecycle(9999);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('no lifecycle'));
  });
});

describe('handleGetLifecycle', () => {
  it('prints lifecycle info for a known port', () => {
    handleSetLifecycle(4000, 'production');
    handleGetLifecycle(4000);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('PRODUCTION'));
  });

  it('prints not-set message for unknown port', () => {
    handleGetLifecycle(1234);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('no lifecycle'));
  });
});

describe('handleListLifecycles', () => {
  it('renders table with entries', () => {
    handleSetLifecycle(3000, 'development');
    handleSetLifecycle(8080, 'production');
    handleListLifecycles();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('3000'));
  });

  it('renders empty message when none set', () => {
    handleListLifecycles();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No lifecycle'));
  });
});

describe('handleLifecycleSummary', () => {
  it('renders summary with phase counts', () => {
    handleSetLifecycle(3000, 'development');
    handleSetLifecycle(3001, 'development');
    handleLifecycleSummary();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('×2'));
  });
});
