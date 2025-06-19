// API and data handling functions
import { generateXPChart } from "./charts/xpChart.js";
import { generateSuccessChart } from "./charts/successChart.js";
import { appState } from "./config.js";
import { formatXP } from "./utils/format.js";
import { CONFIG } from "./config.js";
import { getUserIdFromToken } from "./utils/gerenateToken.js";

// Function to make GraphQL queries
async function graphqlQuery(query, variables = {}) {
  try {
    console.log("Making GraphQL query:", query);

    const response = await fetch(CONFIG.GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${appState.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    console.log("GraphQL response:", data);

    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
    }

    return data;
  } catch (error) {
    console.error("GraphQL error:", error);
    return null;
  }
}

export async function loadProfileData() {
  try {
    // Get user ID from JWT token (we know this works)
    const userId = getUserIdFromToken();
    console.log("User ID from token:", userId);

    if (!userId) {
      document.getElementById("loadingMessage").textContent =
        "Error: Unable to get user ID";
      return;
    }

    // Set display name as User for now
    document.getElementById("userLogin").textContent = `User ${userId}`;

    // 1. Query user info (simple approach)
    const userQuery = `{
            user {
                id
                login
                attrs
                auditRatio
                 events(where: {eventId: {_eq: 75}}) {
                  level
                 }
            }
        }`;

    const data = await graphqlQuery(userQuery);
    const userData = data.data.user[0] || {};
    console.log("User Query Response:", userData);

    if (userData) {
      document.getElementById("userLogin").textContent = userData.login;
      document.getElementById("auditRatio").textContent =
        userData.auditRatio.toFixed(2);
      document.getElementById("currentLevel").textContent =
        userData.events[0].level;
    }

    // 2. Query transactions - using the exact format from project documentation
    const transactionQuery = `{
            transaction(where: {_and: [{eventId: {_eq: 75}}]}, order_by: {createdAt: asc}) {
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
    console.log("Transaction Query Response:", transactionData);

    // 3. Query progress - using project documentation format
    const progressQuery = `{
            progress(where: {eventId: {_eq: 75}}) {
                id
                userId
                objectId
                grade
                createdAt
                updatedAt
                path
            }
        }`;
console.log("welcome to the progress query");

    const progressData = await graphqlQuery(progressQuery);
    console.log("Progress Query Response:", progressData);

    // 4. Try result table as alternative
    const resultQuery = `{
            result  (where: {eventId: {_eq: 75}}) {
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
    console.log("Result Query Response:", resultData);

    // After fetching all three: transactionData, progressData, resultData...
    let userTransactions = [];
    let userProgress = [];

    if (transactionData?.data?.transaction) {
      userTransactions = transactionData.data.transaction.filter(
        (t) => t.type === "xp"
      );
    }

    const progressList = progressData?.data?.progress || [];
    const resultList = resultData?.data?.result || [];

    //Filter for valid grades only
    const validProgress = progressList.filter(
      (p) => p.grade !== null && p.grade !== undefined
    );
    const validResult = resultList.filter(
      (r) => r.grade !== null && r.grade !== undefined
    );

    // Pick the list with more valid grades
    const selectedList =
      validProgress.length >= validResult.length ? progressList : resultList;

    //Filter only the current user's data
    userProgress = selectedList.filter(
      (p) => String(p.userId) === String(userId)
    );

    //Debug output (optional)
    console.log("User ID:", userId);
    console.log(
      "Selected source:",
      selectedList === progressList ? "progress" : "result"
    );
    console.log("User progress count:", userProgress.length);

    processProfileData(userTransactions, userProgress);

    document.getElementById("loadingMessage").classList.add("hidden");
    document.getElementById("profileContent").classList.remove("hidden");
  } catch (error) {
    console.error("Error loading profile data:", error);
    document.getElementById("loadingMessage").textContent =
      "Error loading profile data: " + error.message;
  }
}

function processProfileData(transactions, progress) {
  console.log("Processing data:", { transactions, progress });

  // Calculate total XP
  const totalXP = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  document.getElementById("totalXP").textContent = formatXP(totalXP);

 
  // Calculate audit ratio
  const passedProjects = progress.filter((p) => p.grade === 1).length;
  const totalProjects = progress.length;

  // Generate charts
  generateXPChart(transactions);
  generateSuccessChart(progress);
}
