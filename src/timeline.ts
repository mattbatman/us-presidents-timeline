import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { President, ColorMark } from "./types";

const selectStartTerm = ({ startTerm }) => startTerm;
const selectEndTerm = ({ endTerm }) => endTerm;
const selectImg = ({ portrait }) => portrait;
const selectName = ({ name }) => name;
const selectPartyColor = ({ partyColor }) => partyColor;

function draw({
  presidents,
  colors,
  selector,
}: {
  presidents: President[];
  colors: ColorMark[];
  selector: string;
}) {
  const container = d3.select(selector);

  const minYear =
    d3.min(presidents, (d) => d.startTerm) ?? new Date(1776, 6, 4);
  const maxYear = d3.max(presidents, (d) => d.endTerm) ?? new Date();

  const presidentRadius = 16;

  const height = presidents.length * 150;
  const width = parseInt(container.style("width"));

  const margin = {
    left: 48,
    right: 16,
    top: 48,
    bottom: 48,
  };

  // create the skeleton of the chart
  const svg = container
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // start placement of the y-axis
  svg.append("g").attr("class", "y axis");

  // style y-axis tick labels

  // set y scale
  const y = d3.scaleTime();
  // set place axis on chart
  const yAxis: any = d3.axisLeft(y).tickPadding(2);

  // domain -> values in data
  // range -> location in chart
  y.domain([maxYear, minYear]).range([height, 0]);

  // sets the scale and returns the axis
  yAxis.scale(y);

  // write the x-axis to the chart
  svg.select(".y.axis").call(yAxis);

  // mark presidents background
  const presidentBackground = svg
    .append("g")
    .attr("class", "party-background")
    .selectAll("circle")
    .data(presidents)
    .join("circle")
    .attr("fill", ({ partyColors }) => partyColors[0])
    .attr("cy", (d: any) => y(d.startTerm))
    .attr("cx", presidentRadius)
    .attr("r", presidentRadius + 1)
    .attr("stroke-width", 2);

  // mark presidents
  const portraits = svg
    .append("g")
    .attr("class", "portraits")
    .selectAll("image")
    .data(presidents)
    .join("image")
    .attr("y", (d: any) => y(d.startTerm) - presidentRadius)
    .attr("href", (d: any) => d.portrait)
    .attr("width", presidentRadius * 2)
    .attr("height", presidentRadius * 2)
    .attr("clip-path", `circle(${presidentRadius}px)`);

  const partyColors = svg
    .append("g")
    .attr("class", "party-colors")
    .selectAll("rect")
    .data(colors)
    .join("rect")
    .attr("x", 0)
    .attr("y", ({ startTerm }) => y(startTerm))
    .attr("height", ({ endTerm, startTerm }) => y(endTerm) - y(startTerm))
    .attr("width", "8px")
    .style("fill", ({ partyColor }) => partyColor);
}

export { draw };
