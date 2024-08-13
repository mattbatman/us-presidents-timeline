import * as d3 from "d3";

function draw({ data, selector }: { data: any; selector: string }) {
  const containerWidth = parseInt(d3.select(selector).style("width"));
  const containerHeight = d3.max([
    parseInt(d3.select(selector).style("height")),
    (1789 - 1775) * 175,
  ]);
  console.log(data);
}

export { draw };
