// Chart generation functions

/**
 * Generate XP progress chart
 * @param {Array} transactions - XP transaction data
 */
function generateXPChart(transactions) {
    const svg = document.getElementById('xpChart');
    svg.innerHTML = '';

    if (transactions.length === 0) {
        showNoDataMessage(svg, 'No XP data available');
        return;
    }

    const width = 460;
    const height = 260;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Process data for cumulative XP
    let cumulativeXP = 0;
    const chartData = transactions.map(t => {
        cumulativeXP += t.amount;
        return {
            date: new Date(t.createdAt),
            xp: cumulativeXP
        };
    });

    const maxXP = Math.max(...chartData.map(d => d.xp));
    const minDate = Math.min(...chartData.map(d => d.date));
    const maxDate = Math.max(...chartData.map(d => d.date));

    // Create scales
    const xScale = (date) => ((date - minDate) / (maxDate - minDate)) * chartWidth;
    const yScale = (xp) => chartHeight - (xp / maxXP) * chartHeight;

    // Create chart group
    const g = createSVGElement('g');
    g.setAttribute('transform', `translate(${margin.left}, ${margin.top})`);

    // Draw axes
    drawAxes(g, chartWidth, chartHeight);

    // Draw line
    if (chartData.length > 1) {
        drawXPLine(g, chartData, xScale, yScale);
    }

    // Draw dots
    drawXPDots(g, chartData, xScale, yScale);

    // Add labels
    addAxisLabel(g, 20, 15, 'XP');

    svg.appendChild(g);
}

/**
 * Generate success rate pie chart
 * @param {Array} progress - Progress data
 */
function generateSuccessChart(progress) {
    const svg = document.getElementById('successChart');
    svg.innerHTML = '';

    const passed = progress.filter(p => p.grade === 1).length;
    const failed = progress.filter(p => p.grade === 0).length;
    const total = passed + failed;

    if (total === 0) {
        showNoDataMessage(svg, 'No project data available');
        return;
    }

    const width = 460;
    const height = 260;
    const radius = Math.min(width, height) / 2 - 20;
    const centerX = width / 2;
    const centerY = height / 2;

    const passedAngle = (passed / total) * 2 * Math.PI;
    const failedAngle = (failed / total) * 2 * Math.PI;

    // Create pie slices
    if (passed > 0) {
        const passedPath = createPieSlice(centerX, centerY, radius, 0, passedAngle);
        passedPath.setAttribute('fill', '#48bb78');
        passedPath.innerHTML = `<title>Passed: ${passed} (${(passed/total*100).toFixed(1)}%)</title>`;
        svg.appendChild(passedPath);
    }

    if (failed > 0) {
        const failedPath = createPieSlice(centerX, centerY, radius, passedAngle, passedAngle + failedAngle);
        failedPath.setAttribute('fill', '#f56565');
        failedPath.innerHTML = `<title>Failed: ${failed} (${(failed/total*100).toFixed(1)}%)</title>`;
        svg.appendChild(failedPath);
    }

    // Add legend
    createPieChartLegend(svg, width, height, passed, failed);
}

/**
 * Create pie slice path
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 * @param {number} radius - Pie radius
 * @param {number} startAngle - Start angle in radians
 * @param {number} endAngle - End angle in radians
 * @returns {SVGElement} - Path element
 */
function createPieSlice(centerX, centerY, radius, startAngle, endAngle) {
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
 * Create SVG element
 * @param {string} tag - SVG tag name
 * @returns {SVGElement} - Created SVG element
 */
function createSVGElement(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

/**
 * Show no data message
 * @param {SVGElement} svg - SVG container
 * @param {string} message - Message to display
 */
function showNoDataMessage(svg, message) {
    const text = createSVGElement('text');
    text.setAttribute('x', '50%');
    text.setAttribute('y', '50%');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'axis-text');
    text.textContent = message;
    svg.appendChild(text);
}

/**
 * Draw chart axes
 * @param {SVGElement} g - Group element
 * @param {number} chartWidth - Chart width
 * @param {number} chartHeight - Chart height
 */
function drawAxes(g, chartWidth, chartHeight) {
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

/**
 * Draw XP progress line
 * @param {SVGElement} g - Group element
 * @param {Array} chartData - Chart data
 * @param {Function} xScale - X scale function
 * @param {Function} yScale - Y scale function
 */
function drawXPLine(g, chartData, xScale, yScale) {
    const pathData = chartData.map((d, i) => 
        `${i === 0 ? 'M' : 'L'} ${xScale(d.date)} ${yScale(d.xp)}`
    ).join(' ');

    const path = createSVGElement('path');
    path.setAttribute('d', pathData);
    path.setAttribute('class', 'line');
    g.appendChild(path);
}

/**
 * Draw XP progress dots
 * @param {SVGElement} g - Group element
 * @param {Array} chartData - Chart data
 * @param {Function} xScale - X scale function
 * @param {Function} yScale - Y scale function
 */
function drawXPDots(g, chartData, xScale, yScale) {
    chartData.forEach(d => {
        const circle = createSVGElement('circle');
        circle.setAttribute('cx', xScale(d.date));
        circle.setAttribute('cy', yScale(d.xp));
        circle.setAttribute('r', 4);
        circle.setAttribute('class', 'dot');
        circle.innerHTML = `<title>XP: ${d.xp}</title>`;
        g.appendChild(circle);
    });
}

/**
 * Add axis label
 * @param {SVGElement} g - Group element
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} text - Label text
 */
function addAxisLabel(g, x, y, text) {
    const label = createSVGElement('text');
    label.setAttribute('x', x);
    label.setAttribute('y', y);
    label.setAttribute('class', 'axis-text');
    label.textContent = text;
    g.appendChild(label);
}

/**
 * Create pie chart legend
 * @param {SVGElement} svg - SVG container
 * @param {number} width - Chart width
 * @param {number} height - Chart height
 * @param {number} passed - Number of passed projects
 * @param {number} failed - Number of failed projects
 */
function createPieChartLegend(svg, width, height, passed, failed) {
    const legend = createSVGElement('g');
    legend.setAttribute('transform', `translate(20, ${height - 40})`);

    // Passed legend
    createLegendItem(legend, 0, 0, '#48bb78', `Passed (${passed})`);
    
    // Failed legend
    createLegendItem(legend, 120, 0, '#f56565', `Failed (${failed})`);

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