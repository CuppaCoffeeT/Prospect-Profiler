// ── MANAGER-ONLY PAGES ──

// ── MANAGE ALL ACCOUNTS ──
async function renderManageAccounts() {
  var app = document.getElementById("app");
  app.innerHTML = '<div class="loading-wrap"><div class="spinner"></div></div>';
  document.getElementById("prg").style.display = "none";
  document.getElementById("hSub").textContent = "Manage Accounts";

  var r = await sbGetAllProfiles();
  var profiles = r.data || [];

  var h = '<span class="ey">All Accounts</span>'
    + '<div style="font-size:11px;color:var(--mu);font-family:sans-serif;margin-bottom:12px">' + profiles.length + ' registered user' + (profiles.length !== 1 ? 's' : '') + '</div>';

  if (profiles.length === 0) {
    h += '<div class="empty-state"><div class="empty-icon">&#128100;</div><div>No accounts found.</div></div>';
  } else {
    profiles.forEach(function(p) {
      var roleCls = p.role === "manager" ? "role-manager" : "role-advisor";
      var roleLabel = p.role === "manager" ? "Manager" : "Advisor";
      var joinDate = new Date(p.created_at).toLocaleDateString("en-SG", {day: "2-digit", month: "short", year: "numeric"});

      h += '<div class="card" style="padding:14px 15px">'
        + '<div style="display:flex;align-items:center;gap:12px">'
        + '<div style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;font-family:sans-serif;color:var(--gold)">'
        + (p.username ? p.username[0].toUpperCase() : "?")
        + '</div>'
        + '<div style="flex:1">'
        + '<div style="font-size:14px;font-weight:700;font-family:sans-serif">' + escH(p.full_name || p.username) + '</div>'
        + '<div style="font-size:12px;color:var(--mu);font-family:sans-serif">' + escH(p.email) + '</div>'
        + '</div>'
        + '<div style="text-align:right">'
        + '<span class="role-badge ' + roleCls + '">' + roleLabel + '</span>'
        + '<div style="font-size:10px;color:var(--mu);font-family:sans-serif;margin-top:4px">' + joinDate + '</div>'
        + '</div>'
        + '</div></div>';
    });
  }

  app.innerHTML = h;
  renderNavBar();
}

// ── ROLE SETTINGS ──
function renderRoleSettings() {
  document.getElementById("prg").style.display = "none";
  document.getElementById("hSub").textContent = "Role Settings";

  var h = '<span class="ey">Role Configuration</span>'

    + '<div class="card">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">'
    + '<span style="font-size:22px">&#128188;</span>'
    + '<div>'
    + '<div style="font-size:15px;font-weight:700;font-family:sans-serif">Advisor</div>'
    + '<div style="font-size:11px;color:var(--mu);font-family:sans-serif">Default role for all sign-ups</div>'
    + '</div></div>'
    + '<div style="font-size:12px;color:var(--mu);font-family:sans-serif;line-height:1.8">'
    + '&#10003; Profile prospects (DISC + MBTI)<br>'
    + '&#10003; Save results to database<br>'
    + '&#10003; View & manage own results<br>'
    + '&#10003; Export PDF & CSV<br>'
    + '&#10003; Edit own account details'
    + '</div></div>'

    + '<div class="card" style="border-color:rgba(26,95,138,.3)">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">'
    + '<span style="font-size:22px">&#128081;</span>'
    + '<div>'
    + '<div style="font-size:15px;font-weight:700;font-family:sans-serif">Manager</div>'
    + '<div style="font-size:11px;color:var(--mu);font-family:sans-serif">Promoted via SQL only</div>'
    + '</div></div>'
    + '<div style="font-size:12px;color:var(--mu);font-family:sans-serif;line-height:1.8">'
    + '&#10003; Everything an Advisor can do<br>'
    + '&#10003; View all advisors\' results<br>'
    + '&#10003; View all registered accounts<br>'
    + '&#10003; Access role settings page'
    + '</div></div>'

    + '<div class="card" style="background:rgba(201,168,76,.06);border-color:rgba(201,168,76,.2)">'
    + '<span class="ey">How to Change Roles</span>'
    + '<div style="font-size:13px;color:var(--mu);font-family:sans-serif;line-height:1.7">'
    + 'Role changes are managed via SQL in the Supabase dashboard:<br><br>'
    + '<div style="background:rgba(0,0,0,.3);border-radius:8px;padding:10px 12px;font-family:monospace;font-size:12px;color:var(--gold);line-height:1.6;overflow-x:auto">'
    + 'UPDATE public.profiles<br>SET role = \'manager\'<br>WHERE email = \'user@example.com\';'
    + '</div>'
    + '</div></div>';

  document.getElementById("app").innerHTML = h;
  renderNavBar();
}
