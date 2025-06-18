import { createSVGElement } from '../utils/elements.js';

/**
 * Draw XP progress line
 * @param {SVGElement} g - Group element
 * @param {Array} chartData - Chart data
 * @param {Function} xScale - X scale function
 * @param {Function} yScale - Y scale function
 */
export function drawXPLine(g, chartData, xScale, yScale) {
    const pathData = chartData.map((d, i) => 
        `${i === 0 ? 'M' : 'L'} ${xScale(d.date)} ${yScale(d.xp)}`
    ).join(' ');

    const path = createSVGElement('path');
    path.setAttribute('d', pathData);
    path.setAttribute('class', 'line');
    g.appendChild(path);
}