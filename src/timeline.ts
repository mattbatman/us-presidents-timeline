import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { President } from "./types";

function draw({ data, selector }: { data: President[]; selector: string }) {
  const minYear = d3.min(data, (d) => d.startTerm) ?? new Date(1776, 6, 4);
  const maxYear = d3.max(data, (d) => d.endTerm) ?? new Date();

  const presidentRadius = 16;

  const height = data.length * 100;

  const timelineConfig = {
    marginLeft: 48,
    marginRight: 16,
    marginTop: 16,
    marginBottom: 16,
    height,
    y: {
      type: "time",
      domain: [maxYear, minYear],
      //     label: "Year",
      //      tickFormat: d3.format("d"),
      tickSize: 0,
      paddingOuter: 1,
    },
    marks: [
      Plot.dot(data, {
        y: ({ startTerm }) => startTerm,
        r: presidentRadius + 1,
        fill: ({ partyColor }) => partyColor,
        strokeWidth: 2,
      }),
      Plot.image(data, {
        y: ({ startTerm }) => startTerm,
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
