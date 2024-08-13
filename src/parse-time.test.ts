import { timeParser } from "./parse-time";
import { describe, it } from "vitest";

describe("timeParser", () => {
  it("converts a string in the expected form to a date", ({ expect }) => {
    const start = "April 30, 1789";
    const actual = timeParser(start);
    const expected = new Date(1789, 3, 30);

    expect(actual?.getFullYear()).toBe(expected.getFullYear());
    expect(actual?.getMonth()).toBe(expected.getMonth());
    expect(actual?.getDate()).toBe(expected.getDate());
  });
});
