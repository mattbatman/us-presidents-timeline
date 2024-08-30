import { timeParser } from "./parse-time";

function prepData(raw) {
  return raw.map(function (rawPresident) {
    return {
      number: rawPresident.number,
      portrait: rawPresident.portrait,
      name: rawPresident.name,
      partyColors: rawPresident.partyColors,
      startTerm: timeParser(rawPresident.startTerm),
      endTerm: timeParser(rawPresident.endTerm),
      partyNames: rawPresident.partyNames,
    };
  });
}

function isolateColors(data) {
  return data
    .map(function (president) {
      const {
        number,
        portrait,
        name,
        startTerm,
        endTerm,
        partyColors,
        partyNames,
      } = president;

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
          partyName: partyNames[0],
        };
      }

      return handleTwoParties(president);
    })
    .flat();
}

function handleTwoParties(president) {
  const {
    number,
    portrait,
    name,
    startTerm,
    endTerm,
    partyColors,
    partyNames,
  } = president;

  const midTerm = getMidterm({ startTerm, endTerm });

  return partyColors.map(function (partyColor, i) {
    return {
      number,
      portrait,
      name,
      startTerm: i === 0 ? startTerm : midTerm,
      endTerm: i === 0 ? midTerm : endTerm,
      partyColor,
      partyName: partyNames[i],
    };
  });
}

function getMidterm({
  startTerm,
  endTerm,
}) {
  return new Date((startTerm.getTime() + endTerm.getTime()) / 2);
}

export { prepData, isolateColors, handleTwoParties, getMidterm };
