// Well-known port labels for common services
const KNOWN_PORTS: Record<number, string> = {
  21: 'FTP',
  22: 'SSH',
  23: 'Telnet',
  25: 'SMTP',
  53: 'DNS',
  80: 'HTTP',
  443: 'HTTPS',
  3000: 'Dev Server',
  3001: 'Dev Server (alt)',
  3306: 'MySQL',
  4200: 'Angular CLI',
  5000: 'Flask / Dev',
  5173: 'Vite',
  5432: 'PostgreSQL',
  5672: 'RabbitMQ',
  6379: 'Redis',
  8000: 'HTTP Alt',
  8080: 'HTTP Proxy',
  8443: 'HTTPS Alt',
  8888: 'Jupyter',
  9000: 'PHP-FPM / Dev',
  9200: 'Elasticsearch',
  27017: 'MongoDB',
};

export type PortLabel = {
  port: number;
  label: string;
  isKnown: boolean;
};

export function getLabelForPort(port: number): PortLabel {
  const label = KNOWN_PORTS[port];
  if (label) {
    return { port, label, isKnown: true };
  }
  return { port, label: `Port ${port}`, isKnown: false };
}

export function getKnownPorts(): number[] {
  return Object.keys(KNOWN_PORTS).map(Number);
}

export function isWellKnownPort(port: number): boolean {
  return port in KNOWN_PORTS;
}

export function addCustomLabel(port: number, label: string): void {
  if (port < 1 || port > 65535) {
    throw new Error(`Invalid port number: ${port}`);
  }
  KNOWN_PORTS[port] = label;
}

export function formatPortWithLabel(port: number): string {
  const { label, isKnown } = getLabelForPort(port);
  return isKnown ? `${port} (${label})` : `${port}`;
}
