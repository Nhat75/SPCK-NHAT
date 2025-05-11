let foodStores = [];
document.addEventListener('DOMContentLoaded', async () => {
  await loadFoodStores();
  updateHeroStats();
  displayPopularDishes();
});

async function loadFoodStores() {
  const response = await fetch('../JS/food_stores.json');
  const data = await response.json();
  foodStores = data.foodStores;
}

function updateHeroStats() {
  const totalShops = foodStores.length;
  const avgRating = (foodStores.reduce((sum, shop) => sum + shop.rating, 0) / totalShops).toFixed(1);
  const uniqueCities = new Set(foodStores.map(shop => shop.city)).size;
  document.getElementById('total-shops').textContent = totalShops;
  document.getElementById('avg-rating').textContent = avgRating;
  document.getElementById('total-cities').textContent = uniqueCities;
}

function displayPopularDishes() {
  const dishesGrid = document.getElementById('dishes-grid');
  dishesGrid.innerHTML = '';
  const allDishes = foodStores.flatMap(shop =>
    shop.dishes.map(dish => ({
      ...dish,
      restaurant: shop.restaurant_name,
      restaurantRating: shop.rating
    }))
  );
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
          <a href="shop-detail.html?name=${encodeURIComponent(dish.restaurant)}" class="view-restaurant-btn">
            <i class="fas fa-utensils"></i> View Restaurant
          </a>
        </div>
      </div>
    `;
    dishesGrid.appendChild(dishCard);
  });
}
