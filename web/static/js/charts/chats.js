import { formatXP } from '../utils/format.js';
import { createSVGElement } from '../utils/elements.js';

/**
 Create pie slice path
  @param {number} centerX - Center X coordinate
  @param {number} centerY - Center Y coordinate
 * @param {number} radius - Pie radius
 * @param {number} startAngle - Start angle in radians
 * @param {number} endAngle - End angle in radians
 * @returns {SVGElement} - Path element
 */
export function createPieSlice(centerX, centerY, radius, startAngle, endAngle) {
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    const pathData = [
        "M", centerX, centerY,
        "L", x1, y1,
        "A", radius, radius, 0, largeArcFlag, 1, x2, y2,
        "Z"
    ].join(" ");

    const path = createSVGElement('path');
    path.setAttribute('d', pathData);
    return path;
}



/**
 * Show no data message
 * @param {SVGElement} svg - SVG container
 * @param {string} message - Message to display
 */
export function showNoDataMessage(svg, message) {
    const text = createSVGElement('text');
    text.setAttribute('x', '50%');
    text.setAttribute('y', '50%');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'axis-text');
    text.textContent = message;
    svg.appendChild(text);
}

/**
 * Draw XP progress dots
 * @param {SVGElement} g - Group element
 * @param {Array} chartData - Chart data
 * @param {Function} xScale - X scale function
 * @param {Function} yScale - Y scale function
 */
export function drawXPDots(g, chartData, xScale, yScale) {
    chartData.forEach(d => {
        const circle = createSVGElement('circle');
        circle.setAttribute('cx', xScale(d.date));
        circle.setAttribute('cy', yScale(d.xp));
        circle.setAttribute('r', 4);
        circle.setAttribute('class', 'dot');
        // CHANGED: Use formatted XP in tooltip instead of raw number
        circle.innerHTML = `<title>XP: ${formatXP(d.xp)}</title>`;
        g.appendChild(circle);
    });
}


/**
 * Create pie chart legend
 * @param {SVGElement} svg - SVG container
 * @param {number} width - Chart width
 * @param {number} height - Chart height
 * @param {number} passed - Number of passed projects
 * @param {number} failed - Number of failed projects
 */
export function createPieChartLegend(svg, width, height, passed, failed) {
    const legend = createSVGElement('g');

    const legendWidth = 180; 
    const legendX = (width - legendWidth) / 2;
    const legendY = height - 5; // 20px from the bottom
    // legend.setAttribute('transform', `translate(20, ${height - 10})`);
    legend.setAttribute('transform', `translate(${legendX}, ${legendY})`);

    // Passed legend
    createLegendItem(legend, 0, 0, '#2196f3', `Passed (${passed})`);
    createLegendItem(legend, 120, 0, 'red', `Failed (${failed})`);

    svg.appendChild(legend);
}

/**
 * Create legend item
 * @param {SVGElement} legend - Legend group element
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {string} color - Item color
 * @param {string} text - Item text
 */
function createLegendItem(legend, x, y, color, text) {
    const rect = createSVGElement('rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', 15);
    rect.setAttribute('height', 15);
    rect.setAttribute('fill', color);
    legend.appendChild(rect);

    const textElement = createSVGElement('text');
    textElement.setAttribute('x', x + 20);
    textElement.setAttribute('y', y + 12);
    textElement.setAttribute('class', 'axis-text');
    textElement.textContent = text;
    legend.appendChild(textElement);
}