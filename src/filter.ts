export interface FilterOptions {
  ports?: number[];
  excludePorts?: number[];
  minPort?: number;
  maxPort?: number;
  processes?: string[];
}

export function matchesFilter(port: number, process: string, opts: FilterOptions): boolean {
  if (opts.ports && opts.ports.length > 0) {
    if (!opts.ports.includes(port)) return false;
  }

  if (opts.excludePorts && opts.excludePorts.length > 0) {
    if (opts.excludePorts.includes(port)) return false;
  }

  if (opts.minPort !== undefined && port < opts.minPort) return false;
  if (opts.maxPort !== undefined && port > opts.maxPort) return false;

  if (opts.processes && opts.processes.length > 0) {
    const matched = opts.processes.some((p) =>
      process.toLowerCase().includes(p.toLowerCase())
    );
    if (!matched) return false;
  }

  return true;
}

export function applyFilter(
  portMap: Map<number, string>,
  opts: FilterOptions
): Map<number, string> {
  const result = new Map<number, string>();
  for (const [port, process] of portMap.entries()) {
    if (matchesFilter(port, process, opts)) {
      result.set(port, process);
    }
  }
  return result;
}
