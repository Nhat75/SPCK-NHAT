document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    if (email && password) {
        localStorage.setItem('currentUser', email);
        window.location.href = 'home.html';
    } else {
        showToast('Please enter email and password', 'error');
    }
});

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}
