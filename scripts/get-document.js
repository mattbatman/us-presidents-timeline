import { Window } from "happy-dom";

const URL =
  "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States";

async function getDocument() {
  const res = await fetch(URL);
  const html = await res.text();

  const window = new Window();
  const { document } = window;

  document.write(html);

  return document;
}

export { getDocument };
