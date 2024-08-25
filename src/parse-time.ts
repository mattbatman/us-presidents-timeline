import * as d3 from "d3";

const timeParser = d3.timeParse("%B %d, %Y");

const timeFormatter = d3.timeFormat("%b %e, %Y");

export { timeParser, timeFormatter };
