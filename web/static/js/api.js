// API and data handling functions

async function graphqlQuery(query, variables = {}) {
    try {
        console.log('Making GraphQL query:', query);
        
        const response = await fetch(CONFIG.GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${appState.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query,  }),
        });

        const data = await response.json();
        console.log('GraphQL response:', data);
        
        if (data.errors) {
            console.error('GraphQL errors:', data.errors);
        }
        
        return data;
    } catch (error) {
        console.error('GraphQL error:', error);
        return null;
    }
}

async function loadProfileData() {
    try {
        // Get user ID from JWT token (we know this works)
        const userId = getUserIdFromToken();
        console.log('User ID from token:', userId);
        
        if (!userId) {
            document.getElementById('loadingMessage').textContent = 'Error: Unable to get user ID';
            return;
        }

        // Set display name as User for now
        document.getElementById('userLogin').textContent = `User ${userId}`;

        // Try the correct GraphQL schema based on the project documentation
        // The project shows these exact query examples:
        
        // 1. Query user info (simple approach)
        const userQuery = `{
            user {
                id
                login
            }
        }`;
        
        const userData = await graphqlQuery(userQuery);
        console.log('User Query Response:', userData);
        
        if (userData?.data?.user?.[0]) {
            document.getElementById('userLogin').textContent = userData.data.user[0].login;
        }

        // 2. Query transactions - using the exact format from project documentation
        const transactionQuery = `{
            transaction(where: {type: {_eq: "xp"}}) {
                id
                type
                amount
                objectId
                userId
                createdAt
                path
            }
        }`;
        
        const transactionData = await graphqlQuery(transactionQuery);
        console.log('Transaction Query Response:', transactionData);

        // 3. Query progress - using project documentation format
        const progressQuery = `{
            progress {
                id
                userId
                objectId
                grade
                createdAt
                updatedAt
                path
            }
        }`;
        
        const progressData = await graphqlQuery(progressQuery);
        console.log('Progress Query Response:', progressData);

        // 4. Try result table as alternative
        const resultQuery = `{
            result {
                id
                objectId
                userId
                grade
                type
                createdAt
                updatedAt
                path
            }
        }`;
        
        const resultData = await graphqlQuery(resultQuery);
        console.log('Result Query Response:', resultData);

        // Filter data for the current user
        let userTransactions = [];
        let userProgress = [];

        if (transactionData?.data?.transaction) {
            userTransactions = transactionData.data.transaction.filter(t => 
                t.type === 'xp'
            );
        }

        if (progressData?.data?.progress) {
            userProgress = progressData.data.progress
        } else if (resultData?.data?.result) {
            userProgress = resultData.data.result
        }

        console.log('Filtered data:', {
            userTransactions: userTransactions.length,
            userProgress: userProgress.length
        });

        processProfileData(userTransactions, userProgress);
        
        document.getElementById('loadingMessage').classList.add('hidden');
        document.getElementById('profileContent').classList.remove('hidden');

    } catch (error) {
        console.error('Error loading profile data:', error);
        document.getElementById('loadingMessage').textContent = 'Error loading profile data: ' + error.message;
    }
}

// Helper function to extract user ID from JWT token
function getUserIdFromToken() {
    try {
        if (!appState.token) return null;
        
        // JWT tokens have 3 parts separated by dots
        const parts = appState.token.split('.');
        if (parts.length !== 3) return null;
        
        // Decode the payload (middle part)
        const payload = JSON.parse(atob(parts[1]));
        console.log('JWT Payload:', payload);
        
        // Look for user ID in common fields
        return payload.sub || payload.userId || payload.id || payload.user_id;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

function processProfileData(transactions, progress) {
    console.log('Processing data:', { transactions, progress });
    
    // Calculate total XP
    const totalXP = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    document.getElementById('totalXP').textContent = totalXP.toLocaleString();

    // Calculate current level
    const currentLevel = Math.floor(totalXP / CONFIG.XP_PER_LEVEL) + 1;
    document.getElementById('currentLevel').textContent = currentLevel;

    // Calculate projects completed
    const projectsCompleted = progress.filter(p => p.grade === 1).length;
    document.getElementById('projectsCompleted').textContent = projectsCompleted;

    // Calculate audit ratio
    const passedProjects = progress.filter(p => p.grade === 1).length;
    const totalProjects = progress.length;
    const auditRatio = totalProjects > 0 ? (passedProjects / totalProjects).toFixed(2) : '0.00';
    document.getElementById('auditRatio').textContent = auditRatio;

    // Generate charts
    generateXPChart(transactions);
    generateSuccessChart(progress);
}