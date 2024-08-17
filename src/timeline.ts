import * as d3 from "d3";
import { President } from "./types";

function draw({ data, selector }: { data: President[]; selector: string }) {
  const minYear = d3.min(data, (d) => d.startTerm);
  const maxYear = d3.max(data, (d) => d.endTerm);

  const containerHeight = parseInt(d3.select(selector).style("height"));
  const containerWidth = parseInt(d3.select(selector).style("width"));

  const margin = {
    left: 10,
    right: 10,
    top: 10,
    bottom: 50,
  };

  const width = containerWidth - margin.left - margin.right;

  const height = containerHeight - margin.top - margin.bottom;

  const plotArea = {
    x: margin.left,
    y: margin.top,
    width,
    height,
  };

  // create the skeleton of the chart
  const svg = d3
    .select(selector)
    .append("svg")
    .attr("width", "100%") // TODO: width conflict
    .attr("height", containerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // start placement of the x-axis
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height})`);

  svg
    .select(".x.axis")
    .selectAll("text")
    .attr("transform", "rotate(0)")
    .style("text-anchor", "middle");

  const x = d3.scaleTime();
  const xAxis: any = d3.axisBottom(x);

  console.log(minYear, "   ", maxYear);
  x.domain([minYear, maxYear]).range([0, width]);

  // xAxis.tickValues(x.domain().filter(filterTimeTicksOnlyYear))

  xAxis.scale(x);

  // call the axes
  svg.select(".x.axis").call(xAxis);
}

// function filterTimeTicksOnlyYear(d, i, a) {
//   return i % 5 === 0;
// }

export { draw };
