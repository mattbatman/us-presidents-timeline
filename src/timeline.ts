import * as d3 from "d3";
import { President, ColorMark } from "./types";
import { timeFormatter } from "./parse-time";

function isEven(num: number) {
  return num % 2 === 0;
}

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

  const presidentRadius = 32;
  const partyColorWidth = 4;

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

  const x = d3.scaleLinear();
  const xAxis: any = d3.axisBottom(x);

  // domain -> values in data
  // range -> location in chart
  y.domain([maxYear, minYear]).range([height, 0]);
  x.domain([(width / 2) * -1, width / 2]).range([0, width]);

  // sets the scale and returns the axis
  yAxis.scale(y);

  xAxis.scale(x);

  // write the x-axis to the chart
  svg
    .select(".y.axis")
    .attr("transform", "translate(" + x(0) + ",0)")
    .call(yAxis);

  svg.select(".x.axis").call(xAxis);

  // line along y-axis of party colors
  const partyColors = svg
    .append("g")
    .attr("class", "party-colors")
    .selectAll("rect")
    .data(colors)
    .join("rect")
    .attr("x", x(0))
    .attr("y", ({ startTerm }) => y(startTerm))
    .attr("height", ({ endTerm, startTerm }) => y(endTerm) - y(startTerm))
    .attr("width", partyColorWidth)
    .style("fill", ({ partyColor }) => partyColor);

  const widthWithGap = partyColorWidth + 3;

  // mark presidents background
  const presidentBackground = svg
    .append("g")
    .attr("class", "party-background")
    .selectAll("circle")
    .data(presidents)
    .join("circle")
    .attr("fill", ({ partyColors }) => partyColors[0])
    .attr("cy", (d: any) => y(d.startTerm) + presidentRadius)
    .attr("cx", (d, i) =>
      isEven(i)
        ? x(presidentRadius + widthWithGap)
        : x((presidentRadius + widthWithGap) * -1)
    )
    .attr("r", presidentRadius + 1)
    .attr("stroke-width", 2);

  // mark presidents
  const portraits = svg
    .append("g")
    .attr("class", "portraits")
    .selectAll("image")
    .data(presidents)
    .join("image")
    .attr("y", (d: any) => y(d.startTerm))
    .attr("x", (d, i) =>
      isEven(i) ? x(widthWithGap) : x(widthWithGap * -1 - presidentRadius * 2)
    )
    .attr("href", (d: any) => d.portrait)
    .attr("width", presidentRadius * 2)
    .attr("height", presidentRadius * 2)
    .attr("clip-path", `circle(${presidentRadius}px)`);

  const textY = ({ startTerm }) => y(startTerm);
  const textDx = (d, i) =>
    isEven(i)
      ? x(partyColorWidth + 3 + presidentRadius * 2 + 5)
      : x(-widthWithGap - presidentRadius * 2 - 4);
  const textDy = 12;
  const dyInterval = 16;
  const textAnchor = (d, i) => (isEven(i) ? "start" : "end");

  const meta = svg.append("g").attr("class", "meta");

  // name of the president text
  const name = meta
    .attr("class", "name")
    .selectAll("text")
    .data(presidents)
    .join("text")
    .style("font-size", "12px")
    .attr("y", textY)
    .attr("dx", textDx)
    .attr("dy", textDy)
    .attr("line-anchor", "middle")
    .attr("text-anchor", textAnchor)
    .text(({ name }) => name)
    .style("border-top", ({ partyColors }) => `1px solid ${partyColors[0]}`);

  // term of the president text
  const term = svg
    .append("g")
    .attr("class", "meta")
    .attr("class", "term")
    .selectAll("text")
    .data(presidents)
    .join("text")
    .style("font-size", "12px")
    .attr("y", textY)
    .attr("dx", textDx)
    .attr("dy", textDy + dyInterval)
    .attr("line-anchor", "middle")
    .attr("text-anchor", textAnchor)
    .text(
      ({ startTerm, endTerm }) =>
        `${timeFormatter(startTerm)} - ${timeFormatter(endTerm)}`
    );

  // border from party color to president name text
  const innerTick = svg
    .append("g")
    .attr("class", "inner-tick")
    .selectAll("line")
    .data(presidents)
    .join("line")
    .attr("x1", x(0))
    .attr("x2", (d, i) =>
      isEven(i)
        ? x(widthWithGap + presidentRadius)
        : x(-widthWithGap - 3 - presidentRadius)
    )
    .attr("y1", ({ startTerm }) => y(startTerm))
    .attr("y2", ({ startTerm }) => y(startTerm))
    .attr("stroke", ({ partyColors }) => partyColors[0]);
}

export { draw };
