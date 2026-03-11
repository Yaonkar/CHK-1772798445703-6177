const API_BASE_URL = "http://localhost:5000/api";

const adminWelcome = document.getElementById("adminWelcome");
const adminGlobalMessage = document.getElementById("adminGlobalMessage");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");

const totalUsers = document.getElementById("totalUsers");
const pendingUsers = document.getElementById("pendingUsers");
const pendingScripts = document.getElementById("pendingScripts");
const selectedScripts = document.getElementById("selectedScripts");

const usersTableBody = document.getElementById("usersTableBody");
const scriptsTableBody = document.getElementById("scriptsTableBody");
const chatroomsTableBody = document.getElementById("chatroomsTableBody");

const refreshUsersBtn = document.getElementById("refreshUsersBtn");
const refreshScriptsBtn = document.getElementById("refreshScriptsBtn");

const preProductionForm = document.getElementById("preProductionForm");
const crowdfundingForm = document.getElementById("crowdfundingForm");

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

function clearAdminSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("userId");
}

function redirectToAdminLogin() {
  clearAdminSession();
  window.location.href = "admin_login.html";
}

function showMessage(message, color = "#fbbf24") {
  if (!adminGlobalMessage) return;
  adminGlobalMessage.textContent = message;
  adminGlobalMessage.style.color = color;

  setTimeout(() => {
    adminGlobalMessage.textContent = "";
  }, 3000);
}

function authHeaders(withJson = true) {
  const headers = {
    Authorization: `Bearer ${getToken()}`
  };

  if (withJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function safeDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

async function verifyAdminAccess() {
  const token = getToken();
  const storedUser = getStoredUser();

  if (!token || !storedUser || storedUser.role !== "admin") {
    redirectToAdminLogin();
    return null;
  }

  try {
    const data = await fetchJson(`${API_BASE_URL}/auth/profile`, {
      method: "GET",
      headers: authHeaders(false)
    });

    const currentUser = data.user || data;

    if (!currentUser || currentUser.role !== "admin") {
      redirectToAdminLogin();
      return null;
    }

    return currentUser;
  } catch (error) {
    console.error("verifyAdminAccess error:", error);
    redirectToAdminLogin();
    return null;
  }
}

async function loadUsers() {
  if (!usersTableBody) return;

  try {
    usersTableBody.innerHTML = `<tr><td colspan="6">Loading users...</td></tr>`;

    const data = await fetchJson(`${API_BASE_URL}/admin/users`, {
      method: "GET",
      headers: authHeaders(false)
    });

    const users = data.users || [];

    totalUsers.textContent = users.length;
    pendingUsers.textContent = users.filter(user => user.status === "pending").length;

    if (!users.length) {
      usersTableBody.innerHTML = `<tr><td colspan="6">No users found</td></tr>`;
      return;
    }

    usersTableBody.innerHTML = users.map(user => `
      <tr>
        <td>${user.name || "-"}</td>
        <td>${user.email || "-"}</td>
        <td>${user.role || "-"}</td>
        <td>${user.status || "-"}</td>
        <td>${safeDate(user.createdAt)}</td>
        <td>
          <button class="table-btn delete-btn" onclick="removeUser('${user._id}')">Remove</button>
        </td>
      </tr>
    `).join("");
  } catch (error) {
    console.error("loadUsers error:", error);
    usersTableBody.innerHTML = `<tr><td colspan="6">${error.message}</td></tr>`;
  }
}

async function loadScripts() {
  if (!scriptsTableBody) return;

  try {
    scriptsTableBody.innerHTML = `<tr><td colspan="6">Loading scripts...</td></tr>`;

    const data = await fetchJson(`${API_BASE_URL}/scripts`, {
      method: "GET",
      headers: authHeaders(false)
    });

    const scripts = data.scripts || [];

    pendingScripts.textContent = scripts.filter(script => script.status === "open").length;
    selectedScripts.textContent = scripts.filter(script => script.isSelected).length;

    if (!scripts.length) {
      scriptsTableBody.innerHTML = `<tr><td colspan="6">No scripts found</td></tr>`;
      return;
    }

    scriptsTableBody.innerHTML = scripts.map(script => `
      <tr>
        <td>${script.title || "-"}</td>
        <td>${script.writer || "-"}</td>
        <td>${script.status || "-"}</td>
        <td>${script.averageRating || 0}/10</td>
        <td>
          ${script.scriptUrl ? `<a href="http://localhost:5000/api/scripts/${script._id}/read" target="_blank" style="color:#93c5fd;">Open</a>` : "No file"}
        </td>
        <td>
          <button class="table-btn select-btn" onclick="selectScript('${script._id}')">Select</button>
          <button class="table-btn approve-btn" onclick="markPreProduction('${script._id}')">Pre-Production</button>
          <button class="table-btn delete-btn" onclick="deleteScript('${script._id}')">Delete</button>
        </td>
      </tr>
    `).join("");
  } catch (error) {
    console.error("loadScripts error:", error);
    scriptsTableBody.innerHTML = `<tr><td colspan="6">${error.message}</td></tr>`;
  }
}

async function loadChatrooms() {
  if (!chatroomsTableBody) return;

  try {
    const data = await fetchJson(`${API_BASE_URL}/chatrooms`, {
      method: "GET",
      headers: authHeaders(false)
    });

    const chatrooms = data.chatrooms || [];

    if (!chatrooms.length) {
      chatroomsTableBody.innerHTML = `<tr><td colspan="5">No chatrooms found</td></tr>`;
      return;
    }

    chatroomsTableBody.innerHTML = chatrooms.map(room => `
      <tr>
        <td>${room.title || "-"}</td>
        <td>${room.topic || "-"}</td>
        <td>${room.startTime ? new Date(room.startTime).toLocaleString() : "-"}</td>
        <td>${room.endTime ? new Date(room.endTime).toLocaleString() : "-"}</td>
        <td>${room.status || "active"}</td>
      </tr>
    `).join("");
  } catch (error) {
    console.error("loadChatrooms error:", error);
    chatroomsTableBody.innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
  }
}

async function removeUser(userId) {
  try {
    await fetchJson(`${API_BASE_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: authHeaders(false)
    });

    showMessage("User removed successfully", "#86efac");
    await loadUsers();
  } catch (error) {
    showMessage(error.message, "#fca5a5");
  }
}

async function selectScript(scriptId) {
  try {
    await fetchJson(`${API_BASE_URL}/admin/scripts/${scriptId}/select`, {
      method: "PUT",
      headers: authHeaders()
    });

    showMessage("Script selected successfully", "#86efac");
    await loadScripts();
  } catch (error) {
    showMessage(error.message, "#fca5a5");
  }
}

async function markPreProduction(scriptId) {
  try {
    await fetchJson(`${API_BASE_URL}/admin/scripts/${scriptId}/preproduction`, {
      method: "PUT",
      headers: authHeaders()
    });

    showMessage("Script moved to pre-production", "#86efac");
    await loadScripts();
  } catch (error) {
    showMessage(error.message, "#fca5a5");
  }
}

async function deleteScript(scriptId) {
  try {
    await fetchJson(`${API_BASE_URL}/admin/scripts/${scriptId}`, {
      method: "DELETE",
      headers: authHeaders(false)
    });

    showMessage("Script deleted successfully", "#86efac");
    await loadScripts();
  } catch (error) {
    showMessage(error.message, "#fca5a5");
  }
}

if (preProductionForm) {
  preProductionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const scriptId = document.getElementById("preScriptId").value.trim();

    try {
      await fetchJson(`${API_BASE_URL}/admin/scripts/${scriptId}/preproduction`, {
        method: "PUT",
        headers: authHeaders()
      });

      showMessage("Pre-production started successfully", "#86efac");
      preProductionForm.reset();
      await loadScripts();
    } catch (error) {
      showMessage(error.message, "#fca5a5");
    }
  });
}

if (crowdfundingForm) {
  crowdfundingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const scriptId = document.getElementById("crowdProjectId").value.trim();
    const fundingGoal = document.getElementById("fundGoal").value;
    const title = document.getElementById("campaignTitle").value.trim();
    const description = document.getElementById("campaignDescription").value.trim();

    try {
      await fetchJson(`${API_BASE_URL}/crowdfunding`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          scriptId,
          fundingGoal,
          title,
          description
        })
      });

      showMessage("Crowdfunding campaign created successfully", "#86efac");
      crowdfundingForm.reset();
      await loadScripts();
    } catch (error) {
      showMessage(error.message, "#fca5a5");
    }
  });
}

if (adminLogoutBtn) {
  adminLogoutBtn.addEventListener("click", () => {
    redirectToAdminLogin();
  });
}

if (refreshUsersBtn) {
  refreshUsersBtn.addEventListener("click", loadUsers);
}

if (refreshScriptsBtn) {
  refreshScriptsBtn.addEventListener("click", loadScripts);
}

async function initAdminDashboard() {
  const adminUser = await verifyAdminAccess();
  if (!adminUser) return;

  if (adminWelcome) {
    adminWelcome.textContent = `Welcome, ${adminUser.name || "Admin"}`;
  }

  await Promise.all([
    loadUsers(),
    loadScripts(),
    loadChatrooms()
  ]);
}

initAdminDashboard();