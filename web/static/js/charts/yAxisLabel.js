import { createSVGElement } from '../utils/elements.js';
import { formatXP } from '../utils/format.js';

/**
 * Add Y-axis labels with formatted XP values - NEW FUNCTION ADDED
 * @param {SVGElement} g - Group element
 * @param {number} chartHeight - Chart height
 * @param {number} maxXP - Maximum XP value
 */
export function addYAxisLabels(g, chartHeight, maxXP) {
    const tickCount = 5;
    for (let i = 0; i <= tickCount; i++) {
        const value = (maxXP / tickCount) * i;
        const y = chartHeight - (value / maxXP) * chartHeight;
        
        // Add tick mark
        const tick = createSVGElement('line');
        tick.setAttribute('x1', -5);
        tick.setAttribute('y1', y);
        tick.setAttribute('x2', 0);
        tick.setAttribute('y2', y);
        tick.setAttribute('class', 'axis');
        g.appendChild(tick);
        
        // Add label
        const label = createSVGElement('text');
        label.setAttribute('x', -10);
        label.setAttribute('y', y + 4);
        label.setAttribute('text-anchor', 'end');
        label.setAttribute('class', 'axis-text');
        label.textContent = formatXP(value);
        g.appendChild(label);
    }
}

/**
 * Add axis label
 * @param {SVGElement} g - Group element
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} text - Label text
 */
export function addAxisLabel(g, x, y, text) {
    const label = createSVGElement('text');
    label.setAttribute('x', x);
    label.setAttribute('y', y);
    label.setAttribute('class', 'axis-text');
    label.textContent = text;
    g.appendChild(label);
}
