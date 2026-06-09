const API_URL = "http://localhost:5000/api/auth/login";

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
        localStorage.setItem("userId", data.id);

        // Redirect to dashboard
        window.location.href = "index.html";
    } else {
        document.getElementById("message").innerText = data.message;
    }
}