import { clearAllTags, addTag } from "./portTag";
import {
  formatTag,
  formatTagsInline,
  renderTagRow,
  renderTagTable,
  renderTagSummary,
} from "./portTagFormatter";

beforeEach(() => clearAllTags());

describe("formatTag", () => {
  it("wraps tag in brackets", () => {
    const result = formatTag("api");
    expect(result).toContain("[api]");
  });
});

describe("formatTagsInline", () => {
  it("returns empty string for untagged port", () => {
    expect(formatTagsInline(9999)).toBe("");
  });

  it("returns formatted tags for tagged port", () => {
    addTag(3000, "frontend");
    addTag(3000, "dev");
    const result = formatTagsInline(3000);
    expect(result).toContain("[frontend]");
    expect(result).toContain("[dev]");
  });
});

describe("renderTagRow", () => {
  it("includes port and tags", () => {
    const row = renderTagRow({ port: 8080, tags: ["api", "backend"] });
    expect(row).toContain("8080");
    expect(row).toContain("[api]");
    expect(row).toContain("[backend]");
  });
});

describe("renderTagTable", () => {
  it("shows message when no tags", () => {
    expect(renderTagTable([])).toContain("No tagged ports");
  });

  it("renders rows for provided entries", () => {
    const entries = [{ port: 3000, tags: ["frontend"] }];
    const result = renderTagTable(entries);
    expect(result).toContain("3000");
    expect(result).toContain("[frontend]");
  });
});

describe("renderTagSummary", () => {
  it("shows count of tagged ports and tags", () => {
    addTag(3000, "api");
    addTag(5432, "db");
    const result = renderTagSummary();
    expect(result).toContain("2 tagged port");
    expect(result).toContain("2 total tag");
  });
});
