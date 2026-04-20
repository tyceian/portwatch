import { throttle, cancelThrottle, clearAllThrottles, getThrottleCount } from './throttle';

describe('throttle', () => {
  beforeEach(() => {
    clearAllThrottles();
    jest.useFakeTimers();
  });

  afterEach(() => {
    clearAllThrottles();
    jest.useRealTimers();
  });

  it('calls function immediately on first invocation', () => {
    const fn = jest.fn();
    throttle('test-key', fn, 500, ['arg1']);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('arg1');
  });

  it('does not call function again within interval', () => {
    const fn = jest.fn();
    throttle('test-key', fn, 500);
    throttle('test-key', fn, 500);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('schedules a trailing call when throttled', () => {
    const fn = jest.fn();
    throttle('test-key', fn, 500, ['first']);
    throttle('test-key', fn, 500, ['second']);
    expect(fn).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(600);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('second');
  });

  it('uses separate throttle state per key', () => {
    const fn = jest.fn();
    throttle('key-a', fn, 500);
    throttle('key-b', fn, 500);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('cancelThrottle removes pending timer', () => {
    const fn = jest.fn();
    throttle('cancel-key', fn, 500);
    throttle('cancel-key', fn, 500);
    cancelThrottle('cancel-key');
    jest.advanceTimersByTime(600);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('getThrottleCount reflects active throttles', () => {
    const fn = jest.fn();
    throttle('k1', fn, 500);
    throttle('k2', fn, 500);
    expect(getThrottleCount()).toBe(2);
    clearAllThrottles();
    expect(getThrottleCount()).toBe(0);
  });

  it('clearAllThrottles cancels all pending timers', () => {
    const fn = jest.fn();
    throttle('x', fn, 500);
    throttle('x', fn, 500, ['trailing']);
    clearAllThrottles();
    jest.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
