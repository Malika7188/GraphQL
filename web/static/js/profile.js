import { generateSuccessChart } from './charts/successChart.js';
import { calculateAuditRatio } from './api.js';
import { formatXP } from './utils/format.js';
import { generateXPChart } from './charts/xpChart.js';

export function processProfileData(transactions, progress) {
    console.log('Processing data:', { 
        transactions: transactions.length,
        progress: progress.length,
        transactionsSample: transactions.slice(0, 3),
        progressSample: progress.slice(0, 3)
     });

     if (!Array.isArray(transactions)) {
        console.error('Transactions is not an array:', transactions);
        transactions = [];
    }
    
    if (!Array.isArray(progress)) {
        console.error('Progress is not an array:', progress);
        progress = [];
    }

    const xpTransactions = transactions.filter(t => t.type === 'xp');
    const upTransactions = transactions.filter(t => t.type === 'up');
    const downTransactions = transactions.filter(t => t.type === 'down');

    console.log('Transactions:', {
        // total: transactions.length,
        xp: xpTransactions.length,
        up: upTransactions.length,
        down: downTransactions.length
    });

    const totalXP = xpTransactions.reduce((sum, t) => {
        const amount = parseFloat(t.amount) || 0;
        return sum + amount;
    }, 0);

    const totalXPElement = document.getElementById('totalXP');
    if (totalXPElement) {
        totalXPElement.textContent = formatXP(totalXP);
    }
    
    const xpPerLevel = (typeof CONFIG !== 'undefined' && CONFIG.XP_PER_LEVEL) ? CONFIG.XP_PER_LEVEL : 1000;
    const currentLevel = Math.floor(totalXP / xpPerLevel) + 1;
    
    const currentLevelElement = document.getElementById('currentLevel');
    if (currentLevelElement) {
        currentLevelElement.textContent = currentLevel;
    }

    // Calculate projects completed
    const projectsCompleted = progress.filter(p => p && p.grade === 1).length;
    
    const projectsCompletedElement = document.getElementById('projectsCompleted');
    if (projectsCompletedElement) {
        projectsCompletedElement.textContent = projectsCompleted;
    }

    // Calculate audit ratio from up/down transactions
    const auditRatio = calculateAuditRatio(upTransactions, downTransactions);
    
    const auditRatioElement = document.getElementById('auditRatio');
    if (auditRatioElement) {
        auditRatioElement.textContent = auditRatio;
    }

    // Generate charts - FIXED: Add safety checks
    try {
        if (typeof generateXPChart === 'function') {
            generateXPChart(xpTransactions);
        } else {
            console.warn('generateXPChart function not found');
        }
        
        if (typeof generateSuccessChart === 'function') {
            generateSuccessChart(progress);
        } else {
            console.warn('generateSuccessChart function not found');
        }
        
        if (typeof generateAuditChart === 'function') {
            generateAuditChart(upTransactions, downTransactions);
        } else {
            console.warn('generateAuditChart function not found');
        }
    } catch (chartError) {
        console.error('Error generating charts:', chartError);
    }
}