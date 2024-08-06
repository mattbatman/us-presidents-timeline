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
    it("should parse the wikipedia string for the president's name", ({ expect }) => {
      td.innerHTML = `<td data-sort-value="Washington, George"><b><a href="/wiki/George_Washington" title="George Washington">George Washington</a></b><br><span style="font-size:85%;">(1732���1799)</span><br><sup id="cite_ref-FOOTNOTEMcDonald2000_19-0" class="reference"><a href="#cite_note-FOOTNOTEMcDonald2000-19">[17]</a></sup>
</td>`;

      const actual = getName(td);

      expect(actual).toBe("George Washington");
    });
  });
});
