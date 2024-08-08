import { getDocument } from "./get-document.js";
import { getPortraitSrc, getName, getTerm } from "./parsers.js";
import { write } from "./write.js";

async function main() {
  try {
    const d = await getDocument();

    const tableRows = d.querySelectorAll("table.wikitable tbody tr");

    const data = [...tableRows]
      .map(function (r, i) {
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
          partyNode,
          electionNode,
          vpNode,
        ] = datum;

        const portrait = getPortraitSrc(portraitNode);
        const name = getName(nameBirthDeathNode);
        const { startTerm, endTerm } = getTerm(termNode);

        return {
          number: th.textContent.trim(),
          portrait,
          name,
          startTerm,
          endTerm,
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
