import { getDocument } from "./get-document.js";

async function main() {
  try {
    const b = await getDocument();

    console.log(b);
  } catch (e) {
    console.log("----------");
    console.log(e);
    console.log("----------");
  }
}

main();
