// Configuration settings
const CONFIG = {
    GRAPHQL_ENDPOINT: 'https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql',
    SIGNIN_ENDPOINT: 'https://learn.zone01kisumu.ke/api/auth/signin',
    XP_PER_LEVEL: 1000
};

// Application state
let appState = {
    token: null,
    userData: null
};