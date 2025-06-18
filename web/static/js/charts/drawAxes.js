import { createSVGElement } from '../utils/elements.js';
/**
 * Draw chart axes
 * @param {SVGElement} g - Group element
 * @param {number} chartWidth - Chart width
 * @param {number} chartHeight - Chart height
 */
export function drawAxes(g, chartWidth, chartHeight) {
    // X axis
    const xAxis = createSVGElement('line');
    xAxis.setAttribute('x1', 0);
    xAxis.setAttribute('y1', chartHeight);
    xAxis.setAttribute('x2', chartWidth);
    xAxis.setAttribute('y2', chartHeight);
    xAxis.setAttribute('class', 'axis');
    g.appendChild(xAxis);

    // Y axis
    const yAxis = createSVGElement('line');
    yAxis.setAttribute('x1', 0);
    yAxis.setAttribute('y1', 0);
    yAxis.setAttribute('x2', 0);
    yAxis.setAttribute('y2', chartHeight);
    yAxis.setAttribute('class', 'axis');
    g.appendChild(yAxis);
}