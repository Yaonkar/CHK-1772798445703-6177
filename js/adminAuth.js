const adminLoginForm = document.getElementById("adminLoginForm");
const loginMessage = document.getElementById("loginMessage");

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();
    const rememberMe = document.getElementById("rememberMe").checked;

    try {
      loginMessage.style.color = "#cbd5e1";
      loginMessage.textContent = "Logging in...";

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const user = data.user || {};

      if (user.role !== "admin") {
        loginMessage.style.color = "#fca5a5";
        loginMessage.textContent = "Only admin can access this page";
        return;
      }

      const storage = rememberMe ? localStorage : sessionStorage;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("userId");

      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(user));
      storage.setItem("userId", user._id || "");

      loginMessage.style.color = "lightgreen";
      loginMessage.textContent = "Login successful";

      setTimeout(() => {
        window.location.href = "admin.html";
      }, 700);
    } catch (error) {
      console.error("Admin login error:", error);
      loginMessage.style.color = "#fca5a5";
      loginMessage.textContent = error.message || "Server error";
    }
  });
}