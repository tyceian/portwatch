// portEnvironment.ts — associate ports with named environments (dev, staging, prod, etc.)

export type Environment = string;

export interface EnvironmentRule {
  port: number;
  environment: Environment;
  addedAt: number;
}

const rules = new Map<number, EnvironmentRule>();

const KNOWN_ENVIRONMENTS = ['dev', 'development', 'staging', 'test', 'prod', 'production', 'local'];

export function setEnvironment(port: number, environment: Environment): EnvironmentRule {
  const rule: EnvironmentRule = { port, environment: environment.toLowerCase(), addedAt: Date.now() };
  rules.set(port, rule);
  return rule;
}

export function removeEnvironment(port: number): boolean {
  return rules.delete(port);
}

export function getEnvironment(port: number): EnvironmentRule | undefined {
  return rules.get(port);
}

export function hasEnvironment(port: number): boolean {
  return rules.has(port);
}

export function listEnvironments(): EnvironmentRule[] {
  return Array.from(rules.values()).sort((a, b) => a.port - b.port);
}

export function getPortsForEnvironment(env: Environment): EnvironmentRule[] {
  const target = env.toLowerCase();
  return Array.from(rules.values()).filter(r => r.environment === target);
}

export function clearEnvironments(): void {
  rules.clear();
}

export function isKnownEnvironment(env: Environment): boolean {
  return KNOWN_ENVIRONMENTS.includes(env.toLowerCase());
}

export function getKnownEnvironments(): Environment[] {
  return [...KNOWN_ENVIRONMENTS];
}

export function getRuleCount(): number {
  return rules.size;
}
