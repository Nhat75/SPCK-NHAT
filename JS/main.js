document.addEventListener('DOMContentLoaded', () => {
    fetch('data/restaurants.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu từ API.');
            }
            return response.json();
        })
        .then(data => {
            const restaurantList = document.getElementById('restaurant-list');
            data.forEach(restaurant => {
                const card = document.createElement('div');
                card.classList.add('restaurant-card');

                card.innerHTML = `
                    <h2>${restaurant.restaurant_name}</h2>
                    <p><strong>Thành phố:</strong> ${restaurant.city}</p>
                    <p><strong>Quận:</strong> ${restaurant.district}</p>
                    <p><strong>Ẩm thực:</strong> ${restaurant.cuisine}</p>
                    <p><strong>Đánh giá:</strong> ${restaurant.rating} ⭐</p>
                    <p><strong>Giá:</strong> ${restaurant.price_range}</p>
                    <p><strong>Nguồn:</strong> ${restaurant.source}</p>
                `;

                restaurantList.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
});
