
const foodShops = [
    {
      id: 1,
      name: "Pho Hoan Kiem",
      description: "Famous for traditional Hanoi-style Pho",
      location: "Hanoi Old Quarter",
      specialty: "Pho Bo (Beef Noodle Soup)",
      image: "https://images.unsplash.com/photo-1681103574290-cbfcc3e034d4"
    },
    {
      id: 2,
      name: "Banh Mi Huynh Hoa",
      description: "Best Banh Mi in Saigon",
      location: "Ho Chi Minh City",
      specialty: "Special Banh Mi",
      image: "https://images.unsplash.com/photo-1681103574290-cbfcc3e034d4"
    },
    {
      id: 3,
      name: "Com Tam Ba Ghien",
      description: "Authentic broken rice dishes",
      location: "Ho Chi Minh City",
      specialty: "Com Tam Suon",
      image: "https://images.unsplash.com/photo-1681103574290-cbfcc3e034d4"
    },
    {
      id: 4,
      name: "Bun Cha Huong Lien",
      description: "World-famous Bun Cha restaurant",
      location: "Hanoi",
      specialty: "Bun Cha",
      image: "https://images.unsplash.com/photo-1681103574290-cbfcc3e034d4"
    },
    {
      id: 5,
      name: "Mi Quang Ba Mua",
      description: "Traditional Mi Quang noodles",
      location: "Da Nang",
      specialty: "Mi Quang",
      image: "https://images.unsplash.com/photo-1681103574290-cbfcc3e034d4"
    },
    {
      id: 6,
      name: "Quan An Ngon",
      description: "Various Vietnamese dishes",
      location: "Multiple locations",
      specialty: "Vietnamese street food",
      image: "https://images.unsplash.com/photo-1681103574290-cbfcc3e034d4"
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
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
  
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
  
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      updateAuthUI();
      showSection('food-shops');
      showToast('Logged in successfully!');
    } else {
      showToast('Invalid credentials');
    }
  }
  
  function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
  
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === email)) {
      showToast('Email already exists');
      return;
    }
  
    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    updateAuthUI();
    showSection('food-shops');
    showToast('Registered successfully!');
  }
  
  function logout() {
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showSection('home');
    showToast('Logged out successfully!');
  }
  
  function updateAuthUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
      authButtons.style.display = 'none';
      userInfo.style.display = 'flex';
      userEmail.textContent = currentUser.email;
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
    shopGrid.innerHTML = foodShops.map(shop => `
      <div class="shop-card">
        <img src="${shop.image}" alt="${shop.name}">
        <div class="shop-card-content">
          <h3>${shop.name}</h3>
          <p>${shop.description}</p>
          <p><strong>Location:</strong> ${shop.location}</p>
          <p><strong>Specialty:</strong> ${shop.specialty}</p>
        </div>
      </div>
    `).join('');
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    populateFoodShops();
    showSection('home');
  });