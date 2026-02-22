// Simple SPA navigation
const mainContent = document.getElementById('mainContent');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const dashboardBtn = document.getElementById('dashboardBtn');

function updateNavButtons() {
  const token = localStorage.getItem('token');
  if (token) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    dashboardBtn.style.display = '';
  } else {
    loginBtn.style.display = '';
    registerBtn.style.display = '';
    dashboardBtn.style.display = 'none';
  }
}

function showLogin() {
  mainContent.innerHTML = `
    <div class="form-card">
      <h2 style="text-align:center;margin-bottom:18px;">Login</h2>
      <form id="loginForm">
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" required />
        </div>
        <button class="submit" type="submit">Login</button>
      </form>
      <div id="loginMsg"></div>
    </div>
  `;
  document.getElementById('loginForm').onsubmit = async function(e) {
    e.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    });
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      updateNavButtons();
      document.getElementById('loginMsg').innerHTML = '<span style="color:green">Login successful!</span>';
      setTimeout(() => showDashboard(), 600);
    } else {
      document.getElementById('loginMsg').innerHTML = '<span style="color:red">Login failed!</span>';
    }
  };
}

function showRegister() {
  mainContent.innerHTML = `
    <div class="form-card">
      <h2 style="text-align:center;margin-bottom:18px;">Register</h2>
      <form id="registerForm">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" name="full_name" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" required />
        </div>
        <div class="form-group">
          <label>Role</label>
          <select name="role">
            <option value="Marketing Executive">Marketing Executive</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button class="submit" type="submit">Register</button>
      </form>
      <div id="registerMsg"></div>
    </div>
  `;
  document.getElementById('registerForm').onsubmit = async function(e) {
    e.preventDefault();
    const full_name = this.full_name.value;
    const email = this.email.value;
    const password = this.password.value;
    const role = this.role.value;
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({full_name, email, password, role})
    });
    const data = await res.json();
    if (data.id) {
      document.getElementById('registerMsg').innerHTML = '<span style="color:green">Registration successful!</span>';
      setTimeout(() => showLogin(), 700);
    } else {
      document.getElementById('registerMsg').innerHTML = '<span style="color:red">Registration failed!</span>';
    }
  };
}

function showDashboard() {
  const token = localStorage.getItem('token');
  if (!token) {
    showLogin();
    return;
  }
  const userRole = getUserRole();
  mainContent.innerHTML = `
    <div class="dashboard-header" style="background:linear-gradient(90deg,#e0e7ff 60%,#f7f8fa 100%);padding:24px 18px 10px 18px;border-radius:14px;box-shadow:0 2px 12px rgba(45,108,223,0.08);margin-bottom:24px;">
      <h2><span class="icon">📊</span> Welcome to your Dashboard</h2>
      <div style="color:#2d6cdf;font-size:1.1em;font-weight:500;margin-bottom:8px;">Logged in as <span style="font-weight:700;">${userRole || 'User'}</span></div>
      <div class="dashboard-btns">
        <button class="dash-btn" onclick="showLeads()">Leads</button>
        <button class="dash-btn" onclick="showCampaigns()">Campaigns</button>
        <button class="dash-btn logout-btn" onclick="logout()">Logout</button>
      </div>
    </div>
    <div id="dashboardContent"></div>
  `;
}

function getUserRole() {
  // Decode JWT to get role (simple base64 decode, not secure for prod)
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
}

window.showLeads = async function() {
  const token = localStorage.getItem('token');
  if (!token) {
    showLogin();
    return;
  }
  const res = await fetch('/leads/', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const leads = await res.json();
  let html = `<div class="section-header"><h3><span class="icon">👥</span> Leads</h3>`;
  html += '<button class="submit" style="float:right;margin-bottom:12px;" onclick="showAddLead()">Add Lead</button>';
  html += '</div>';
  if (leads.length === 0) {
    html += '<div class="empty-state">No leads found.</div>';
  }
  leads.forEach(lead => {
    html += `<div class="card">
      <b>${lead.name}</b> <span class="badge status-${lead.status.toLowerCase()}">${lead.status}</span><br>
      <span class="lead-info">📧 ${lead.email} &nbsp; ${lead.phone ? '📞 ' + lead.phone : ''}</span>
    </div>`;
  });
  document.getElementById('dashboardContent').innerHTML = html;
};

window.showAddLead = function() {
  if (!localStorage.getItem('token')) {
    showLogin();
    return;
  }
  document.getElementById('dashboardContent').innerHTML = `
    <div class="form-card">
      <h3><span class="icon">➕</span> Add Lead</h3>
      <form id="addLeadForm">
        <div class="form-group">
          <label>Name</label>
          <input name="name" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input name="email" required />
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input name="phone" />
        </div>
        <div class="form-group">
          <label>Status</label>
          <select name="status">
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        <button class="submit" type="submit">Add Lead</button>
      </form>
      <div id="addLeadMsg"></div>
    </div>
  `;
  document.getElementById('addLeadForm').onsubmit = async function(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const name = this.name.value;
    const email = this.email.value;
    const phone = this.phone.value;
    const status = this.status.value;
    const res = await fetch('/leads/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({name, email, phone, status})
    });
    let data;
    try {
      data = await res.json();
    } catch (err) {
      document.getElementById('addLeadMsg').innerHTML = '<span style="color:red">Failed to add lead!</span>';
      return;
    }
    if (res.status === 400 && data.detail && data.detail.includes('already exists')) {
      document.getElementById('addLeadMsg').innerHTML = '<span style="color:red">Lead already exists with this email!</span>';
    } else if (data.id) {
      document.getElementById('addLeadMsg').innerHTML = '<span style="color:green">Lead added!</span>';
      showLeads();
    } else {
      document.getElementById('addLeadMsg').innerHTML = '<span style="color:red">Failed to add lead!</span>';
    }
  };
};

window.showCampaigns = async function() {
  const token = localStorage.getItem('token');
  const userRole = getUserRole();
  const res = await fetch('/campaigns/', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const campaigns = await res.json();
  let html = `<div class="section-header"><h3><span class="icon">📢</span> Campaigns</h3>`;
  if (userRole === 'Admin') {
    html += '<button class="submit" style="float:right;margin-bottom:12px;" onclick="showAddCampaign()">Add Campaign</button>';
  }
  html += '</div>';
  if (campaigns.length === 0) {
    html += '<div class="empty-state">No campaigns found.</div>';
  }
  campaigns.forEach(campaign => {
    html += `<div class="card">
      <b>${campaign.name}</b><br>
      <span class="desc">${campaign.description || ''}</span>
    </div>`;
  });
  document.getElementById('dashboardContent').innerHTML = html;
};

window.showAddCampaign = function() {
  if (getUserRole() !== 'Admin') {
    document.getElementById('dashboardContent').innerHTML = '<div class="empty-state">Only the Admin can add campaigns.</div>';
    return;
  }
  document.getElementById('dashboardContent').innerHTML = `
    <div class="form-card">
      <h3><span class="icon">➕</span> Add Campaign</h3>
      <form id="addCampaignForm">
        <div class="form-group">
          <label>Name</label>
          <input name="name" required />
        </div>
        <div class="form-group">
          <label>Description</label>
          <input name="description" />
        </div>
        <button class="submit" type="submit">Add Campaign</button>
      </form>
      <div id="addCampaignMsg"></div>
    </div>
  `;
  document.getElementById('addCampaignForm').onsubmit = async function(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const name = this.name.value;
    const description = this.description.value;
    const res = await fetch('/campaigns/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({name, description})
    });
    const data = await res.json();
    if (data.id) {
      document.getElementById('addCampaignMsg').innerHTML = '<span style="color:green">Campaign added!</span>';
      showCampaigns();
    } else {
      document.getElementById('addCampaignMsg').innerHTML = '<span style="color:red">Failed to add campaign!</span>';
    }
  };
};

window.logout = function() {
  localStorage.removeItem('token');
  updateNavButtons();
  showLogin();
};

loginBtn.onclick = showLogin;
registerBtn.onclick = showRegister;
dashboardBtn.onclick = showDashboard;

updateNavButtons();
// Show login or dashboard by default
if (localStorage.getItem('token')) {
  showDashboard();
} else {
  showLogin();
}
