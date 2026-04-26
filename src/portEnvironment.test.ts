import {
  setEnvironment,
  removeEnvironment,
  getEnvironment,
  hasEnvironment,
  listEnvironments,
  getPortsForEnvironment,
  clearEnvironments,
  clearPortEnvironments,
} from "./portEnvironment";

beforeEach(() => {
  clearEnvironments();
});

describe("setEnvironment", () => {
  it("assigns an environment to a port", () => {
    setEnvironment(3000, "development");
    expect(getEnvironment(3000)).toBe("development");
  });

  it("overwrites an existing environment", () => {
    setEnvironment(3000, "development");
    setEnvironment(3000, "staging");
    expect(getEnvironment(3000)).toBe("staging");
  });

  it("handles multiple ports independently", () => {
    setEnvironment(3000, "development");
    setEnvironment(4000, "production");
    expect(getEnvironment(3000)).toBe("development");
    expect(getEnvironment(4000)).toBe("production");
  });
});

describe("removeEnvironment", () => {
  it("removes an environment from a port", () => {
    setEnvironment(3000, "development");
    removeEnvironment(3000);
    expect(hasEnvironment(3000)).toBe(false);
  });

  it("does nothing if port has no environment", () => {
    expect(() => removeEnvironment(9999)).not.toThrow();
  });
});

describe("hasEnvironment", () => {
  it("returns true when environment is set", () => {
    setEnvironment(5000, "test");
    expect(hasEnvironment(5000)).toBe(true);
  });

  it("returns false when no environment is set", () => {
    expect(hasEnvironment(5001)).toBe(false);
  });
});

describe("listEnvironments", () => {
  it("returns all port-environment mappings", () => {
    setEnvironment(3000, "development");
    setEnvironment(4000, "production");
    const list = listEnvironments();
    expect(list).toHaveLength(2);
    expect(list.find((e) => e.port === 3000)?.env).toBe("development");
    expect(list.find((e) => e.port === 4000)?.env).toBe("production");
  });

  it("returns empty array when no environments set", () => {
    expect(listEnvironments()).toEqual([]);
  });
});

describe("getPortsForEnvironment", () => {
  it("returns all ports tagged with a given environment", () => {
    setEnvironment(3000, "development");
    setEnvironment(3001, "development");
    setEnvironment(4000, "production");
    const devPorts = getPortsForEnvironment("development");
    expect(devPorts).toContain(3000);
    expect(devPorts).toContain(3001);
    expect(devPorts).not.toContain(4000);
  });

  it("returns empty array for unknown environment", () => {
    expect(getPortsForEnvironment("unknown")).toEqual([]);
  });
});

describe("clearPortEnvironments", () => {
  it("removes all environments for a specific port", () => {
    setEnvironment(3000, "development");
    setEnvironment(4000, "staging");
    clearPortEnvironments(3000);
    expect(hasEnvironment(3000)).toBe(false);
    expect(hasEnvironment(4000)).toBe(true);
  });
});

describe("clearEnvironments", () => {
  it("clears all environment mappings", () => {
    setEnvironment(3000, "development");
    setEnvironment(4000, "production");
    clearEnvironments();
    expect(listEnvironments()).toEqual([]);
  });
});
