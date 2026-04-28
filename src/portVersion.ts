/**
 * portVersion.ts
 * Track version/revision metadata for ports (e.g. which app version is running on a port).
 * Useful for detecting when a service restarts with a new build.
 */

export interface PortVersionRule {
  port: number;
  version: string;
  label?: string;
  recordedAt: number; // epoch ms
  previousVersion?: string;
}

const versionMap = new Map<number, PortVersionRule>();

/** Set or update the version for a port */
export function setVersion(
  port: number,
  version: string,
  label?: string
): PortVersionRule {
  const existing = versionMap.get(port);
  const rule: PortVersionRule = {
    port,
    version,
    label,
    recordedAt: Date.now(),
    previousVersion: existing?.version,
  };
  versionMap.set(port, rule);
  return rule;
}

/** Remove version tracking for a port */
export function removeVersion(port: number): boolean {
  return versionMap.delete(port);
}

/** Get the current version rule for a port, or undefined */
export function getVersion(port: number): PortVersionRule | undefined {
  return versionMap.get(port);
}

/** Check whether a port has a version recorded */
export function hasVersion(port: number): boolean {
  return versionMap.has(port);
}

/** List all version rules */
export function listVersions(): PortVersionRule[] {
  return Array.from(versionMap.values()).sort((a, b) => a.port - b.port);
}

/** Detect whether the version for a port has changed since last recorded */
export function hasVersionChanged(port: number, currentVersion: string): boolean {
  const rule = versionMap.get(port);
  if (!rule) return false;
  return rule.version !== currentVersion;
}

/** Clear all version records */
export function clearVersions(): void {
  versionMap.clear();
}

/** Bump the version for a port, recording the old one as previousVersion */
export function bumpVersion(
  port: number,
  newVersion: string,
  label?: string
): PortVersionRule {
  return setVersion(port, newVersion, label);
}

/** Get ports where a version change was detected (previousVersion differs from version) */
export function getChangedPorts(): PortVersionRule[] {
  return listVersions().filter(
    (r) => r.previousVersion !== undefined && r.previousVersion !== r.version
  );
}
