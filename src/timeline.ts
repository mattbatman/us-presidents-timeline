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
      ? x(partyColorWidth + 3 + presidentRadius * 2 + 7)
      : x(-widthWithGap - presidentRadius * 2 - 7);
  const textDy = 12;
  const dyInterval = 16;
  const textAnchor = (d, i) => (isEven(i) ? "start" : "end");

  const meta = svg.append("g").attr("class", "meta");

  // name of the president text
  const name = meta
    .append("g")
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
  const term = meta
    .append("g")
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

  const partyNamesGroup = meta
    .append("g")
    .attr("class", "parties")
    .selectAll("text")
    .data(presidents)
    .join("text")
    .style("font-size", "12px")
    .attr("y", textY)
    .attr("x", textDx)
    .attr("dy", textDy + dyInterval)
    .attr("line-anchor", "middle")
    .attr("text-anchor", textAnchor);

  const firstParty = partyNamesGroup
    .append("tspan")
    .attr("x", (d, i) => (isEven(i) ? textDx(d, i) + 6 : textDx(d, i) - 6))
    .attr("dy", textDy + dyInterval * 2)
    .text(({ partyNames }) => partyNames[0]);

  const secondParty = partyNamesGroup
    .append("tspan")
    .attr("x", (d, i) => (isEven(i) ? textDx(d, i) + 6 : textDx(d, i) - 6))
    .attr("dy", dyInterval)
    .text(({ partyNames }) => (partyNames[1] ? partyNames[1] : null));

  // line along y-axis of party colors
  const firstPartyNameColorPrefix = svg
    .append("g")
    .attr("class", "party-name-colors")
    .selectAll("rect")
    .data(colors)
    .join("rect")
    .attr("x", (d) => {
      const indexedZeroNumber = d.number - 1;

      return textDx(d, indexedZeroNumber);
    })
    .attr("y", (d) => {
      const president = presidents.find(({ name }) => {
        return name === d.name;
      });

      if (president?.partyNames[0] === d.partyName) {
        return textY({ startTerm: president?.startTerm }) + dyInterval * 2 + 2;
      }

      return textY({ startTerm: president?.startTerm }) + dyInterval * 3 + 2;
    })
    .attr("height", 12)
    .attr("width", 2)
    .style("fill", ({ partyColor }) => partyColor);

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

  d3.select(window).on("resize", function () {
    const container = d3.select(selector);
    const width = parseInt(container.style("width"));
    const height = presidents.length * 150;

    // reset domain and ranges based on new height and width
    y.domain([maxYear, minYear]).range([height, 0]);
    x.domain([(width / 2) * -1, width / 2]).range([0, width]);

    // reset scales
    yAxis.scale(y);
    xAxis.scale(x);

    // write the x-axis to the chart
    svg
      .select(".y.axis")
      .attr("transform", "translate(" + x(0) + ",0)")
      .call(yAxis);

    svg.select(".x.axis").call(xAxis);
  });
}

export { draw };
