import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { President } from "./types";

const selectStartTerm = ({ startTerm }) => startTerm;
const selectImg = ({ portrait }) => portrait;
const selectName = ({ name }) => name;

function draw({ data, selector }: { data: President[]; selector: string }) {
  const minYear = d3.min(data, (d) => d.startTerm) ?? new Date(1776, 6, 4);
  const maxYear = d3.max(data, (d) => d.endTerm) ?? new Date();

  const presidentRadius = 16;

  const height = data.length * 150;

  const timelineConfig = {
    marginLeft: 48,
    marginRight: 16,
    marginTop: 48,
    marginBottom: 48,
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
        y: selectStartTerm,
        r: presidentRadius + 1,
        fill: ({ partyColors }) => partyColors[0],
        strokeWidth: 2,
      }),
      Plot.image(data, {
        y: selectStartTerm,
        src: selectImg,
        r: presidentRadius,
      }),
      Plot.text(data, {
        y: selectStartTerm,
        text: selectName,
        lineAnchor: "middle",
        textAnchor: "start",
        dx: presidentRadius + 8,
        dy: -presidentRadius / 2,
      }),
    ],
  };

  const chart = Plot.plot(timelineConfig);

  const div = document.querySelector(selector);

  div.append(chart);
}

export { draw };
