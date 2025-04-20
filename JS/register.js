document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Clear previous error messages
    document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));

    // Get form values
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const verifyPassword = document.getElementById("verifyPassword").value.trim();

    let isValid = true;

    // Validate username (6-18 characters)
    if (username.length < 6 || username.length > 18) {
        document.getElementById("usernameError").textContent =
            "Username must be between 6 and 18 characters.";
        isValid = false;
    }

    // Validate email (valid format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent = "Invalid email format.";
        isValid = false;
    }

    // Validate password (8-20 characters)
    if (password.length < 8 || password.length > 20) {
        document.getElementById("passwordError").textContent =
            "Password must be between 8 and 20 characters.";
        isValid = false;
    }

    // Validate verifyPassword (must match password)
    if (verifyPassword !== password) {
        document.getElementById("verifyPasswordError").textContent =
            "Passwords do not match.";
        isValid = false;
    }

    // If all validations pass
    if (isValid) {
        alert("Registration successful!");
        // Add logic to handle successful registration (e.g., send data to server)
    }
});