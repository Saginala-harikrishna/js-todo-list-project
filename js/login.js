// login.js

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  if (!username) return;

  // Get existing user data or create new
  const allUsers = JSON.parse(localStorage.getItem('users') || '{}');

  // If user doesn't exist, create them
  if (!allUsers[username]) {
    allUsers[username] = []; // empty task list
    localStorage.setItem('users', JSON.stringify(allUsers));
  }

  // Set current logged in user
  localStorage.setItem('username', username);

  // Redirect
  window.location.href = 'dashboard.html';
});
