import { createPieChartLegend, showNoDataMessage } from './chats.js';
import { createPieSlice } from './chats.js';
import { getUserIdFromToken } from '../utils/gerenateToken.js';
/**
 * Generate success rate pie chart
 * @param {Array} progress - Progress data
 */
export function generateSuccessChart(progress) {
    console.log('Raw progress data:', progress);
    console.log('First item:', progress[0]);
    console.log('Available properties:', progress.length > 0 ? Object.keys(progress[0]) : 'No items');
    console.log("Generating success chart with progress data:", progress);

    const svg = document.getElementById('successChart');
    if (!svg) {
        console.error("SVG element with id 'successChart' not found");
        return;
    }
    svg.innerHTML = '';

     // Option A: Filter out null grades and only count graded items
     console.log("Raw grades from progress:", progress.map(p => p.grade));

    const userId = getUserIdFromToken();

    const gradedItems = progress.filter(p => p.grade !== null && p.grade !== undefined );
    console.log("Filtered progress for current user:", gradedItems)
   
    const passed = gradedItems.filter(p =>  Number(p.grade )>= 1).length;
    const failed = gradedItems.filter(p =>  Number(p.grade) < 1).length;
    const total = passed + failed;
    document.getElementById("projectsCompleted").textContent = total;


    console.log(`Passed: ${passed}, Failed: ${failed}, Total: ${total}`);

    if (total === 0) {
        showNoDataMessage(svg, 'No project data available');
        return;
    }

    const width = 460;
    const height = 260;
    const radius = Math.min(width, height) / 2 - 30;
    const centerX = width / 2;
    const centerY = height / 2-20;

    const passedAngle = (passed / total) * 2 * Math.PI;
    const failedAngle = (failed / total) * 2 * Math.PI;

    console.log(`Passed angle: ${passedAngle}, Failed angle: ${failedAngle}`);

    // Create pie slices
    if (passed > 0) {
        const passedPath = createPieSlice(centerX, centerY, radius, 0, passedAngle);
        passedPath.setAttribute('fill', '#2196f3');
        passedPath.innerHTML = `<title>Passed: ${passed} (${(passed/total*100).toFixed(1)}%)</title>`;
        svg.appendChild(passedPath);

    }

    if (failed > 0) {
        const failedPath = createPieSlice(centerX, centerY, radius, passedAngle, passedAngle + failedAngle);
        failedPath.setAttribute('fill', 'red');
        failedPath.innerHTML = `<title>Failed: ${failed} (${(failed/total*100).toFixed(1)}%)</title>`;
        svg.appendChild(failedPath);
        console.log('added failed slice');
    }

    // Add legend

    try {
        createPieChartLegend(svg, width, height, passed, failed);
        console.log('Legend created successfully');

    } catch (error) {
        console.error('Error creating legend:', error);
    }
    console.log("SVG content after rendering:", svg.innerHTML);

}
