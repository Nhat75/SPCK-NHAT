const foodShops = [
    {
      id: 1,
      name: "Pho Hoan Kiem",
      description: "Famous for traditional Hanoi-style Pho",
      location: "Hanoi Old Quarter",
      address: "13 Lo Su Street, Hoan Kiem District, Hanoi",
      specialty: "Pho Bo (Beef Noodle Soup)",
      image: "https://images.unsplash.com/photo-1681103574290-cbfcc3e034d4",
      introduction: "Pho Hoan Kiem is a legendary pho restaurant located in the heart of Hanoi's Old Quarter. Established in 1952, this family-run restaurant has been serving authentic Hanoi-style pho for generations. Their secret recipe, passed down through the years, creates a rich, clear broth that's simmered for hours with carefully selected spices. The restaurant is particularly famous for its Pho Bo (beef noodle soup), which features tender beef slices, fresh herbs, and perfectly cooked rice noodles."
    },
    {
      id: 2,
      name: "Banh Mi Huynh Hoa",
      description: "Best Banh Mi in Saigon",
      location: "Ho Chi Minh City",
      address: "26 Le Thi Rieng Street, District 1, Ho Chi Minh City",
      specialty: "Special Banh Mi",
      image: "https://images.unsplash.com/photo-1681103574290-cbfcc3e034d4",
      introduction: "Banh Mi Huynh Hoa is an iconic sandwich shop in Ho Chi Minh City, known for serving what many consider the best banh mi in Vietnam. Since 1958, they've been crafting their famous sandwiches with a perfect balance of ingredients: crispy baguettes, homemade pate, various cold cuts, fresh vegetables, and their signature sauce. The shop's popularity has made it a must-visit destination for both locals and tourists seeking an authentic Vietnamese sandwich experience."
    },
    {
      id: 3,
      name: "Com Tam Ba Ghien",
      description: "Authentic broken rice dishes",
      location: "Ho Chi Minh City",
      address: "84 Dang Van Ngu Street, Phu Nhuan District, Ho Chi Minh City",
      specialty: "Com Tam Suon",
      image: "https://images.unsplash.com/photo-1681103574290-cbfcc3e034d4",
      introduction: "Com Tam Ba Ghien is a beloved restaurant in Ho Chi Minh City specializing in com tam (broken rice dishes). Their signature dish, Com Tam Suon, features grilled pork chops marinated in a special sauce, served with broken rice, fresh vegetables, and a side of fish sauce. The restaurant's cozy atmosphere and consistent quality have made it a favorite among locals for over 30 years."
    },
    {
      id: 4,
      name: "Bun Cha Huong Lien",
      description: "World-famous Bun Cha restaurant",
      location: "Hanoi",
      address: "24 Le Van Huu Street, Hai Ba Trung District, Hanoi",
      specialty: "Bun Cha",
      image: "https://images.unsplash.com/photo-1681103574290-cbfcc3e034d4",
      introduction: "Bun Cha Huong Lien gained international fame when former US President Barack Obama and celebrity chef Anthony Bourdain dined here in 2016. This humble restaurant serves Hanoi's signature dish, bun cha - grilled pork patties and slices served with rice noodles, fresh herbs, and a sweet-sour fish sauce. The restaurant's authentic flavors and historical significance make it a must-visit spot in Hanoi."
    },
    {
      id: 5,
      name: "Mi Quang Ba Mua",
      description: "Traditional Mi Quang noodles",
      location: "Da Nang",
      address: "166 Tran Phu Street, Hai Chau District, Da Nang",
      specialty: "Mi Quang",
      image: "https://images.unsplash.com/photo-1681103574290-cbfcc3e034d4",
      introduction: "Mi Quang Ba Mua is a family-owned restaurant in Da Nang that has been serving authentic Mi Quang for decades. Their signature dish features wide rice noodles in a rich, turmeric-colored broth, topped with shrimp, pork, quail eggs, and fresh herbs. The restaurant is known for its traditional preparation methods and use of locally sourced ingredients, making it a favorite among both locals and visitors to Da Nang."
    },
    {
      id: 6,
      name: "Quan An Ngon",
      description: "Various Vietnamese dishes",
      location: "Multiple locations",
      address: "18 Phan Boi Chau Street, Hoan Kiem District, Hanoi (Main Branch)",
      specialty: "Vietnamese street food",
      image: "https://images.unsplash.com/photo-1681103574290-cbfcc3e034d4",
      introduction: "Quan An Ngon is a popular restaurant chain that brings together the best of Vietnamese street food in a comfortable, modern setting. Their menu features a wide variety of dishes from different regions of Vietnam, prepared by experienced chefs using traditional recipes. The restaurant's beautiful colonial-style architecture and extensive menu make it perfect for those wanting to sample various Vietnamese dishes in one place."
    }
  ];
  
  const authButtons = document.getElementById('auth-buttons');
  const userInfo = document.getElementById('user-info');
  const userEmail = document.getElementById('user-email');
  
  
  function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
  }
  
  function handleLogin(event) {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
  
    if (password.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
  
    localStorage.setItem('user', email);
    showToast('Đăng nhập thành công!');
    showSection('food-shops');
    updateAuthUI();
  }
  
  function handleRegister(event) {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
    const confirmPassword = event.target[2].value;
  
    if (password.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
  
    if (password !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp');
      return;
    }
  
    localStorage.setItem('user', email);
    showToast('Đăng ký thành công!');
    showSection('food-shops');
    updateAuthUI();
  }
  
  function logout() {
    localStorage.removeItem('user');
    showToast('Đăng xuất thành công!');
    showSection('home');
    updateAuthUI();
  }
  
  function updateAuthUI() {
    const user = localStorage.getItem('user');
    
    if (user) {
      authButtons.style.display = 'none';
      userInfo.style.display = 'flex';
      userEmail.textContent = user;
    } else {
      authButtons.style.display = 'flex';
      userInfo.style.display = 'none';
      userEmail.textContent = '';
    }
  }
  
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  
  function populateFoodShops() {
    const shopGrid = document.getElementById('shop-grid');
    const user = localStorage.getItem('user');
    
    shopGrid.innerHTML = foodShops.map(shop => `
      <div class="shop-card">
        <div class="image-container">
          <img src="${shop.image}" alt="${shop.name}" onclick="showRestaurantDetail(${shop.id})">
          ${!user ? `
            <div class="login-overlay" onclick="showSection('login')">
              Đăng nhập để xem chi tiết và đặt bàn
            </div>
          ` : ''}
        </div>
        <div class="shop-card-content">
          <h3>${shop.name}</h3>
          <p>${shop.description}</p>
          <p><strong>Vị trí:</strong> ${shop.location}</p>
          <p><strong>Địa chỉ:</strong> ${shop.address}</p>
          <p><strong>Món đặc sản:</strong> ${shop.specialty}</p>
          <div class="shop-introduction">
            <p>${shop.introduction}</p>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  function showRestaurantDetail(shopId) {
    const user = localStorage.getItem('user');
    
    if (!user) {
      showToast('Vui lòng đăng nhập để xem chi tiết nhà hàng và đặt bàn');
      showSection('login');
      return;
    }

    const shop = foodShops.find(s => s.id === shopId);
    if (!shop) return;

    // Update detail view with restaurant information
    document.getElementById('detail-image').src = shop.image;
    document.getElementById('detail-image').alt = shop.name;
    document.getElementById('detail-name').textContent = shop.name;
    document.getElementById('detail-description').textContent = shop.description;
    document.getElementById('detail-location').textContent = shop.location;
    document.getElementById('detail-address').textContent = shop.address;
    document.getElementById('detail-specialty').textContent = shop.specialty;
    document.getElementById('detail-introduction').textContent = shop.introduction;

    // Pre-fill email in booking form if user is logged in
    document.getElementById('booking-email').value = user;

    // Load and display reviews
    loadReviews(shopId);

    // Show the detail section
    showSection('restaurant-detail');
  }
  
  function loadReviews(shopId) {
    const reviews = JSON.parse(localStorage.getItem(`reviews_${shopId}`) || '[]');
    const reviewsList = document.getElementById('reviews-list');
    
    if (reviews.length === 0) {
      reviewsList.innerHTML = '<p>Chưa có đánh giá nào cho nhà hàng này.</p>';
      return;
    }

    reviewsList.innerHTML = reviews.map(review => `
      <div class="review-item">
        <div class="review-header">
          <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
          <div class="review-date">${new Date(review.date).toLocaleDateString('vi-VN')}</div>
        </div>
        <div class="review-comment">${review.comment}</div>
        <div class="review-author">Đánh giá bởi: ${review.author}</div>
      </div>
    `).join('');
  }
  
  function handleReview(event) {
    event.preventDefault();
    
    const user = localStorage.getItem('user');
    if (!user) {
      showToast('Vui lòng đăng nhập để gửi đánh giá');
      showSection('login');
      return;
    }

    const shopId = foodShops.find(s => s.name === document.getElementById('detail-name').textContent).id;
    const rating = document.getElementById('review-rating').value;
    const comment = document.getElementById('review-comment').value;

    const review = {
      rating: parseInt(rating),
      comment,
      author: user,
      date: new Date().toISOString()
    };

    // Get existing reviews or initialize empty array
    const reviews = JSON.parse(localStorage.getItem(`reviews_${shopId}`) || '[]');
    reviews.push(review);
    localStorage.setItem(`reviews_${shopId}`, JSON.stringify(reviews));

    // Show success message
    showToast('Cảm ơn bạn đã gửi đánh giá!');

    // Reset form
    event.target.reset();

    // Reload reviews
    loadReviews(shopId);
  }
  
  function handleBooking(event) {
    event.preventDefault();
    
    const user = localStorage.getItem('user');
    if (!user) {
      showToast('Vui lòng đăng nhập để đặt bàn');
      showSection('login');
      return;
    }
    
    const bookingData = {
      restaurantName: document.getElementById('detail-name').textContent,
      name: document.getElementById('booking-name').value,
      email: document.getElementById('booking-email').value,
      phone: document.getElementById('booking-phone').value,
      date: document.getElementById('booking-date').value,
      time: document.getElementById('booking-time').value,
      guests: document.getElementById('booking-guests').value,
      notes: document.getElementById('booking-notes').value,
      userId: user
    };

    // Get existing bookings or initialize empty array
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Show success message
    showToast('Đặt bàn thành công! Chúng tôi sẽ liên hệ với bạn sớm.');

    // Reset form
    event.target.reset();

    // Return to restaurant list
    showSection('food-shops');
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    populateFoodShops();
    showSection('home');
  });