// Main application initialization

function initApp() {
    setupEventListeners();
    checkExistingAuth();
}

function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);