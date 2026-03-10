if (typeof document === "undefined") {
  console.log("This file must run in browser, not Node.js");
  process.exit();
}

const API_BASE_URL = "http://localhost:5000/api";

const adminWelcome = document.getElementById("adminWelcome");
const adminGlobalMessage = document.getElementById("adminGlobalMessage");
const totalUsers = document.getElementById("totalUsers");
const pendingUsers = document.getElementById("pendingUsers");
const pendingScripts = document.getElementById("pendingScripts");
const selectedScripts = document.getElementById("selectedScripts");
const usersTableBody = document.getElementById("usersTableBody");
const scriptsTableBody = document.getElementById("scriptsTableBody");

/* NEW CHATROOM ELEMENTS */
const chatroomForm = document.getElementById("chatroomForm");
const chatroomsTableBody = document.getElementById("chatroomsTableBody");

const refreshUsersBtn = document.getElementById("refreshUsersBtn");
const refreshScriptsBtn = document.getElementById("refreshScriptsBtn");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");

const preProductionForm = document.getElementById("preProductionForm");
const roleRequestForm = document.getElementById("roleRequestForm");
const budgetForm = document.getElementById("budgetForm");
const crowdfundingForm = document.getElementById("crowdfundingForm");
const competitionForm = document.getElementById("competitionForm");

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function showMessage(message, color = "lightgreen") {
  if (!adminGlobalMessage) return;

  adminGlobalMessage.textContent = message;
  adminGlobalMessage.style.color = color;

  setTimeout(() => {
    adminGlobalMessage.textContent = "";
  }, 3000);
}

function logoutAdmin() {
  localStorage.removeItem("token");
  localStorage.removeItem("adminUser");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("adminUser");
  window.location.href = "admin_login.html";
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
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

async function checkAdminAccess() {
  const token = getToken();

  if (!token) {
    window.location.href = "admin_login.html";
    return;
  }

  try {
    const data = await fetchJson(`${API_BASE_URL}/auth/profile`, {
      method: "GET",
      headers: authHeaders(false)
    });

    if (data.role !== "admin") {
      showMessage("Only admin can access this page", "red");
      setTimeout(logoutAdmin, 1000);
      return;
    }

    if (adminWelcome) {
      adminWelcome.textContent = `Welcome, ${data.name}`;
    }
  } catch (error) {
    showMessage(error.message, "red");
    setTimeout(logoutAdmin, 1000);
  }
}

async function loadStats() {
  try {
    const data = await fetchJson(`${API_BASE_URL}/admin/stats`, {
      method: "GET",
      headers: authHeaders(false)
    });

    if (totalUsers) totalUsers.textContent = data.totalUsers || 0;
    if (pendingUsers) pendingUsers.textContent = data.pendingUsers || 0;
    if (pendingScripts) pendingScripts.textContent = data.pendingScripts || 0;
    if (selectedScripts) selectedScripts.textContent = data.selectedScripts || 0;
  } catch (error) {
    showMessage(error.message, "red");
  }
}

async function loadUsers() {
  if (!usersTableBody) return;

  usersTableBody.innerHTML = `<tr><td colspan="6">Loading users...</td></tr>`;

  try {
    const data = await fetchJson(`${API_BASE_URL}/admin/users`, {
      method: "GET",
      headers: authHeaders(false)
    });

    const users = data.users || [];

    if (!users.length) {
      usersTableBody.innerHTML = `<tr><td colspan="6">No users found</td></tr>`;
      return;
    }

    usersTableBody.innerHTML = users.map((user) => `
      <tr>
        <td>${user.name || ""}</td>
        <td>${user.email || ""}</td>
        <td>${user.role || ""}</td>
        <td>${user.status || "approved"}</td>
        <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
        <td>
          ${user.status !== "approved" ? `<button class="table-btn approve-btn" onclick="approveUser('${user._id}')">Approve</button>` : ""}
          <button class="table-btn delete-btn" onclick="removeUser('${user._id}')">Remove</button>
        </td>
      </tr>
    `).join("");
  } catch (error) {
    usersTableBody.innerHTML = `<tr><td colspan="6">${error.message}</td></tr>`;
    showMessage(error.message, "red");
  }
}

async function approveUser(userId) {
  try {
    const data = await fetchJson(`${API_BASE_URL}/admin/users/${userId}/approve`, {
      method: "PATCH",
      headers: authHeaders()
    });

    showMessage(data.message || "User approved");
    await loadUsers();
    await loadStats();
  } catch (error) {
    showMessage(error.message, "red");
  }
}

async function removeUser(userId) {
  const confirmed = confirm("Are you sure you want to remove this user?");
  if (!confirmed) return;

  try {
    const data = await fetchJson(`${API_BASE_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: authHeaders(false)
    });

    showMessage(data.message || "User removed");
    await loadUsers();
    await loadStats();
  } catch (error) {
    showMessage(error.message, "red");
  }
}

async function loadScripts() {
  if (!scriptsTableBody) return;

  scriptsTableBody.innerHTML = `<tr><td colspan="6">Loading scripts...</td></tr>`;

  try {
    const data = await fetchJson(`${API_BASE_URL}/admin/scripts`, {
      method: "GET",
      headers: authHeaders(false)
    });

    const scripts = data.scripts || [];

    if (!scripts.length) {
      scriptsTableBody.innerHTML = `<tr><td colspan="6">No scripts found</td></tr>`;
      return;
    }

    scriptsTableBody.innerHTML = scripts.map((script) => `
      <tr>
        <td>${script.title || ""}</td>
        <td>${script.writer?.name || "Unknown"}</td>
        <td>${script.status || "pending"}</td>
        <td>${script.rank || 0}</td>
        <td>
          ${
            script.file
              ? `<a href="http://localhost:5000/uploads/${script.file}" target="_blank">View File</a>`
              : "No File"
          }
        </td>
        <td>
          ${script.status !== "approved" ? `<button class="table-btn approve-btn" onclick="approveScript('${script._id}')">Approve</button>` : ""}
          ${script.status !== "selected" ? `<button class="table-btn select-btn" onclick="selectScript('${script._id}')">Select</button>` : ""}
          <button class="table-btn reject-btn" onclick="rejectScript('${script._id}')">Reject</button>
        </td>
      </tr>
    `).join("");
  } catch (error) {
    scriptsTableBody.innerHTML = `<tr><td colspan="6">${error.message}</td></tr>`;
    showMessage(error.message, "red");
  }
}

async function approveScript(scriptId) {
  try {
    const data = await fetchJson(`${API_BASE_URL}/admin/scripts/${scriptId}/approve`, {
      method: "PATCH",
      headers: authHeaders()
    });

    showMessage(data.message || "Script approved");
    await loadScripts();
    await loadStats();
  } catch (error) {
    showMessage(error.message, "red");
  }
}

async function rejectScript(scriptId) {
  try {
    const data = await fetchJson(`${API_BASE_URL}/admin/scripts/${scriptId}/reject`, {
      method: "PATCH",
      headers: authHeaders()
    });

    showMessage(data.message || "Script rejected");
    await loadScripts();
    await loadStats();
  } catch (error) {
    showMessage(error.message, "red");
  }
}

async function selectScript(scriptId) {
  try {
    const data = await fetchJson(`${API_BASE_URL}/admin/scripts/${scriptId}/select`, {
      method: "PATCH",
      headers: authHeaders()
    });

    showMessage(data.message || "Script selected");
    await loadScripts();
    await loadStats();
  } catch (error) {
    showMessage(error.message, "red");
  }
}

if (preProductionForm) {
  preProductionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      scriptId: document.getElementById("preScriptId").value.trim(),
      writerApproval: document.getElementById("writerApproval").value,
      notes: document.getElementById("preNotes").value.trim()
    };

    try {
      const data = await fetchJson(`${API_BASE_URL}/admin/preproduction/start`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });

      showMessage(data.message || "Pre-production started");
      preProductionForm.reset();
    } catch (error) {
      showMessage(error.message, "red");
    }
  });
}

if (roleRequestForm) {
  roleRequestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      projectId: document.getElementById("roleProjectId").value.trim(),
      receiverId: document.getElementById("receiverId").value.trim(),
      role: document.getElementById("roleNeeded").value,
      message: document.getElementById("roleMessage").value.trim()
    };

    try {
      const data = await fetchJson(`${API_BASE_URL}/admin/role-request`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });

      showMessage(data.message || "Role request sent");
      roleRequestForm.reset();
    } catch (error) {
      showMessage(error.message, "red");
    }
  });
}

if (budgetForm) {
  budgetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      projectId: document.getElementById("budgetProjectId").value.trim(),
      budget: Number(document.getElementById("projectBudget").value),
      notes: document.getElementById("budgetNotes").value.trim()
    };

    try {
      const data = await fetchJson(`${API_BASE_URL}/admin/budget`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });

      showMessage(data.message || "Budget saved");
      budgetForm.reset();
    } catch (error) {
      showMessage(error.message, "red");
    }
  });
}

if (crowdfundingForm) {
  crowdfundingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      projectId: document.getElementById("crowdProjectId").value.trim(),
      fundingGoal: Number(document.getElementById("fundGoal").value),
      title: document.getElementById("campaignTitle").value.trim(),
      description: document.getElementById("campaignDescription").value.trim()
    };

    try {
      const data = await fetchJson(`${API_BASE_URL}/admin/crowdfunding`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });

      showMessage(data.message || "Crowdfunding campaign created");
      crowdfundingForm.reset();
    } catch (error) {
      showMessage(error.message, "red");
    }
  });
}

if (competitionForm) {
  competitionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      title: document.getElementById("compTitle").value.trim(),
      deadline: document.getElementById("compDeadline").value,
      description: document.getElementById("compDescription").value.trim()
    };

    try {
      const data = await fetchJson(`${API_BASE_URL}/admin/competition`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });

      showMessage(data.message || "Competition created");
      competitionForm.reset();
    } catch (error) {
      showMessage(error.message, "red");
    }
  });
}

/* =========================
   CHATROOM MANAGEMENT
========================= */

async function loadChatrooms() {
  if (!chatroomsTableBody) return;

  chatroomsTableBody.innerHTML = `<tr><td colspan="5">Loading chatrooms...</td></tr>`;

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

    chatroomsTableBody.innerHTML = chatrooms.map((room) => {
      const startTime = room.startTime ? new Date(room.startTime).toLocaleString() : "-";
      const endTime = room.endTime ? new Date(room.endTime).toLocaleString() : "-";
      const status = room.status || "Active";

      return `
        <tr>
          <td>${room.title || ""}</td>
          <td>${room.topic || ""}</td>
          <td>${startTime}</td>
          <td>${endTime}</td>
          <td>${status}</td>
        </tr>
      `;
    }).join("");
  } catch (error) {
    chatroomsTableBody.innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
    showMessage(error.message, "red");
  }
}

if (chatroomForm) {
  chatroomForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      title: document.getElementById("chatroomTitle").value.trim(),
      topic: document.getElementById("chatroomTopic").value.trim(),
      description: document.getElementById("chatroomDescription").value.trim(),
      startTime: document.getElementById("chatroomStartTime").value,
      endTime: document.getElementById("chatroomEndTime").value
    };

    if (!payload.title || !payload.topic || !payload.description || !payload.startTime || !payload.endTime) {
      showMessage("Please fill all chatroom fields", "red");
      return;
    }

    if (new Date(payload.endTime) <= new Date(payload.startTime)) {
      showMessage("End time must be greater than start time", "red");
      return;
    }

    try {
      const data = await fetchJson(`${API_BASE_URL}/chatrooms`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });

      showMessage(data.message || "Chatroom created successfully");
      chatroomForm.reset();
      await loadChatrooms();
    } catch (error) {
      showMessage(error.message, "red");
    }
  });
}

if (refreshUsersBtn) refreshUsersBtn.addEventListener("click", loadUsers);
if (refreshScriptsBtn) refreshScriptsBtn.addEventListener("click", loadScripts);
if (adminLogoutBtn) adminLogoutBtn.addEventListener("click", logoutAdmin);

async function initAdminPage() {
  await checkAdminAccess();
  await Promise.all([
    loadStats(),
    loadUsers(),
    loadScripts(),
    loadChatrooms()
  ]);
}

initAdminPage();

/* expose functions for inline buttons */
window.approveUser = approveUser;
window.removeUser = removeUser;
window.approveScript = approveScript;
window.rejectScript = rejectScript;
window.selectScript = selectScript;