import { describe, it, beforeEach, afterEach } from "vitest";
import { Window } from "happy-dom";
import { getPortraitSrc, getName } from "./parsers.js";

describe("parsers", () => {
  let window = null;
  let document = null;
  let td = null;

  beforeEach(() => {
    window = new Window();
    document = window.document;
    td = document.createElement("td");
  });

  afterEach(() => {
    window.close();
  });

  describe("getPortraitSrc", () => {
    it("should return the src string", ({ expect }) => {
      const src = "//upload.example.com";
      const img = document.createElement("img");
      img.src = src;

      td.appendChild(img);

      const actual = getPortraitSrc(td);

      expect(actual).toBe(src);
    });
  });

  describe("getName", () => {
    it.todo("should parse the wikipedia string for the president's name", () => {});
  });
});
