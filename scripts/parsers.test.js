import { describe, it, beforeEach, afterEach } from "vitest";
import { Window } from "happy-dom";
import {
  getPortraitSrc,
  getName,
  getTerm,
  getPartyColor,
  getPartyColors,
  removeFootnoteMark,
  getPartyNames,
} from "./parsers.js";

describe("parsers", () => {
  let window = null;
  let document = null;
  let td = null;
  let tr = null;

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

  /**
   * it's not clear to me why, but the query selector from the main function
   * picks up the td element as outerHTML, while all other tests work with
   * adding innerHTML.
   * */
  describe.skip("getPartyColors", () => {
    it("should return a list of colors", ({ expect }) => {
      td.outerHTML = `
        <td style="background: linear-gradient(#008000 50%, #FFE6B0 50%);"></td>
      `;
      td.style.background = "linear-gradient(#008000 50%, #FFE6B0 50%)";

      const actual = getPartyColors(td);

      expect(actual).toEqual(["#008000", "#FFE6B0"]);
    });

    it("should handle a single color", ({ expect }) => {
      td.outerHTML = `
        <td style="background-color:#3333FF">
        </td>
      `;
      td.style.backgroundColor = "#3333FF";

      const actual = getPartyColors(td);

      expect(actual).toEqual(["#3333FF"]);
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

  describe("getPartyNames", () => {
    it("should return the affiliated party names", ({ expect }) => {
      td.innerHTML = `
          <a href="/wiki/Republican_Party_(United_States)" title="Republican Party (United States)">Republican</a>
          <hr> 
          <a href="/wiki/National_Union_Party_(United_States)" title="National Union Party (United States)">National Union</a><sup id="cite_ref-ALincoln_53-0" class="reference"><a href="#cite_note-ALincoln-53"><span class="cite-bracket">[</span>l<span class="cite-bracket">]</span></a></sup>
      `;

      const actual = getPartyNames(td);

      const expected = ["Republican", "National Union"];

      expect(actual).toEqual(expected);
    });

    it("should return the affiliated party names", ({ expect }) => {
      td.innerHTML = `
        <a href="/wiki/Democratic-Republican_Party" title="Democratic-Republican Party">Democratic-<br>Republican</a><sup id="cite_ref-JQAdams_32-0" class="reference"><a href="#cite_note-JQAdams-32"><span class="cite-bracket">[</span>f<span class="cite-bracket">]</span></a></sup> <hr> <a href="/wiki/National_Republican_Party" title="National Republican Party">National Republican</a>
      `;

      const actual = getPartyNames(td);

      const expected = ["Democratic-Republican", "National Republican"];

      expect(actual).toEqual(expected);
    });
  });
});
