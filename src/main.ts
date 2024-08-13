import "./style.css";
import presidents from "./presidents.json";
import { draw } from "./timeline";

function main() {
  draw({ data: presidents, selector: "#timeline" });
}

main();
