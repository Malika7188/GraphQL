
import { addYAxisLabels, addAxisLabel} from './yAxisLabel.js';
import { drawAxes } from './drawAxes.js';
import { drawXPLine } from './drawXPline.js';
import { createSVGElement } from '../utils/elements.js';
import { showNoDataMessage } from './chats.js';
import { drawXPDots } from './chats.js';
/**
 * Generate XP progress chart
 * @param {Array} transactions - XP transaction data
 */
export function generateXPChart(transactions) {
    const svg = document.getElementById('xpChart');
    svg.innerHTML = '';

    if (transactions.length === 0) {
        showNoDataMessage(svg, 'No XP data available');
        return;
    }

    const width = 460;
    const height = 260;
    const margin = { top: 20, right: 20, bottom: 40, left: 80 }; // CHANGED: Increased left margin from 60 to 80
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
    
    // ADDED: Add Y-axis labels with proper MB formatting
    addYAxisLabels(g, chartHeight, maxXP);

    // Draw line
    if (chartData.length > 1) {
        drawXPLine(g, chartData, xScale, yScale);
    }

    // Draw dots
    drawXPDots(g, chartData, xScale, yScale);

    // Add labels
    addAxisLabel(g, -80, 15, 'XP'); // CHANGED: Moved from 20 to -50 to accommodate wider margin

    svg.appendChild(g);
}