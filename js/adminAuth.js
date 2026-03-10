const adminLoginForm = document.getElementById("adminLoginForm");
const loginMessage = document.getElementById("loginMessage");

const API_BASE_URL = "http://localhost:5000/api";

adminLoginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value.trim();
  const rememberMe = document.getElementById("rememberMe").checked;

  loginMessage.textContent = "Logging in...";
  loginMessage.style.color = "#ffffff";

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (!data.user || data.user.role !== "admin") {
      throw new Error("Only admin can login here");
    }

    if (rememberMe) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
    } else {
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("adminUser", JSON.stringify(data.user));
    }

    loginMessage.textContent = "Admin login successful";
    loginMessage.style.color = "lightgreen";

    setTimeout(() => {
      window.location.href = "admin.html";
    }, 1000);
  } catch (error) {
    loginMessage.textContent = error.message;
    loginMessage.style.color = "red";
  }
});