/**
 * Handle user login
 * @param {Event} e - Form submit event
 */

import { CONFIG } from './config.js';
import { appState } from './config.js';
import { loadProfileData } from './api.js';
export async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Create Basic Auth header
        const credentials = btoa(`${username}:${password}`);
        
        const response = await fetch(CONFIG.SIGNIN_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const token = await response.json();
            appState.token = token;
            sessionStorage.setItem('jwt', token);
            hideError();
            showProfile();
            await loadProfileData();
        } else {
            showError('Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Connection error. Please try again.');
    }
}

/**
 * Handle user logout
 */
export function handleLogout() {
    appState.token = null;
    appState.userData = null;
    sessionStorage.removeItem('jwt');
    showLogin();
    document.getElementById('loginForm').reset();
}

/**
 * Check if user is already authenticated
 */
export function checkExistingAuth() {
    const token = sessionStorage.getItem('jwt');
    if (token) {
        appState.token = token;
        showProfile();
        loadProfileData();
    }
}

/**
 * Show login page
 */
function showLogin() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('profilePage').classList.add('hidden');
}

/**
 * Show profile page
 */
function showProfile() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('profilePage').classList.remove('hidden');
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

/**
 * Hide error message
 */
function hideError() {
    document.getElementById('errorMessage').classList.add('hidden');
}