/**
 * Format XP value to appropriate unit (KB, MB, GB) - NEW FUNCTION ADDED
 * @param {number} xp - XP value in bytes
 * @returns {string} - Formatted XP string
 */
export function formatXP(xp) {
    if (xp >= 1000 * 1000 * 1000) {
        return (xp / (1000 * 1000 * 1000)).toFixed(2) + ' GB';
    } else if (xp >= 1000 * 1000) {
        return (xp / (1000 * 1000)).toFixed(2) + ' MB';
    } else if (xp >= 1000) {
        return (xp / 1000).toFixed(2) + ' KB';
    } else {
        return xp + ' B';
    }
}