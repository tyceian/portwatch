import * as fs from 'fs';
import * as path from 'path';

export interface PortEvent {
  timestamp: number;
  type: 'open' | 'close';
  port: number;
  pid?: number;
  process?: string;
}

export interface HistoryStore {
  events: PortEvent[];
}

const DEFAULT_MAX_EVENTS = 500;

export function createPortEvent(
  type: 'open' | 'close',
  port: number,
  pid?: number,
  process?: string
): PortEvent {
  return { timestamp: Date.now(), type, port, pid, process };
}

export function appendEvent(store: HistoryStore, event: PortEvent, maxEvents = DEFAULT_MAX_EVENTS): HistoryStore {
  const events = [...store.events, event];
  if (events.length > maxEvents) {
    events.splice(0, events.length - maxEvents);
  }
  return { events };
}

export function filterByPort(store: HistoryStore, port: number): PortEvent[] {
  return store.events.filter(e => e.port === port);
}

export function filterByType(store: HistoryStore, type: 'open' | 'close'): PortEvent[] {
  return store.events.filter(e => e.type === type);
}

export function loadHistory(filePath: string): HistoryStore {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as HistoryStore;
  } catch {
    return { events: [] };
  }
}

export function saveHistory(filePath: string, store: HistoryStore): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf-8');
}
