/**
 * Create SVG element
 * @param {string} tag - SVG tag name
 * @returns {SVGElement} - Created SVG element
 */
export function createSVGElement(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}