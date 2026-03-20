// ── ACCOUNT DETAILS PAGE ──

function renderAccount() {
  var app = document.getElementById("app");
  var p = currentProfile;
  document.getElementById("prg").style.display = "none";
  document.getElementById("hSub").textContent = "Account Details";

  if (!p) {
    app.innerHTML = '<div class="loading-wrap"><div class="spinner"></div></div>';
    return;
  }

  var roleCls = p.role === "manager" ? "role-manager" : "role-advisor";
  var roleLabel = p.role === "manager" ? "Manager" : "Advisor";
  var joinDate = new Date(p.created_at).toLocaleDateString("en-SG", {day: "2-digit", month: "short", year: "numeric"});

  var h = '<span class="ey">Your Account</span>'
    + '<div class="card">'
    + '<div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">'
    + '<div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gl));display:flex;align-items:center;justify-content:center;font-size:22px;color:#1A1200;font-weight:700;font-family:sans-serif">'
    + (p.username ? p.username[0].toUpperCase() : "?")
    + '</div>'
    + '<div>'
    + '<div style="font-size:16px;font-weight:700;font-family:sans-serif">' + escH(p.full_name || p.username) + '</div>'
    + '<span class="role-badge ' + roleCls + '">' + roleLabel + '</span>'
    + '</div>'
    + '</div>'

    + '<label class="lbl" style="margin-top:0">Username</label>'
    + '<input type="text" id="acUser" value="' + escH(p.username || '') + '" placeholder="Username">'

    + '<label class="lbl">Full Name</label>'
    + '<input type="text" id="acName" value="' + escH(p.full_name || '') + '" placeholder="Your full name">'

    + '<label class="lbl">Email</label>'
    + '<input type="email" value="' + escH(p.email || '') + '" disabled style="opacity:.5">'

    + '<label class="lbl">Role</label>'
    + '<input type="text" value="' + roleLabel + '" disabled style="opacity:.5">'

    + '<label class="lbl">Joined</label>'
    + '<input type="text" value="' + joinDate + '" disabled style="opacity:.5">'

    + '<button class="bnx" style="width:100%;margin-top:16px" onclick="updateAccount()">Save Changes</button>'
    + '</div>'

    + '<button class="arst" style="color:var(--D);border-color:rgba(192,57,43,.3)" onclick="doLogout()">Sign Out</button>';

  app.innerHTML = h;
  renderNavBar();
}

async function updateAccount() {
  var username = document.getElementById("acUser").value.trim();
  var fullName = document.getElementById("acName").value.trim();

  if (!username || username.length < 3) {
    toast("Username must be at least 3 characters");
    return;
  }

  var r = await sbUpdateProfile(currentProfile.id, {
    username: username,
    full_name: fullName || username
  });

  if (r.error) {
    toast("Error: " + r.error.message);
    return;
  }

  currentProfile.username = username;
  currentProfile.full_name = fullName || username;
  toast("Account updated!");
  renderAccount();
}

async function doLogout() {
  await sbLogout();
  currentProfile = null;
  location.hash = "#/login";
}
