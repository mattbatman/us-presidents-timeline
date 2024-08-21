import { timeParser } from "./parse-time";
import { JSONData, President } from "./types";

function prepData(raw: JSONData[]): President[] {
  return raw.map(function (rawPresident) {
    return {
      number: rawPresident.number,
      portrait: rawPresident.portrait,
      name: rawPresident.name,
      partyColor: rawPresident.partyColor,
      startTerm: timeParser(rawPresident.startTerm),
      endTerm: timeParser(rawPresident.endTerm),
    };
  });
}

export { prepData };
