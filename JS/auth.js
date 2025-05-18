// Authentication functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function login(event) {
  event.preventDefault();
  console.log('Login function called'); // Debug log
  
  const username = document.getElementById('login-username').value;
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const usernameError = document.getElementById('login-username-error');
  const emailError = document.getElementById('login-email-error');
  const passwordError = document.getElementById('login-password-error');
  
  // Reset errors
  usernameError.textContent = '';
  emailError.textContent = '';
  passwordError.textContent = '';
  
  // Validate username
  if (!username || username.length < 3) {
    usernameError.textContent = 'Please enter a valid username (at least 3 characters)';
    return false;
  }
  // Validate email
  if (!isValidEmail(email)) {
    emailError.textContent = 'Please enter a valid email address';
    return false;
  }
  
  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];
  console.log('Users from localStorage:', users); // Debug log
  
  // Find user by username, email, and password
  const user = users.find(u => u.username === username && u.email === email && u.password === password);
  
  if (user) {
    // Store current user
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Update UI
    updateAuthUI();
    
    // Show success message
    showToast('Login successful!', 'success');
    
    // Redirect to home
    showSection('home-section');
    return true;
  } else {
    passwordError.textContent = 'Invalid username, email, or password';
    return false;
  }
}

function register(event) {
  event.preventDefault();
  console.log('Register function called'); // Debug log
  
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  
  const usernameError = document.getElementById('register-username-error');
  const emailError = document.getElementById('register-email-error');
  const passwordError = document.getElementById('register-password-error');
  const confirmPasswordError = document.getElementById('register-confirm-password-error');
  
  // Reset errors
  usernameError.textContent = '';
  emailError.textContent = '';
  passwordError.textContent = '';
  confirmPasswordError.textContent = '';
  
  // Validate username
  if (username.length < 3) {
    usernameError.textContent = 'Username must be at least 3 characters long';
    return false;
  }
  
  // Validate email
  if (!isValidEmail(email)) {
    emailError.textContent = 'Please enter a valid email address';
    return false;
  }
  
  // Validate password
  if (password.length < 6) {
    passwordError.textContent = 'Password must be at least 6 characters long';
    return false;
  }
  
  // Validate confirm password
  if (password !== confirmPassword) {
    confirmPasswordError.textContent = 'Passwords do not match';
    return false;
  }
  
  // Get existing users
  const users = JSON.parse(localStorage.getItem('users')) || [];
  console.log('Existing users:', users); // Debug log
  
  // Check if email already exists
  if (users.some(user => user.email === email)) {
    emailError.textContent = 'Email already registered';
    return false;
  }
  
  // Create new user
  const newUser = {
    username,
    email,
    password,
    reviews: []
  };
  
  // Add to users array
  users.push(newUser);
  
  // Save to localStorage
  localStorage.setItem('users', JSON.stringify(users));
  console.log('Updated users:', users); // Debug log
  
  // Store current user
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  // Update UI
  updateAuthUI();
  
  // Show success message
  showToast('Registration successful!', 'success');
  
  // Redirect to home
  showSection('home-section');
  return true;
}

function logout() {
  localStorage.removeItem('currentUser');
  updateAuthUI();
  showSection('home-section');
  showToast('Logged out successfully', 'success');
}

function updateAuthUI() {
  const authButtons = document.getElementById('auth-buttons');
  const userInfo = document.getElementById('user-info');
  const userEmail = document.getElementById('user-email');
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  console.log('Current user:', currentUser); // Debug log
  
  if (currentUser) {
    authButtons.style.display = 'none';
    userInfo.style.display = 'flex';
    userEmail.textContent = currentUser.email;
  } else {
    authButtons.style.display = 'flex';
    userInfo.style.display = 'none';
  }
}

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
}); 