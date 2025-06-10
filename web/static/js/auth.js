// Login Function
async function login(usernameOrEmail, password) {
  const credentials = btoa(`${usernameOrEmail}:${password}`);
  const response = await fetch('https://DOMAIN/api/auth/signin', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${credentials}` }
  });

  if (response.ok) {
    const { token } = await response.json();
    localStorage.setItem('jwt', token);
    return token;
  } else {
    throw new Error('Invalid credentials');
  }
}


async function fetchGraphQL(query, variables = {}) {
  const token = localStorage.getItem('jwt');
  const response = await fetch('https://DOMAIN/api/graphql-engine/v1/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });
  return response.json();
}

// Logout
function logout() {
  localStorage.removeItem('jwt');
  window.location.reload();
}