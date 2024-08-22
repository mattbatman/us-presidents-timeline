function getPortraitSrc(node) {
  const img = node.querySelector("img");

  return img.src;
}

function getName(node) {
  const text = node.textContent.trim();
  const [name, meta] = text.split("(");

  return name;
}

function getTerm(node) {
  const text = node.textContent.trim();
  const [startTerm, endTerm] = text.split("–").map((t) => t.trim());
  const endTermOrNow =
    endTerm === "Incumbent" ? getCurrentDateString() : endTerm;

  return {
    startTerm: removeFootnoteMark(startTerm),
    endTerm: removeFootnoteMark(endTermOrNow),
  };
}

function getCurrentDateString() {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const currentDate = new Date().toLocaleDateString("en-US", options);

  return currentDate;
}

function getPartyColors(node) {
  const singleBg = node.style.backgroundColor;

  if (singleBg) {
    return [singleBg];
  }

  const hexCodes = node.outerHTML.match(/#[0-9A-Fa-f]{6}/g);

  return hexCodes;
}

function removeFootnoteMark(dateString) {
  return dateString.replace(/\[\w\]/, "");
}

export { getPortraitSrc, getName, getTerm, removeFootnoteMark, getPartyColors };
