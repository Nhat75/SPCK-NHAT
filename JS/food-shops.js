let foodStores = [];
document.addEventListener('DOMContentLoaded', async () => {
  await loadFoodStores();
  populateFilters();
  displayFoodShops();
});

async function loadFoodStores() {
  const response = await fetch('../JS/food_stores.json');
  const data = await response.json();
  foodStores = data.foodStores || data;
}

function populateFilters() {
  const cities = [...new Set(foodStores.map(shop => shop.city))];
  const cuisines = [...new Set(foodStores.map(shop => shop.cuisine))];
  const cityFilter = document.getElementById('city-filter');
  const cuisineFilter = document.getElementById('cuisine-filter');
  const priceFilter = document.getElementById('price-filter');
  cityFilter.innerHTML = '<option value="">All Cities</option>';
  cuisineFilter.innerHTML = '<option value="">All Cuisines</option>';
  priceFilter.innerHTML = `
    <option value="">All Prices</option>
    <option value="₫">Budget</option>
    <option value="₫₫">Moderate</option>
    <option value="₫₫₫">Luxury</option>
  `;
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
  cityFilter.onchange = filterShops;
  cuisineFilter.onchange = filterShops;
  priceFilter.onchange = filterShops;
}

function displayFoodShops(filteredShops = foodStores) {
  const shopGrid = document.getElementById('shop-grid');
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

function filterShops() {
  const city = document.getElementById('city-filter').value;
  const cuisine = document.getElementById('cuisine-filter').value;
  const price = document.getElementById('price-filter').value;
  const filteredShops = foodStores.filter(shop =>
    (!city || shop.city === city) &&
    (!cuisine || shop.cuisine === cuisine) &&
    (!price || shop.price_range === price)
  );
  displayFoodShops(filteredShops);
}
