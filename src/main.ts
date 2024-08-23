import "./style.css";
import rawPresidents from "./presidents.json";
import { draw } from "./timeline";
import { prepData, isolateColors } from "./prep-data";

function main() {
  const presidents = prepData(rawPresidents);
  const colors = isolateColors(presidents);

  draw({ presidents, colors, selector: "#timeline" });
}

main();
