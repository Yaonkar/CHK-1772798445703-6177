const username = document.getElementById("username");
const userrole = document.getElementById("userrole");
const userbio = document.getElementById("userbio");
const joinedDate = document.getElementById("joinedDate");
const profileImage = document.getElementById("profileImage");
const scriptList = document.getElementById("scriptList");
const filmList = document.getElementById("filmList");

const token = localStorage.getItem("token");
const savedUser = JSON.parse(localStorage.getItem("user"));

async function loadProfile() {
  if (!token && !savedUser) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  try {
    // If backend already has profile endpoint, this will work
    const response = await fetch("http://localhost:5000/api/auth/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();

      const user = data.user || data;

      username.textContent = user.name || "User Name";
      userrole.textContent = user.role || "Filmlover";
      userbio.textContent = user.bio || "No bio added yet.";

      if (user.createdAt) {
        joinedDate.textContent = new Date(user.createdAt).getFullYear();
      }

      localStorage.setItem("user", JSON.stringify(user));
      return;
    }
  } catch (error) {
    console.log("Profile API not available, using saved user data");
  }

  // Fallback: use login-stored user data
  if (savedUser) {
    username.textContent = savedUser.name || "User Name";
    userrole.textContent = savedUser.role || "Filmlover";
    userbio.textContent = savedUser.bio || "No bio added yet.";

    if (savedUser.createdAt) {
      joinedDate.textContent = new Date(savedUser.createdAt).getFullYear();
    }
  }
}

loadProfile();