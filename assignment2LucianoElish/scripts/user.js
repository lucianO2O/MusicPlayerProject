let login_form = document.getElementById("login_form")
if (login_form) login_form.addEventListener('submit', login)

function login(e) {
    e.preventDefault()

    const user = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    }

    console.log(user)
}

let registration_form = document.getElementById("registration_form")
if (registration_form) registration_form.addEventListener('submit', register)

function register(e) {
    e.preventDefault()

    const user = {
        firstName: document.getElementById("first name").value,
        lastName: document.getElementById("last name").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    }

    console.log(user)
}