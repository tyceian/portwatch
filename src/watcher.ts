import { scanPorts, getActivePorts, PortInfo } from './scanner';

export type PortEvent = {
  type: 'open' | 'close';
  port: number;
  info?: PortInfo;
};

export type WatcherOptions = {
  interval?: number;
  onEvent: (event: PortEvent) => void;
};

export function startWatcher(options: WatcherOptions): () => void {
  const { interval = 1500, onEvent } = options;

  let previousPorts = getActivePorts();
  let previousInfoMap = new Map<number, PortInfo>(
    scanPorts().map((p) => [p.port, p])
  );

  const timer = setInterval(() => {
    const currentInfoList = scanPorts();
    const currentPorts = new Set(currentInfoList.map((p) => p.port));
    const currentInfoMap = new Map<number, PortInfo>(
      currentInfoList.map((p) => [p.port, p])
    );

    for (const port of currentPorts) {
      if (!previousPorts.has(port)) {
        onEvent({ type: 'open', port, info: currentInfoMap.get(port) });
      }
    }

    for (const port of previousPorts) {
      if (!currentPorts.has(port)) {
        onEvent({ type: 'close', port, info: previousInfoMap.get(port) });
      }
    }

    previousPorts = currentPorts;
    previousInfoMap = currentInfoMap;
  }, interval);

  return () => clearInterval(timer);
}
