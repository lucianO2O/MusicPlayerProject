let login_form = document.getElementById("login_form")
if (login_form) login_form.addEventListener("submit", login)

async function login(e) {
    e.preventDefault()

    const user = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
    }

    try {
        const data = await fetchData("/users/login", user, "POST")
        console.log("Login successful:", data)
    } catch (err) {
        console.error("Login failed:", err.message)
    }
}

let registration_form = document.getElementById("registration_form")
if (registration_form) registration_form.addEventListener("submit", register)

async function register(e) {
    e.preventDefault();

    const user = {
        firstName: document.getElementById("first name").value,
        lastName: document.getElementById("last name").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
    }

    try {
        const data = await fetchData("/users/register", user, "POST")
        console.log("Registration successful:", data)
    } catch (err) {
        console.error("Registration failed:", err.message)
    }
}
