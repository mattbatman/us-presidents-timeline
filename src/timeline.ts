import * as d3 from "d3";
import { President } from "./types";

function draw({ data, selector }: { data: President[]; selector: string }) {
  const minYear = d3.min(data, (d) => d.startTerm) ?? new Date(1776, 6, 4);
  const maxYear = d3.max(data, (d) => d.endTerm) ?? new Date();

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

  // create the skeleton of the chart
  const svg = d3
    .select(selector)
    .append("svg")
    .attr("width", "100%")
    .attr("height", containerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // start placement of the x-axis
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height})`);

  // style x-axis tick labels
  svg
    .select(".x.axis")
    .selectAll("text")
    .attr("transform", "rotate(0)")
    .style("text-anchor", "middle");

  // set x scale
  const x = d3.scaleTime();
  // set place axis on chart
  const xAxis: any = d3.axisBottom(x);

  // domain -> values in data
  // range -> location in chart
  x.domain([minYear, maxYear]).range([0, width]);

  // sets the scale and returns the axis
  xAxis.scale(x);

  // write the x-axis to the chart
  svg.select(".x.axis").call(xAxis);
}

export { draw };
