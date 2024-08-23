import { describe, it } from "vitest";
import { prepData, isolateColors, getMidterm } from "./prep-data";
import { timeParser } from "./parse-time";

describe("isolateColors", () => {
  it("should return a record for each president and color", ({ expect }) => {
    const rawData = [
      {
        number: "5",
        portrait:
          "//upload.wikimedia.org/wikipedia/commons/thumb/d/d4/James_Monroe_White_House_portrait_1819.jpg/150px-James_Monroe_White_House_portrait_1819.jpg",
        name: "James Monroe",
        startTerm: "March 4, 1817",
        endTerm: "March 4, 1825",
        partyColors: ["#008000"],
      },
      {
        number: "6",
        portrait:
          "//upload.wikimedia.org/wikipedia/commons/thumb/e/e8/JQA_Photo_Crop.jpg/150px-JQA_Photo_Crop.jpg",
        name: "John Quincy Adams",
        startTerm: "March 4, 1825",
        endTerm: "March 4, 1829",
        partyColors: ["#008000", "#FFE6B0"],
      },
    ];

    const startTerm = timeParser("March 4, 1825");
    const endTerm = timeParser("March 4, 1829");
    const midTerm = getMidterm({ startTerm, endTerm });

    const expected = [
      {
        number: "5",
        portrait:
          "//upload.wikimedia.org/wikipedia/commons/thumb/d/d4/James_Monroe_White_House_portrait_1819.jpg/150px-James_Monroe_White_House_portrait_1819.jpg",
        name: "James Monroe",
        startTerm: timeParser("March 4, 1817"),
        endTerm: timeParser("March 4, 1825"),
        partyColor: "#008000",
      },
      {
        number: "6",
        portrait:
          "//upload.wikimedia.org/wikipedia/commons/thumb/e/e8/JQA_Photo_Crop.jpg/150px-JQA_Photo_Crop.jpg",
        name: "John Quincy Adams",
        startTerm,
        endTerm: midTerm,
        partyColor: "#008000",
      },
      {
        number: "6",
        portrait:
          "//upload.wikimedia.org/wikipedia/commons/thumb/e/e8/JQA_Photo_Crop.jpg/150px-JQA_Photo_Crop.jpg",
        name: "John Quincy Adams",
        startTerm: midTerm,
        endTerm,
        partyColor: "#FFE6B0",
      },
    ];

    const prepped = prepData(rawData);

    const actual = isolateColors(prepped);

    expect(actual).toEqual(expected);
  });
});
