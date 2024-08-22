import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { President } from "./types";

function draw({ data, selector }: { data: President[]; selector: string }) {
  const minYear = d3.min(data, (d) => d.startTerm) ?? new Date(1776, 6, 4);
  const maxYear = d3.max(data, (d) => d.endTerm) ?? new Date();

  const presidentRadius = 13;

  const containerHeight = parseInt(d3.select(selector).style("height"));
  const containerWidth = parseInt(d3.select(selector).style("width"));

  const timelineConfig = {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 50,
    width: containerWidth,
    height: containerHeight,
    x: {
      type: "time",
      domain: [minYear, maxYear],
      //     label: "Year",
      //      tickFormat: d3.format("d"),
      tickSize: 0,
      paddingOuter: 1,
    },
    marks: [
      Plot.dot(data, {
        x: ({ startTerm }) => startTerm,
        r: presidentRadius + 1,
        fill: ({ partyColor }) => partyColor,
        strokeWidth: 2,
      }),
      Plot.image(data, {
        x: ({ startTerm }) => startTerm,
        src: ({ portrait }) => portrait,
        r: presidentRadius,
      }),
    ],
  };

  const chart = Plot.plot(timelineConfig);

  const div = document.querySelector(selector);

  div.append(chart);
}

export { draw };
