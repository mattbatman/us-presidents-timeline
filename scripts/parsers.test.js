import { describe, it, beforeEach, afterEach } from "vitest";
import { Window } from "happy-dom";
import {
  getPortraitSrc,
  getName,
  getTerm,
  getPartyColor,
  removeFootnoteMark,
} from "./parsers.js";

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
    it("should parse the wikipedia string for the president's name", ({
      expect,
    }) => {
      td.innerHTML = `<td data-sort-value="Washington, George"><b><a href="/wiki/George_Washington" title="George Washington">George Washington</a></b><br><span style="font-size:85%;">(1732���1799)</span><br><sup id="cite_ref-FOOTNOTEMcDonald2000_19-0" class="reference"><a href="#cite_note-FOOTNOTEMcDonald2000-19">[17]</a></sup>
</td>`;

      const actual = getName(td);

      expect(actual).toBe("George Washington");
    });
  });

  describe("getTerm", () => {
    it("should return the start and end term dates as strings in an object", ({
      expect,
    }) => {
      td.innerHTML = `
      <td>
        <span data-sort-value="000000001789-04-30-0000" style="white-space:nowrap">
          April 30, 1789
        </span>
        <br>–<br>
        <span data-sort-value="000000001797-03-04-0000" style="white-space:nowrap">
          March 4, 1797
        </span>
        </td>
      `;

      const actual = getTerm(td);
      const expected = {
        startTerm: "April 30, 1789",
        endTerm: "March 4, 1797",
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("getPartyColor", () => {
    it("should return the background color of the node", ({ expect }) => {
      td.style.backgroundColor = "#000000";
      const actual = getPartyColor(td);

      expect(actual).toBe("#000000");
    });
  });

  describe("removeFootnoteMark", () => {
    it("should remove footnote brackets from a string", ({ expect }) => {
      const start = "August 9, 1974[u]";
      const expected = "August 9, 1974";

      const actual = removeFootnoteMark(start);

      expect(actual).toBe(expected);
    });
  });
});
