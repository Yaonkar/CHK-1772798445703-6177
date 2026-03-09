<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MovieMark Admin Dashboard</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <div class="admin-dashboard">
    <aside class="admin-sidebar">
      <div class="sidebar-logo">
        <h2>MovieMark</h2>
        <p>Admin Panel</p>
      </div>

      <ul class="sidebar-menu">
        <li><a href="#overview" class="active">Dashboard</a></li>
        <li><a href="#users">User Management</a></li>
        <li><a href="#scripts">Script Moderation</a></li>
        <li><a href="#selection">Script Selection</a></li>
        <li><a href="#preproduction">Pre-Production</a></li>
        <li><a href="#roles">Role Requests</a></li>
        <li><a href="#budget">Budget & Crowdfunding</a></li>
        <li><a href="#competitions">Competitions</a></li>
        <li><a href="#monitoring">Platform Monitoring</a></li>
      </ul>

      <button id="adminLogoutBtn" class="logout-btn">Logout</button>
    </aside>

    <main class="admin-main">
      <header class="admin-topbar" id="overview">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage MovieMark platform operations</p>
        </div>
        <div class="admin-user-info">
          <span id="adminWelcome">Welcome, Admin</span>
        </div>
      </header>

      <p id="adminGlobalMessage" class="admin-global-message"></p>

      <section class="stats-grid">
        <div class="stat-card">
          <h3>Total Users</h3>
          <p id="totalUsers">0</p>
        </div>
        <div class="stat-card">
          <h3>Pending Users</h3>
          <p id="pendingUsers">0</p>
        </div>
        <div class="stat-card">
          <h3>Pending Scripts</h3>
          <p id="pendingScripts">0</p>
        </div>
        <div class="stat-card">
          <h3>Selected Scripts</h3>
          <p id="selectedScripts">0</p>
        </div>
      </section>

      <section class="admin-section" id="users">
        <div class="section-header">
          <h2>User Management</h2>
          <button id="refreshUsersBtn" class="action-btn primary-btn">Refresh</button>
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="usersTableBody">
              <tr><td colspan="6">Loading users...</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="admin-section" id="scripts">
        <div class="section-header">
          <h2>Script Moderation</h2>
          <button id="refreshScriptsBtn" class="action-btn primary-btn">Refresh</button>
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Writer</th>
                <th>Status</th>
                <th>Rank</th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="scriptsTableBody">
              <tr><td colspan="6">Loading scripts...</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="admin-section" id="selection">
        <div class="section-header">
          <h2>Script Selection</h2>
        </div>
        <div class="feature-box">
          <p>Admin monitors ranking and selects strong scripts for development.</p>
        </div>
      </section>

      <section class="admin-section form-section" id="preproduction">
        <div class="section-header">
          <h2>Pre-Production Initiation</h2>
        </div>
        <form id="preProductionForm">
          <div class="form-row">
            <input type="text" id="preScriptId" placeholder="Script ID" required />
            <select id="writerApproval" required>
              <option value="">Writer Approval</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <textarea id="preNotes" placeholder="Pre-production notes" required></textarea>
          <button type="submit" class="action-btn primary-btn">Start Pre-Production</button>
        </form>
      </section>

      <section class="admin-section form-section" id="roles">
        <div class="section-header">
          <h2>Role Request Management</h2>
        </div>
        <form id="roleRequestForm">
          <div class="form-row">
            <input type="text" id="roleProjectId" placeholder="Project ID" required />
            <input type="text" id="receiverId" placeholder="Receiver User ID" required />
          </div>
          <div class="form-row">
            <select id="roleNeeded" required>
              <option value="">Select Role</option>
              <option value="director">Director</option>
              <option value="actor">Actor</option>
              <option value="editor">Editor</option>
              <option value="crew">Crew</option>
            </select>
          </div>
          <textarea id="roleMessage" placeholder="Write request message" required></textarea>
          <button type="submit" class="action-btn primary-btn">Send Role Request</button>
        </form>
      </section>

      <section class="admin-section form-section" id="budget">
        <div class="section-header">
          <h2>Budget & Crowdfunding Control</h2>
        </div>

        <form id="budgetForm">
          <div class="form-row">
            <input type="text" id="budgetProjectId" placeholder="Project ID" required />
            <input type="number" id="projectBudget" placeholder="Budget Amount" required />
          </div>
          <textarea id="budgetNotes" placeholder="Budget notes" required></textarea>
          <button type="submit" class="action-btn primary-btn">Save Budget</button>
        </form>

        <form id="crowdfundingForm" class="top-space">
          <div class="form-row">
            <input type="text" id="crowdProjectId" placeholder="Project ID" required />
            <input type="number" id="fundGoal" placeholder="Funding Goal" required />
          </div>
          <input type="text" id="campaignTitle" placeholder="Campaign Title" required />
          <textarea id="campaignDescription" placeholder="Campaign Description" required></textarea>
          <button type="submit" class="action-btn success-btn">Create Crowdfunding Campaign</button>
        </form>
      </section>

      <section class="admin-section form-section" id="competitions">
        <div class="section-header">
          <h2>Competition Management</h2>
        </div>

        <form id="competitionForm">
          <input type="text" id="compTitle" placeholder="Competition Title" required />
          <input type="date" id="compDeadline" required />
          <textarea id="compDescription" placeholder="Competition details" required></textarea>
          <button type="submit" class="action-btn warning-btn">Create Competition</button>
        </form>
      </section>

      <section class="admin-section" id="monitoring">
        <div class="section-header">
          <h2>Platform Monitoring</h2>
        </div>
        <div class="feature-box">
          <p>Admin monitors activity for moderation, security, transparency, and collaboration control.</p>
        </div>
      </section>
    </main>
  </div>

  <script src="js/admin.js"></script>
</body>
</html>