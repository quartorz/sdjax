const copyGlyphs = (glyphSource: SVGSVGElement, svg: SVGSVGElement) => {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('transform', 'scale(0,0)');

  for (const n of glyphSource.firstChild.childNodes) {
    console.log(n);
    const path = n.cloneNode() as SVGPathElement;
    g.appendChild(path);
  }

  svg.appendChild(g);
};

export default copyGlyphs;
