import * as d3 from "d3";
import { timeFormatter } from "./parse-time";

function isEven(num) {
  return num % 2 === 0;
}

function getPresidentRadius(screenWidth) {
  if (screenWidth < 400) {
    return 8;
  }

  if (screenWidth < 500) {
    return 12;
  }

  if (screenWidth < 550) {
    return 16;
  }

  if (screenWidth < 600) {
    return 24;
  }

  if (screenWidth < 1000) {
    return 32;
  }

  if (screenWidth < 1500) {
    return 38;
  }

  return 42;
}

function getMinMaxYears({ presidents }) {
  const minYear =
    d3.min(presidents, (d) => d.startTerm) ?? new Date(1776, 6, 4);

  const maxYear = d3.max(presidents, (d) => d.endTerm) ?? new Date();

  return {
    minYear,
    maxYear,
  };
}

function getY({ height, minYear, maxYear }) {
  // set y scale
  const y = d3.scaleTime();
  // set place axis on chart
  const yAxis = d3.axisLeft(y).tickPadding(2);

  // domain -> values in data
  // range -> location in chart

  y.domain([maxYear, minYear]).range([height, 0]);

  yAxis.scale(y);

  return {
    y,
    yAxis,
  };
}

function writeYAxis({ svg, x, yAxis }) {
  svg
    .select(".y.axis")
    .attr("transform", "translate(" + x(0) + ",0)")
    .call(yAxis);
}

function writeXAxs({ svg, xAxis }) {
  svg.select(".x.axis").call(xAxis);
}

function getX({ width }) {
  const x = d3.scaleLinear();
  const xAxis = d3.axisBottom(x);

  // domain -> values in data
  // range -> location in chart
  x.domain([(width / 2) * -1, width / 2]).range([0, width]);

  xAxis.scale(x);

  return {
    x,
    xAxis,
  };
}

function writePartyColorsAlongAxis({ svg, colors, partyColorWidth, x, y }) {
  return svg
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
}

function writePresidentBackgrounds({
  svg,
  presidents,
  y,
  x,
  presidentRadius,
  widthWithGap,
}) {
  return svg
    .append("g")
    .attr("class", "party-background")
    .selectAll("circle")
    .data(presidents)
    .join("circle")
    .attr("fill", ({ partyColors }) => partyColors[0])
    .attr("cy", (d) => y(d.startTerm) + presidentRadius)
    .attr("cx", (d, i) =>
      isEven(i)
        ? x(presidentRadius + widthWithGap)
        : x((presidentRadius + widthWithGap) * -1)
    )
    .attr("r", presidentRadius + 1)
    .attr("stroke-width", 2);
}

function writePresidentPortraits({
  svg,
  presidents,
  x,
  y,
  widthWithGap,
  presidentRadius,
}) {
  return svg
    .append("g")
    .attr("class", "portraits")
    .selectAll("image")
    .data(presidents)
    .join("image")
    .attr("y", (d) => y(d.startTerm))
    .attr("x", (d, i) =>
      isEven(i) ? x(widthWithGap) : x(widthWithGap * -1 - presidentRadius * 2)
    )
    .attr("href", (d) => d.portrait)
    .attr("width", presidentRadius * 2)
    .attr("height", presidentRadius * 2)
    .attr("clip-path", `circle(${presidentRadius}px)`);
}

function writePresidentText({
  svg,
  presidents,
  textY,
  textDx,
  textDy,
  dyInterval,
  textAnchor,
  colors,
}) {
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
    .attr("class", "first-party")
    .attr("x", (d, i) => (isEven(i) ? textDx(d, i) + 6 : textDx(d, i) - 6))
    .attr("dy", textDy + dyInterval * 2)
    .text(({ partyNames }) => partyNames[0]);

  const secondParty = partyNamesGroup
    .append("tspan")
    .attr("class", "second-party")
    .attr("x", (d, i) => (isEven(i) ? textDx(d, i) + 6 : textDx(d, i) - 6))
    .attr("dy", dyInterval)
    .text(({ partyNames }) => (partyNames[1] ? partyNames[1] : null));

  const partyNameColorPrefix = svg
    .append("g")
    .attr("class", "party-name-colors")
    .selectAll("rect")
    .data(colors)
    .join("rect")
    .attr("x", (d) => {
      const indexedZeroNumber = Number(d.number) - 1;

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

  return { meta };
}

function writeInnerTick({
  svg,
  presidents,
  widthWithGap,
  presidentRadius,
  x,
  y,
}) {
  return svg
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

function draw({ presidents, colors, selector }) {
  // select graph container
  const container = d3.select(selector);

  // set various size variables
  let presidentRadius = getPresidentRadius(window.innerWidth);

  // the width of the party colors along the y-axis
  const partyColorWidth = 2;
  // the gap between the party colors axis line and the president portraits
  const widthWithGap = partyColorWidth + 3;

  const height = presidents.length * 150;
  const width = parseInt(container.style("width"));

  const margin = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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

  // get values for scales
  const { minYear, maxYear } = getMinMaxYears({ presidents });

  const { y, yAxis } = getY({ height, minYear, maxYear });

  const { x, xAxis } = getX({ width });

  writeYAxis({ svg, x, yAxis });

  writeXAxs({ svg, xAxis });

  writePartyColorsAlongAxis({ svg, colors, partyColorWidth, x, y });

  // mark presidents background
  writePresidentBackgrounds({
    svg,
    presidents,
    y,
    x,
    presidentRadius,
    widthWithGap,
  });

  // mark presidents
  writePresidentPortraits({
    svg,
    presidents,
    x,
    y,
    widthWithGap,
    presidentRadius,
  });

  // start of the president name text
  const textY = ({ startTerm }) => y(startTerm);
  const textDx = (d, i) =>
    isEven(i)
      ? x(partyColorWidth + 3 + presidentRadius * 2 + 7)
      : x(-widthWithGap - presidentRadius * 2 - 7);
  const textDy = 12;
  const dyInterval = 16;
  const textAnchor = (d, i) => (isEven(i) ? "start" : "end");

  const { meta } = writePresidentText({
    svg,
    presidents,
    textY,
    textDx,
    textDy,
    dyInterval,
    textAnchor,
    colors,
  });

  // border from party color to president name text
  writeInnerTick({
    svg,
    presidents,
    widthWithGap,
    presidentRadius,
    x,
    y,
  });

  d3.select(window).on("resize", function () {
    const container = d3.select(selector);
    const width = parseInt(container.style("width"));
    const height = presidents.length * 150;

    presidentRadius = getPresidentRadius(window.innerWidth);

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

    // line along y-axis of party colors
    svg
      .select(".party-colors")
      .selectAll("rect")
      .attr("x", x(0))
      .attr("y", ({ startTerm }) => y(startTerm))
      .attr("height", ({ endTerm, startTerm }) => y(endTerm) - y(startTerm));

    // move border/legend color by party name under president
    svg
      .select(".party-name-colors")
      .selectAll("rect")
      .attr("x", (d) => {
        const indexedZeroNumber = d.number - 1;

        return textDx(d, indexedZeroNumber);
      })
      .attr("y", (d) => {
        const president = presidents.find(({ name }) => {
          return name === d.name;
        });

        if (president?.partyNames[0] === d.partyName) {
          return (
            textY({ startTerm: president?.startTerm }) + dyInterval * 2 + 2
          );
        }

        return textY({ startTerm: president?.startTerm }) + dyInterval * 3 + 2;
      });

    // move presidents background and portraits
    svg
      .select(".party-background")
      .selectAll("circle")
      .attr("cy", (d) => y(d.startTerm) + presidentRadius)
      .attr("cx", (d, i) =>
        isEven(i)
          ? x(presidentRadius + widthWithGap)
          : x((presidentRadius + widthWithGap) * -1)
      )
      .attr("r", presidentRadius + 1);

    svg
      .select(".portraits")
      .selectAll("image")
      .attr("y", (d) => y(d.startTerm))
      .attr("x", (d, i) =>
        isEven(i) ? x(widthWithGap) : x(widthWithGap * -1 - presidentRadius * 2)
      )
      .attr("href", (d) => d.portrait)
      .attr("width", presidentRadius * 2)
      .attr("height", presidentRadius * 2)
      .attr("clip-path", `circle(${presidentRadius}px)`);

    // name of the president text
    meta
      .select(".name")
      .selectAll("text")
      .attr("y", textY)
      .attr("dx", textDx)
      .attr("dy", textDy);

    // term of the president text
    meta
      .select(".term")
      .selectAll("text")
      .attr("y", textY)
      .attr("dx", textDx)
      .attr("dy", textDy + dyInterval);

    // move inner tick with party color
    svg
      .select(".inner-tick")
      .selectAll("line")
      .attr("x1", x(0))
      .attr("x2", (d, i) =>
        isEven(i)
          ? x(widthWithGap + presidentRadius)
          : x(-widthWithGap - 3 - presidentRadius)
      )
      .attr("y1", ({ startTerm }) => y(startTerm))
      .attr("y2", ({ startTerm }) => y(startTerm));

    // move color band prefixes before party names
    svg
      .select(".parties")
      .selectAll("text")
      .attr("y", textY)
      .attr("x", textDx)
      .attr("dy", textDy + dyInterval);

    svg
      .select(".parties")
      .selectAll("tspan.first-party")
      .attr("x", (d, i) => (isEven(i) ? textDx(d, i) + 6 : textDx(d, i) - 6))
      .attr("dy", textDy + dyInterval * 2);

    svg
      .select(".parties")
      .selectAll("tspan.second-party")
      .attr("x", (d, i) => (isEven(i) ? textDx(d, i) + 6 : textDx(d, i) - 6))
      .attr("dy", dyInterval);
  });
}

export { draw };
