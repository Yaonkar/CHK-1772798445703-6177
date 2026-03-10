const API_BASE_URL = "http://localhost:5000/api";

/* ---------- REGISTER ---------- */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  const registerMessage = document.getElementById("registerMessage");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const bio = document.getElementById("bio").value.trim();

    const selectedRoles = [];
    document.querySelectorAll(".roles-grid input:checked").forEach((checkbox) => {
      selectedRoles.push(checkbox.value);
    });

    let role = "filmlover";

    if (selectedRoles.length > 0) {
      const firstRole = selectedRoles[0].toLowerCase().replace(/\s+/g, "");

      const roleMap = {
        writer: "writer",
        director: "director",
        actor: "actor",
        editor: "editor",
        producer: "filmmaker",
        cinematographer: "filmmaker",
        sounddesigner: "filmmaker",
        musiccomposer: "filmmaker",
        vfxartist: "filmmaker",
        colorist: "filmmaker",
        productiondesigner: "filmmaker",
        assistantdirector: "filmmaker"
      };

      role = roleMap[firstRole] || "filmlover";
    }

    registerMessage.style.color = "#ffffff";
    registerMessage.textContent = "Creating account...";

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          bio
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      registerMessage.style.color = "lightgreen";
      registerMessage.textContent = data.message || "Registration successful";

      registerForm.reset();

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } catch (error) {
      registerMessage.style.color = "red";
      registerMessage.textContent = error.message || "Server error";
    }
  });
}

/* ---------- LOGIN ---------- */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const loginMessage = document.getElementById("loginMessage");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    loginMessage.style.color = "#ffffff";
    loginMessage.textContent = "Logging in...";

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
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

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      loginMessage.style.color = "lightgreen";
      loginMessage.textContent = "Login successful";

      setTimeout(() => {
        if (data.user.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "dashboard.html";
        }
      }, 1000);

    } catch (error) {
      loginMessage.style.color = "red";
      loginMessage.textContent = error.message || "Server error";
    }
  });
}