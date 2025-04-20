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