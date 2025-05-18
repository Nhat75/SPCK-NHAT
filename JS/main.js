// Global variables
let foodStores = [];
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || {};
const reviews = {
  "Phở Bò Phú Gia": [
    { user: "Minh Nguyen", rating: 5, text: "Phở rất ngon, nước dùng đậm đà, phục vụ nhanh chóng!", date: "2024-06-01" },
    { user: "Lan Tran", rating: 4, text: "Không gian sạch sẽ, giá hợp lý, sẽ quay lại!", date: "2024-06-02" }
  ],
  "Bò Kho Gánh": [
    { user: "Huy Hoang", rating: 5, text: "Bò kho mềm, thơm, ăn cùng bánh mì tuyệt vời!", date: "2024-06-01" },
    { user: "Thu Le", rating: 4, text: "Món ăn ngon, phục vụ thân thiện.", date: "2024-06-03" }
  ],
  "Bánh Xèo Tôm Nhảy Cô Ba": [
    { user: "Quang Vu", rating: 5, text: "Bánh xèo giòn, tôm tươi, nước chấm đậm vị!", date: "2024-06-01" },
    { user: "My Pham", rating: 4, text: "Không gian rộng rãi, món ăn chất lượng.", date: "2024-06-04" }
  ],
  "Le Beaulieu": [
    { user: "Pierre D.", rating: 5, text: "Ẩm thực Pháp chuẩn vị, không gian sang trọng.", date: "2024-06-01" },
    { user: "Mai Anh", rating: 4, text: "Phục vụ chuyên nghiệp, món ăn ngon.", date: "2024-06-05" }
  ],
  "Aira Sky Bar & Restaurant": [
    { user: "Long Bui", rating: 5, text: "View đẹp, món ăn đa dạng, cocktail tuyệt vời!", date: "2024-06-01" },
    { user: "Trang Nguyen", rating: 4, text: "Không gian lãng mạn, giá hợp lý.", date: "2024-06-06" }
  ]
};

// ======= KHỞI TẠO ỨNG DỤNG (INIT APP) =======
// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  await loadFoodStores();
  updateAuthUI();
  
  // Initialize page-specific functionality
  const currentPage = window.location.pathname.split('/').pop();
  switch(currentPage) {
    case 'main.html':
    case 'index.html':
      updateHeroStats();
      populateFilters();
      displayFoodShops();
      displayPopularDishes();
      break;
    case 'shop-detail.html':
      showShopDetail();
      break;
    case 'food-shops.html':
      populateFilters();
      displayFoodShops();
      break;
  }
});

// Load food stores from JSON file
async function loadFoodStores() {
  try {
    const response = await fetch('../JS/food_stores.json');
    const data = await response.json();
    foodStores = data.foodStores || [];
    console.log('Loaded food stores:', foodStores); // Debug log
  } catch (error) {
    console.error('Error loading food stores:', error);
    showToast('Error loading food stores data', 'error');
  }
}

// Update hero section statistics
function updateHeroStats() {
  const totalShops = foodStores.length;
  // Find the best-rated restaurant
  let phone = '';
  if (foodStores.length > 0) {
    const best = [...foodStores].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))[0];
    phone = best.phone || '';
  }
  const totalCities = new Set(foodStores.map(shop => shop.city)).size;

  document.getElementById('total-shops').textContent = totalShops;
  document.getElementById('hero-phone').textContent = phone;
  document.getElementById('total-cities').textContent = totalCities;
}

// Populate filter dropdowns
function populateFilters() {
  const cities = [...new Set(foodStores.map(shop => shop.city))];
  const cuisines = [...new Set(foodStores.map(shop => shop.cuisine))];
  
  const cityFilter = document.getElementById('city-filter');
  const cuisineFilter = document.getElementById('cuisine-filter');
  const priceFilter = document.getElementById('price-filter');

  if (cityFilter) {
    cityFilter.innerHTML = '<option value="">All Cities</option>';
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      cityFilter.appendChild(option);
    });
  }

  if (cuisineFilter) {
    cuisineFilter.innerHTML = '<option value="">All Cuisines</option>';
    cuisines.forEach(cuisine => {
      const option = document.createElement('option');
      option.value = cuisine;
      option.textContent = cuisine;
      cuisineFilter.appendChild(option);
    });
  }

  if (priceFilter) {
    priceFilter.innerHTML = `
      <option value="">All Prices</option>
      <option value="₫">Budget</option>
      <option value="₫₫">Moderate</option>
      <option value="₫₫₫">Luxury</option>
    `;
  }

  // Add event listeners
  if (cityFilter) cityFilter.onchange = filterShops;
  if (cuisineFilter) cuisineFilter.onchange = filterShops;
  if (priceFilter) priceFilter.onchange = filterShops;
}

// Display food shops in the grid
function displayFoodShops(filteredShops = foodStores) {
  const shopGrid = document.getElementById('shop-grid');
  const shopLoginMessage = document.getElementById('shop-login-message');
  if (!shopGrid || !shopLoginMessage) return;
  if (!currentUser) {
    shopLoginMessage.style.display = 'block';
    shopGrid.style.display = 'none';
    return;
  } else {
    shopLoginMessage.style.display = 'none';
    shopGrid.style.display = 'grid';
  }
  shopGrid.innerHTML = '';
  if (filteredShops.length === 0) {
    shopGrid.innerHTML = '<p class="no-shops">No restaurants found matching your criteria.</p>';
    return;
  }
  filteredShops.forEach(shop => {
    const shopCard = document.createElement('div');
    shopCard.className = 'shop-card';
    const imageUrl = shop.image && shop.image.trim() !== '' ? shop.image : 'https://via.placeholder.com/400x200?text=Store+Image';
    shopCard.innerHTML = `
      <div class="shop-image">
        <img src="${imageUrl}" alt="${shop.restaurant_name}">
      </div>
      <div class="shop-content">
        <h3>${shop.restaurant_name}</h3>
        <div class="shop-info">
          <p><i class="fas fa-map-marker-alt"></i> ${shop.address ? shop.address + ', ' : ''}${shop.district}, ${shop.city}</p>
          <p><i class="fas fa-utensils"></i> ${shop.cuisine}</p>
          <p><i class="fas fa-dollar-sign"></i> ${shop.price_range}</p>
          <div class="rating">
            <span>${shop.rating}</span>
            <i class="fas fa-star"></i>
          </div>
        </div>
        <p class="shop-description">${shop.description}</p>
        <button onclick="showShopDetail('${shop.restaurant_name}')" class="view-details-btn">
          View Details
        </button>
        <button class="booking-btn" onclick="openMainBookingModal('${shop.restaurant_name}')">Book Now</button>
      </div>
    `;
    shopGrid.appendChild(shopCard);
  });
}

// Filter shops based on selected criteria
function filterShops() {
  const city = document.getElementById('city-filter')?.value || '';
  const cuisine = document.getElementById('cuisine-filter')?.value || '';
  const price = document.getElementById('price-filter')?.value || '';

  const filteredShops = foodStores.filter(shop =>
    (!city || shop.city === city) &&
    (!cuisine || shop.cuisine === cuisine) &&
    (!price || shop.price_range === price)
  );

  displayFoodShops(filteredShops);
}

// Show shop details
function showShopDetail(shopName) {
  if (!currentUser) {
    document.getElementById('shop-login-message').style.display = 'block';
    document.getElementById('shop-detail-content').style.display = 'none';
    showToast('Please login to view restaurant details', 'error');
    showSection('login-section');
    return;
  } else {
    document.getElementById('shop-login-message').style.display = 'none';
    document.getElementById('shop-detail-content').style.display = 'block';
  }
  const shop = foodStores.find(s => s.restaurant_name === shopName);
  if (!shop) {
    showToast('Restaurant not found', 'error');
    return;
  }
  document.getElementById('detail-name').textContent = shop.restaurant_name;
  document.getElementById('detail-location').textContent = `${shop.district}, ${shop.city}`;
  document.getElementById('detail-cuisine').textContent = shop.cuisine;
  document.getElementById('detail-price').textContent = shop.price_range;
  document.getElementById('detail-rating').textContent = shop.rating;
  // Display menu
  const dishesList = document.getElementById('shop-dishes-list');
  if (dishesList) {
    dishesList.innerHTML = '';
    if (shop.dishes && shop.dishes.length > 0) {
      shop.dishes.forEach(dish => {
        const dishCard = document.createElement('div');
        dishCard.className = 'dish-card';
        dishCard.innerHTML = `
          <img src="${dish.image}" alt="${dish.name}">
          <div class="dish-info">
            <h3>${dish.name}</h3>
            <p>${dish.description}</p>
            <span class="price">${dish.price}</span>
          </div>
        `;
        dishesList.appendChild(dishCard);
      });
    } else {
      dishesList.innerHTML = '<p>No menu available.</p>';
    }
  }
  // Show booking and review form only if logged in
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) reviewForm.style.display = currentUser ? 'block' : 'none';
  // Show the shop detail section
  showSection('shop-detail-section');
}

// Display reviews for a shop
function displayReviews(shopName) {
  const reviewsList = document.getElementById('reviews-list');
  if (!reviewsList) return;

  reviewsList.innerHTML = '';
  const shopReviews = reviews[shopName] || [];
  
  if (shopReviews.length === 0) {
    reviewsList.innerHTML = '<p>No reviews yet.</p>';
    return;
  }

  shopReviews.forEach(review => {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-card';
    reviewElement.innerHTML = `
      <div class="review-header">
        <span class="reviewer">${review.user}</span>
        <div class="review-rating">
          ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
        </div>
      </div>
      <p class="review-text">${review.text}</p>
      <span class="review-date">${review.date}</span>
    `;
    reviewsList.appendChild(reviewElement);
  });
}

// Handle review submission
function submitReview(event) {
  event.preventDefault();
  if (!currentUser) {
    showToast('Please login to submit a review', 'error');
    return;
  }

  const shopName = decodeURIComponent(new URLSearchParams(window.location.search).get('name') || '');
  const rating = document.getElementById('review-rating').value;
  const text = document.getElementById('review-text').value;

  if (!rating || !text) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  if (!reviews[shopName]) {
    reviews[shopName] = [];
  }

  reviews[shopName].push({
    user: currentUser,
    rating: parseInt(rating),
    text: text,
    date: new Date().toISOString().split('T')[0]
  });

  document.getElementById('review-form').reset();
  displayReviews(shopName);
  showToast('Review submitted successfully', 'success');
}

// Show/hide sections
function showSection(sectionId) {
  const sections = ['home-section', 'login-section', 'register-section', 'food-shops-section', 'shop-detail-section', 'booking-history-section'];
  sections.forEach(section => {
    const element = document.getElementById(section);
    if (element) {
      element.style.display = section === sectionId ? 'block' : 'none';
    }
  });
  if (sectionId === 'booking-history-section') {
    displayBookingHistory();
  } else {
    document.getElementById('booking-history-section').style.display = 'none';
  }
}

// Show toast notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Login function
function login(event) {
  event.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const emailError = document.getElementById('login-email-error');
  const passwordError = document.getElementById('login-password-error');
  
  // Reset errors
  emailError.textContent = '';
  passwordError.textContent = '';
  
  // Validate email
  if (!isValidEmail(email)) {
    emailError.textContent = 'Please enter a valid email address';
    return;
  }
  
  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Store current user
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Update UI
    updateAuthUI();
    
    // Show success message
    showToast('Login successful!');
    
    // Redirect to home
    showSection('home-section');
  } else {
    passwordError.textContent = 'Invalid email or password';
  }
}

// Handle logout
function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateAuthUI();
  showSection('home-section');
  showToast('Logged out successfully', 'success');
}

// Register function
function register(event) {
  event.preventDefault();
  
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
    return;
  }
  
  // Validate email
  if (!isValidEmail(email)) {
    emailError.textContent = 'Please enter a valid email address';
    return;
  }
  
  // Validate password
  if (password.length < 6) {
    passwordError.textContent = 'Password must be at least 6 characters long';
    return;
  }
  
  // Validate confirm password
  if (password !== confirmPassword) {
    confirmPasswordError.textContent = 'Passwords do not match';
    return;
  }
  
  // Get existing users
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Check if email already exists
  if (users.some(user => user.email === email)) {
    emailError.textContent = 'Email already registered';
    return;
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
  
  // Store current user
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  // Update UI
  updateAuthUI();
  
  // Show success message
  showToast('Registration successful!');
  
  // Redirect to home
  showSection('home-section');
}

// Show error message
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

// Clear all error messages
function clearErrors(formType) {
  const errorElements = document.querySelectorAll(`#${formType}-form .error`);
  errorElements.forEach(element => {
    element.textContent = '';
  });
}

// Update authentication UI elements
function updateAuthUI() {
  const authButtons = document.getElementById('auth-buttons');
  const userInfo = document.getElementById('user-info');
  const userEmail = document.getElementById('user-email');
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (currentUser) {
    authButtons.style.display = 'none';
    userInfo.style.display = 'flex';
    userEmail.textContent = currentUser.email;
  } else {
    authButtons.style.display = 'flex';
    userInfo.style.display = 'none';
  }
  const bookingHistoryLink = document.getElementById('booking-history-link');
  if (currentUser && bookingHistoryLink) {
    bookingHistoryLink.style.display = 'inline';
  } else if (bookingHistoryLink) {
    bookingHistoryLink.style.display = 'none';
  }
}

// Check for existing user session on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = savedUser;
    updateAuthUI();
  }
});

// Handle booking
function handleBooking(event) {
  event.preventDefault();
  if (!currentUser) {
    showToast('Please login to make a booking', 'error');
    return;
  }

  const date = document.getElementById('booking-date').value;
  const time = document.getElementById('booking-time').value;
  const guests = document.getElementById('booking-guests').value;

  if (!date || !time || !guests) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  showToast('Booking submitted successfully', 'success');
  document.getElementById('booking-form').reset();
}

// Add function to display booking history
function displayBookingHistory() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const bookingHistoryList = document.getElementById('booking-history-list');
  if (!bookingHistoryList) return;
  if (!currentUser) {
    bookingHistoryList.innerHTML = '<p>You must be logged in to view your booking history.</p>';
    return;
  }
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const userBookings = bookings.filter(b => b.user === currentUser.username || b.user === currentUser.email);
  if (userBookings.length === 0) {
    bookingHistoryList.innerHTML = '<p>No bookings found.</p>';
    return;
  }
  bookingHistoryList.innerHTML = userBookings.map(b => {
    // Find the restaurant's phone number
    const shop = foodStores.find(s => s.restaurant_name === b.restaurant);
    const phone = shop && shop.phone ? shop.phone : 'N/A';
    return `
      <div class="booking-item" style="background:#f8f9fa;padding:12px;border-radius:6px;margin-bottom:10px;">
        <b>Restaurant:</b> ${b.restaurant}<br>
        <b>Phone Number:</b> ${phone}<br>
        <b>Details:</b> ${b.details}
      </div>
    `;
  }).join('');
}

// Modal helpers
function openMainBookingModal(restaurantName) {
  const modal = document.getElementById('main-booking-modal');
  const overlay = document.getElementById('main-booking-overlay');
  const form = document.getElementById('main-booking-form');
  const feedback = document.getElementById('booking-feedback');
  const loading = document.getElementById('booking-loading');
  document.getElementById('main-booking-restaurant').value = restaurantName;
  modal.classList.add('active');
  modal.style.display = 'flex';
  feedback.style.display = 'none';
  loading.style.display = 'none';
  setTimeout(() => {
    document.getElementById('main-booking-date').focus();
  }, 100);
  // Close on overlay click
  overlay.onclick = function(e) {
    if (e.target === overlay) closeMainBookingModal();
  };
  // Close on Esc
  document.onkeydown = function(e) {
    if (e.key === 'Escape') closeMainBookingModal();
  };
}
function closeMainBookingModal() {
  const modal = document.getElementById('main-booking-modal');
  modal.classList.remove('active');
  modal.style.display = 'none';
  document.onkeydown = null;
}
document.getElementById('close-main-booking-modal').onclick = closeMainBookingModal;
// Booking form submit
const mainBookingForm = document.getElementById('main-booking-form');
if (mainBookingForm) {
  mainBookingForm.onsubmit = async function(e) {
    e.preventDefault();
    const loading = document.getElementById('booking-loading');
    const feedback = document.getElementById('booking-feedback');
    loading.style.display = 'block';
    feedback.style.display = 'none';
    // Get phone number
    const phone = document.getElementById('main-booking-phone').value;
    // Simulate async booking
    setTimeout(() => {
      loading.style.display = 'none';
      feedback.style.display = 'block';
      feedback.style.color = '#27ae60';
      feedback.textContent = 'Booking successful!';
      mainBookingForm.reset();
      setTimeout(closeMainBookingModal, 1200);
      // Save booking with phone number (if you store bookings)
      // Example:
      // const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      // bookings.push({ user: currentUser, phone });
      // localStorage.setItem('bookings', JSON.stringify(bookings));
    }, 900);
  };
}

// Display popular dishes
function displayPopularDishes() {
  const topDishes = foodStores.slice(0, 5); // Assuming the first 5 shops are the most popular
  const dishesGrid = document.getElementById('popular-dishes');
  if (!dishesGrid) return;
  dishesGrid.innerHTML = '';
  if (topDishes.length === 0) {
    dishesGrid.innerHTML = '<p>No popular dishes found.</p>';
    return;
  }
  topDishes.forEach(dish => {
    const dishCard = document.createElement('div');
    dishCard.className = 'dish-card';
    dishCard.innerHTML = `
      <span class="dish-badge">Món ăn nổi bật</span>
      <div class="dish-image">
        <img src="${dish.image}" alt="${dish.name}">
        <div class="dish-overlay">
          <span class="restaurant-name">${dish.restaurant}</span>
        </div>
      </div>
      <div class="dish-info">
        <h3>${dish.name}</h3>
        <p>${dish.description}</p>
        <div class="dish-meta">
          <span class="price">${dish.price}</span>
          <a href="#" class="view-restaurant-btn" onclick="showShopDetail('${dish.restaurant}')">
            <i class="fas fa-utensils"></i> View Restaurant
          </a>
        </div>
      </div>
    `;
    dishesGrid.appendChild(dishCard);
  });
} 