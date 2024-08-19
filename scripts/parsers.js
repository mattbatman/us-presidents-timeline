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

  return { startTerm, endTerm };
}

function getPartyColor(node) {
  return node.style.backgroundColor;
}

export { getPortraitSrc, getName, getTerm, getPartyColor };
