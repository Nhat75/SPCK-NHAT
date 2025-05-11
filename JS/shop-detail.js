let foodStores = [];
const sampleReviews = {
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

document.addEventListener('DOMContentLoaded', async () => {
  await loadFoodStores();
  showShopDetail();
});

async function loadFoodStores() {
  const response = await fetch('../JS/food_stores.json');
  const data = await response.json();
  foodStores = data.foodStores;
}

function getShopNameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('name');
}

function showShopDetail() {
  const shopName = decodeURIComponent(getShopNameFromURL() || '');
  const shop = foodStores.find(s => s.restaurant_name === shopName);
  if (!shop) {
    document.getElementById('shop-detail-content').innerHTML = '<p>Shop not found.</p>';
    return;
  }
  // Hiển thị hình ảnh đại diện của quán ở đầu
  const shopDetailContent = document.getElementById('shop-detail-content');
  shopDetailContent.insertAdjacentHTML('afterbegin', `
    <div class="shop-cover-image" style="margin-bottom: 2rem; text-align:center;">
      <img src="${shop.image || 'https://via.placeholder.com/600x300?text=No+Image'}" alt="${shop.restaurant_name}" style="max-width: 100%; max-height: 320px; border-radius: 12px; object-fit:cover;">
    </div>
  `);

  document.getElementById('detail-name').textContent = shop.restaurant_name;
  document.getElementById('detail-location').textContent = `${shop.district}, ${shop.city}`;
  document.getElementById('detail-cuisine').textContent = shop.cuisine;
  document.getElementById('detail-price').textContent = shop.price_range;
  document.getElementById('detail-rating').textContent = shop.rating;
  document.getElementById('detail-description').textContent = shop.description;
  document.getElementById('detail-address').textContent = shop.address;
  document.getElementById('detail-hours').textContent = shop.opening_hours;
  document.getElementById('detail-phone').textContent = shop.phone;

  // Menu
  const dishesList = document.getElementById('shop-dishes-list');
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

  // Reviews
  displayReviews(shop.restaurant_name);
}

function displayReviews(shopName) {
  const reviewsList = document.getElementById('reviews-list');
  reviewsList.innerHTML = '';
  const reviews = sampleReviews[shopName] || [];
  if (reviews.length === 0) {
    reviewsList.innerHTML = '<p>No reviews yet.</p>';
    return;
  }
  reviews.forEach(review => {
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