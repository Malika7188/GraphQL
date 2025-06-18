import { createPieChartLegend, showNoDataMessage } from './chats.js';
import { createPieSlice } from './chats.js';
/**
 * Generate success rate pie chart
 * @param {Array} progress - Progress data
 */
export function generateSuccessChart(progress) {
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
