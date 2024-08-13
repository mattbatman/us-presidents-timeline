import { timeParser } from "./parse-time";

interface JSONData {
  number: string;
  portrait: string;
  name: string;
  startTerm: string;
  endTerm: string;
}

interface President {
  number: string;
  portrait: string;
  name: string;
  startTerm: Date | null;
  endTerm: Date | null;
}

function prepData(raw: JSONData[]): President[] {
  return raw.map(function (rawPresident) {
    return {
      number: rawPresident.number,
      portrait: rawPresident.portrait,
      name: rawPresident.name,
      startTerm: timeParser(rawPresident.startTerm),
      endTerm: timeParser(rawPresident.endTerm),
    };
  });
}

export { prepData };
