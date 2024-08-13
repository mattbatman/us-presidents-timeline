import "./style.css";
import rawPresidents from "./presidents.json";
import { draw } from "./timeline";
import { prepData } from "./prep-data";

function main() {
  const presidents = prepData(rawPresidents);

  draw({ data: presidents, selector: "#timeline" });
}

main();
