import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  createPortEvent,
  appendEvent,
  filterByPort,
  filterByType,
  loadHistory,
  saveHistory,
  HistoryStore,
} from './history';

describe('createPortEvent', () => {
  it('creates an event with correct fields', () => {
    const event = createPortEvent('open', 3000, 1234, 'node');
    expect(event.type).toBe('open');
    expect(event.port).toBe(3000);
    expect(event.pid).toBe(1234);
    expect(event.process).toBe('node');
    expect(typeof event.timestamp).toBe('number');
  });
});

describe('appendEvent', () => {
  it('appends an event to the store', () => {
    const store: HistoryStore = { events: [] };
    const event = createPortEvent('open', 8080);
    const updated = appendEvent(store, event);
    expect(updated.events).toHaveLength(1);
    expect(updated.events[0].port).toBe(8080);
  });

  it('trims old events when exceeding maxEvents', () => {
    let store: HistoryStore = { events: [] };
    for (let i = 0; i < 5; i++) {
      store = appendEvent(store, createPortEvent('open', i), 3);
    }
    expect(store.events).toHaveLength(3);
    expect(store.events[0].port).toBe(2);
  });
});

describe('filterByPort', () => {
  it('returns only events for the given port', () => {
    const store: HistoryStore = {
      events: [createPortEvent('open', 3000), createPortEvent('open', 4000)],
    };
    expect(filterByPort(store, 3000)).toHaveLength(1);
  });
});

describe('filterByType', () => {
  it('returns only events of the given type', () => {
    const store: HistoryStore = {
      events: [createPortEvent('open', 3000), createPortEvent('close', 3000)],
    };
    expect(filterByType(store, 'close')).toHaveLength(1);
  });
});

describe('loadHistory / saveHistory', () => {
  it('round-trips history to disk', () => {
    const tmpFile = path.join(os.tmpdir(), 'portwatch-test-history.json');
    const store: HistoryStore = { events: [createPortEvent('open', 5000, 99, 'test')] };
    saveHistory(tmpFile, store);
    const loaded = loadHistory(tmpFile);
    expect(loaded.events).toHaveLength(1);
    expect(loaded.events[0].port).toBe(5000);
    fs.unlinkSync(tmpFile);
  });

  it('returns empty store if file missing', () => {
    const loaded = loadHistory('/nonexistent/path/history.json');
    expect(loaded.events).toEqual([]);
  });
});
