import { getDocument } from "./get-document.js";
import { getPortraitSrc, getName, getTerm, getPartyColor } from "./parsers.js";
import { write } from "./write.js";

async function main() {
  try {
    const d = await getDocument();

    const tableRows = d.querySelectorAll("table.wikitable tbody tr");

    const data = [...tableRows]
      .map(function (r, i) {
        console.log('START')
        console.log(r.innerHTML)
        console.log('END')

        if (i === 0) {
          return;
        }

        const th = r.querySelector("th");
        const td = r.querySelectorAll("td");
        const datum = [...td];

        const [
          portraitNode,
          nameBirthDeathNode,
          termNode,
          partyColorNode,
          partyNameNode,
          electionNode,
          vpNode,
        ] = datum;

        const portrait = getPortraitSrc(portraitNode);
        const name = getName(nameBirthDeathNode);
        const { startTerm, endTerm } = getTerm(termNode);
        const partyColor = getPartyColor(partyColorNode);

        return {
          number: th.textContent.trim(),
          portrait,
          name,
          startTerm,
          endTerm,
          partyColor,
        };
      })
      .filter(function (data) {
        return data !== undefined && data !== null;
      });

    write(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("----------");
    console.log(e);
    console.log("----------");
  }
}

main();
