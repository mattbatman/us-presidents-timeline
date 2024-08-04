function getPortraitSrc(node) {
  const img = node.querySelector("img");

  return img.src;
}

function getName(node) {
  const text = node.textContent.trim();
  const [name, meta] = text.split("(");

  return name;
}

export { getPortraitSrc, getName };
