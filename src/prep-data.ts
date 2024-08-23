import { timeParser } from "./parse-time";
import { JSONData, President, ColorMark } from "./types";

function prepData(raw: JSONData[]): President[] {
  return raw.map(function (rawPresident) {
    return {
      number: rawPresident.number,
      portrait: rawPresident.portrait,
      name: rawPresident.name,
      partyColors: rawPresident.partyColors,
      startTerm: timeParser(rawPresident.startTerm),
      endTerm: timeParser(rawPresident.endTerm),
    };
  });
}

function isolateColors(data: President[]): ColorMark[] {
  return data
    .map(function (president) {
      const { number, portrait, name, startTerm, endTerm, partyColors } =
        president;

      if (partyColors.length > 2) {
        throw new Error("Unhandled number of parties found");
      }

      if (partyColors.length === 1) {
        return {
          number,
          portrait,
          name,
          startTerm,
          endTerm,
          partyColor: partyColors[0],
        };
      }

      return handleTwoParties(president);
    })
    .flat();
}

function handleTwoParties(president: President): ColorMark[] {
  const { number, portrait, name, startTerm, endTerm, partyColors } = president;

  const midTerm = getMidterm({ startTerm, endTerm });

  return partyColors.map(function (partyColor, i) {
    return {
      number,
      portrait,
      name,
      startTerm: i === 0 ? startTerm : midTerm,
      endTerm: i === 0 ? midTerm : endTerm,
      partyColor,
    };
  });
}

function getMidterm({
  startTerm,
  endTerm,
}: {
  startTerm: Date;
  endTerm: Date;
}): Date {
  return new Date((startTerm.getTime() + endTerm.getTime()) / 2);
}

export { prepData, isolateColors, handleTwoParties, getMidterm };
