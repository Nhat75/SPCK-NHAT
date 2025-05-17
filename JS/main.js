// Global variables
let foodStores = [];
let currentUser = null;
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
    const response = await fetch('JS/food_stores.json');
    const data = await response.json();
    foodStores = data.foodStores || data;
  } catch (error) {
    console.error('Error loading food stores:', error);
    showToast('Error loading food stores data', 'error');
  }
}

// Update hero section statistics
function updateHeroStats() {
  const totalShops = foodStores.length;
  const avgRating = (foodStores.reduce((sum, shop) => sum + parseFloat(shop.rating), 0) / totalShops).toFixed(1);
  const totalCities = new Set(foodStores.map(shop => shop.city)).size;

  document.getElementById('total-shops').textContent = totalShops;
  document.getElementById('avg-rating').textContent = avgRating;
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
  if (!shopGrid) return;

  shopGrid.innerHTML = '';
  filteredShops.forEach(shop => {
    const shopCard = document.createElement('div');
    shopCard.className = 'shop-card';
    shopCard.innerHTML = `
      <div class="shop-image">
        <img src="${shop.image || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="${shop.restaurant_name}">
      </div>
      <h3>${shop.restaurant_name}</h3>
      <div class="shop-info">
        <p><i class="fas fa-map-marker-alt"></i> ${shop.district}, ${shop.city}</p>
        <p><i class="fas fa-utensils"></i> ${shop.cuisine}</p>
        <p><i class="fas fa-dollar-sign"></i> ${shop.price_range}</p>
        <div class="rating">
          <span>${shop.rating}</span>
          <i class="fas fa-star"></i>
        </div>
      </div>
      <a href="shop-detail.html?name=${encodeURIComponent(shop.restaurant_name)}" class="view-details-btn">
        View Details
      </a>
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

// Display popular dishes in the hero section
function displayPopularDishes() {
  const popularDishes = document.getElementById('popular-dishes');
  if (!popularDishes) return;

  const allDishes = foodStores.flatMap(shop => 
    (shop.dishes || []).map(dish => ({
      ...dish,
      restaurant: shop.restaurant_name
    }))
  );

  const randomDishes = allDishes
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  popularDishes.innerHTML = '';
  randomDishes.forEach(dish => {
    const dishCard = document.createElement('div');
    dishCard.className = 'dish-card';
    dishCard.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}">
      <div class="dish-info">
        <h3>${dish.name}</h3>
        <p>${dish.description}</p>
        <span class="price">${dish.price}</span>
        <p class="restaurant">From: ${dish.restaurant}</p>
      </div>
    `;
    popularDishes.appendChild(dishCard);
  });
}

// Show shop details page
function showShopDetail() {
  const shopName = decodeURIComponent(new URLSearchParams(window.location.search).get('name') || '');
  const shop = foodStores.find(s => s.restaurant_name === shopName);
  
  const shopDetailContent = document.getElementById('shop-detail-content');
  if (!shopDetailContent || !shop) {
    if (shopDetailContent) {
      shopDetailContent.innerHTML = '<p>Shop not found.</p>';
    }
    return;
  }

  // Display shop cover image
  shopDetailContent.insertAdjacentHTML('afterbegin', `
    <div class="shop-cover-image" style="margin-bottom: 2rem; text-align:center;">
      <img src="${shop.image || 'https://via.placeholder.com/600x300?text=No+Image'}" alt="${shop.restaurant_name}" style="max-width: 100%; max-height: 320px; border-radius: 12px; object-fit:cover;">
    </div>
  `);

  // Update shop details
  document.getElementById('detail-name').textContent = shop.restaurant_name;
  document.getElementById('detail-location').textContent = `${shop.district}, ${shop.city}`;
  document.getElementById('detail-cuisine').textContent = shop.cuisine;
  document.getElementById('detail-price').textContent = shop.price_range;
  document.getElementById('detail-rating').textContent = shop.rating;
  document.getElementById('detail-description').textContent = shop.description;
  document.getElementById('detail-address').textContent = shop.address;
  document.getElementById('detail-hours').textContent = shop.opening_hours;
  document.getElementById('detail-phone').textContent = shop.phone;

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

  // Display reviews
  displayReviews(shop.restaurant_name);
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
  const sections = ['home-section', 'login-section', 'register-section', 'food-shops-section', 'shop-detail-section'];
  sections.forEach(section => {
    const element = document.getElementById(section);
    if (element) {
      element.style.display = section === sectionId ? 'block' : 'none';
    }
  });
}

// Show toast notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Handle login
function login(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  if (!username || !password) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  // Simple validation for demo
  if (username === 'demo' && password === 'password') {
    currentUser = username;
    updateAuthUI();
    showSection('home-section');
    showToast('Login successful', 'success');
  } else {
    showToast('Invalid credentials', 'error');
  }
}

// Handle logout
function logout() {
  currentUser = null;
  updateAuthUI();
  showSection('home-section');
  showToast('Logged out successfully', 'success');
}

// Handle registration
function register(event) {
  event.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  if (!username || !password || !confirmPassword) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }

  // Simple registration for demo
  currentUser = username;
  updateAuthUI();
  showSection('home-section');
  showToast('Registration successful', 'success');
}

// Update authentication UI elements
function updateAuthUI() {
  const authButtons = document.getElementById('auth-buttons');
  const userInfo = document.getElementById('user-info');
  
  if (authButtons && userInfo) {
    if (currentUser) {
      authButtons.style.display = 'none';
      userInfo.style.display = 'flex';
      document.getElementById('username-display').textContent = currentUser;
    } else {
      authButtons.style.display = 'flex';
      userInfo.style.display = 'none';
    }
  }
}

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