document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault()

    document.querySelectorAll(".error").forEach((el) => (el.textContent = ""))

    const username = document.getElementById("username").value.trim()
    const email = document.getElementById("email").value.trim()
    const password = document.getElementById("password").value.trim()
    const verifyPassword = document.getElementById("verifyPassword").value.trim()

    let isValid = true

    if (username.length < 6 || username.length > 18) {
        document.getElementById("usernameError").textContent =
            "Username must be between 6 and 18 characters."
        isValid = false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent = "Invalid email format."
        isValid = false
    }

    if (password.length < 8 || password.length > 20) {
        document.getElementById("passwordError").textContent =
            "Password must be between 8 and 20 characters."
        isValid = false
    }

    if (verifyPassword !== password) {
        document.getElementById("verifyPasswordError").textContent =
            "Passwords do not match."
        isValid = false
    }

    if (isValid) {
        alert("Form submitted successfully!")
    }
})

function getRestaurantName() {
  const params = new URLSearchParams(window.location.search);
  return params.get('name');
}

function getCurrentUser() {
  return localStorage.getItem('currentUser') || null;
}

function displayUserBookings() {
  const user = getCurrentUser();
  const restaurant = getRestaurantName();
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const userBookings = bookings.filter(b => b.user === user && b.restaurant === restaurant);
  const listDiv = document.getElementById('user-bookings-list');
  if (!listDiv) return;
  if (!user) {
    listDiv.innerHTML = '<p style="color:#e74c3c;">You must be logged in to view your bookings.</p>';
    return;
  }
  if (userBookings.length === 0) {
    listDiv.innerHTML = '<p>No bookings yet for this restaurant.</p>';
    return;
  }
  listDiv.innerHTML = userBookings.map(b => `
    <div class="booking-item" style="background:#f8f9fa;padding:12px;border-radius:6px;margin-bottom:10px;">
      <b>Date:</b> ${b.date} | <b>Seats:</b> ${b.seats}<br>
      <b>Rating:</b> ${'★'.repeat(b.rating)}<br>
      <b>Review:</b> ${b.review}
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  const bookingBtn = document.getElementById('booking-btn');
  const bookingModal = document.getElementById('booking-modal');
  const closeBookingModal = document.getElementById('close-booking-modal');
  const bookingForm = document.getElementById('booking-form');

  if (bookingBtn && bookingModal && closeBookingModal && bookingForm) {
    bookingBtn.onclick = function() {
      if (!getCurrentUser()) {
        if (typeof showToast === 'function') showToast('You must be logged in to book.', 'error');
        return;
      }
      bookingModal.style.display = 'flex';
    };
    closeBookingModal.onclick = function() {
      bookingModal.style.display = 'none';
    };
    window.onclick = function(event) {
      if (event.target === bookingModal) {
        bookingModal.style.display = 'none';
      }
    };
    bookingForm.onsubmit = function(e) {
      e.preventDefault();
      const date = document.getElementById('booking-date').value;
      const seats = document.getElementById('booking-seats').value;
      const rating = document.getElementById('booking-rating').value;
      const review = document.getElementById('booking-review').value;
      const restaurant = getRestaurantName();
      const user = getCurrentUser();
      if (!user) {
        if (typeof showToast === 'function') showToast('You must be logged in to book.', 'error');
        return;
      }
      // Booking validation: prevent duplicate booking for same date
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const duplicate = bookings.some(b => b.user === user && b.restaurant === restaurant && b.date === date);
      if (duplicate) {
        if (typeof showToast === 'function') showToast('You already have a booking for this date.', 'error');
        return;
      }
      bookings.push({ restaurant, user, date, seats, rating, review });
      localStorage.setItem('bookings', JSON.stringify(bookings));
      // Save review (append to reviews in localStorage)
      const allReviews = JSON.parse(localStorage.getItem('reviews') || '{}');
      if (!allReviews[restaurant]) allReviews[restaurant] = [];
      allReviews[restaurant].push({ user, rating: parseInt(rating), text: review, date });
      localStorage.setItem('reviews', JSON.stringify(allReviews));
      // Optionally update reviews list on page
      if (typeof displayReviews === 'function') displayReviews(restaurant);
      // Show toast
      if (typeof showToast === 'function') showToast('Booking & review submitted!', 'success');
      bookingModal.style.display = 'none';
      bookingForm.reset();
      displayUserBookings();
    };
    displayUserBookings();
  }
});