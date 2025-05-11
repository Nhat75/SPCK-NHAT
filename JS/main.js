// Food store data
let foodStores = [];
let currentUser = null;
let reviews = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  await loadFoodStores();
  updateHeroStats();
  populateFilters();
  displayFoodShops();
  displayPopularDishes();
});

// Load food stores from API
async function loadFoodStores() {
  try {
    const response = await fetch('../JS/food_stores.json');
    const data = await response.json();
    foodStores = data.foodStores;
  } catch (error) {
    console.error('Error loading food stores:', error);
    showToast('Error loading food stores', 'error');
  }
}

// Update hero section statistics
function updateHeroStats() {
  const totalShops = foodStores.length;
  const avgRating = (foodStores.reduce((sum, shop) => sum + shop.rating, 0) / totalShops).toFixed(1);
  const uniqueCities = new Set(foodStores.map(shop => shop.city)).size;

  document.getElementById('total-shops').textContent = totalShops;
  document.getElementById('avg-rating').textContent = avgRating;
  document.getElementById('total-cities').textContent = uniqueCities;
}

// Populate filter dropdowns
function populateFilters() {
  const cities = [...new Set(foodStores.map(shop => shop.city))];
  const cuisines = [...new Set(foodStores.map(shop => shop.cuisine))];

  const cityFilter = document.getElementById('city-filter');
  const cuisineFilter = document.getElementById('cuisine-filter');

  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    cityFilter.appendChild(option);
  });

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.value = cuisine;
    option.textContent = cuisine;
    cuisineFilter.appendChild(option);
  });
}

// Display food shops in the grid
function displayFoodShops(filteredShops = foodStores) {
  const shopGrid = document.getElementById('shop-grid');
  shopGrid.innerHTML = '';

  filteredShops.forEach(shop => {
    const shopCard = document.createElement('div');
    shopCard.className = 'shop-card';
    shopCard.innerHTML = `
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
      <button onclick="showShopDetail('${shop.restaurant_name}')" class="view-details-btn">
        View Details
      </button>
    `;
    shopGrid.appendChild(shopCard);
  });
}

// Filter shops based on selected criteria
function filterShops() {
  const city = document.getElementById('city-filter').value;
  const cuisine = document.getElementById('cuisine-filter').value;
  const price = document.getElementById('price-filter').value;

  const filteredShops = foodStores.filter(shop => {
    return (!city || shop.city === city) &&
           (!cuisine || shop.cuisine === cuisine) &&
           (!price || shop.price_range === price);
  });

  displayFoodShops(filteredShops);
}

// Display popular dishes
function displayPopularDishes() {
  const dishesGrid = document.getElementById('dishes-grid');
  dishesGrid.innerHTML = '';

  // Get all dishes from all restaurants
  const allDishes = foodStores.flatMap(shop => 
    shop.dishes.map(dish => ({
      ...dish,
      restaurant: shop.restaurant_name,
      restaurantRating: shop.rating
    }))
  );

  // Sort dishes by restaurant rating and take top 6
  const popularDishes = allDishes
    .sort((a, b) => b.restaurantRating - a.restaurantRating)
    .slice(0, 6);

  popularDishes.forEach(dish => {
    const dishCard = document.createElement('div');
    dishCard.className = 'dish-card';
    dishCard.innerHTML = `
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
          <button onclick="showShopDetail('${dish.restaurant}')" class="view-restaurant-btn">
            <i class="fas fa-utensils"></i> View Restaurant
          </button>
        </div>
      </div>
    `;
    dishesGrid.appendChild(dishCard);
  });
}

// Show shop details
function showShopDetail(shopName) {
  const shop = foodStores.find(s => s.restaurant_name === shopName);
  if (!shop) return;

  document.getElementById('detail-name').textContent = shop.restaurant_name;
  document.getElementById('detail-location').textContent = `${shop.district}, ${shop.city}`;
  document.getElementById('detail-cuisine').textContent = shop.cuisine;
  document.getElementById('detail-price').textContent = shop.price_range;
  document.getElementById('detail-rating').textContent = shop.rating;

  // Display dishes
  const dishesList = document.getElementById('shop-dishes-list');
  dishesList.innerHTML = '';

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

  displayReviews(shopName);
  showSection('shop-detail');
}

// Display reviews for a shop
function displayReviews(shopName) {
  const reviewsList = document.getElementById('reviews-list');
  reviewsList.innerHTML = '';

  if (!reviews[shopName]) {
    reviews[shopName] = [];
  }

  reviews[shopName].forEach(review => {
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

// Submit a new review
function submitReview(event) {
  event.preventDefault();
  
  if (!currentUser) {
    showToast('Please login to submit a review', 'error');
    return;
  }

  const form = event.target;
  const text = form.querySelector('textarea').value;
  const rating = document.querySelector('.stars .fas').dataset.rating;

  const shopName = document.getElementById('detail-name').textContent;
  const review = {
    user: currentUser,
    text,
    rating: parseInt(rating),
    date: new Date().toLocaleDateString()
  };

  if (!reviews[shopName]) {
    reviews[shopName] = [];
  }
  reviews[shopName].push(review);

  displayReviews(shopName);
  form.reset();
  showToast('Review submitted successfully', 'success');
}

// Show/hide sections
  function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
  }
  
// Show toast messages
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// Handle login
  function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
  
  // Simple validation
  if (email && password) {
    currentUser = email;
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('user-email').textContent = email;
    showSection('home');
    showToast('Login successful', 'success');
  }
}

// Handle logout
function logout() {
  currentUser = null;
  document.getElementById('auth-buttons').style.display = 'block';
  document.getElementById('user-info').style.display = 'none';
  showSection('home');
  showToast('Logged out successfully', 'info');
}

// Handle registration
  function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
  
  // Simple validation
  if (email && password) {
    currentUser = email;
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('user-email').textContent = email;
    showSection('home');
    showToast('Registration successful', 'success');
  }
}