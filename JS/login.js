document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    let usernameError = document.getElementById("usernameError");
    let emailError = document.getElementById("emailError");
    let passwordError = document.getElementById("passwordError");

    usernameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";

    let isValid = true;

    if (username.trim() === "") {
        usernameError.textContent = "Tên đăng nhập không được để trống!";
        isValid = false;
    }

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        emailError.textContent = "Email không hợp lệ!";
        isValid = false;
    }

    if (password.length < 6) {
        passwordError.textContent = "Mật khẩu phải có ít nhất 6 ký tự!";
        isValid = false;
    }

    if (isValid) {
        alert("Đăng nhập thành công!");
    }
});
