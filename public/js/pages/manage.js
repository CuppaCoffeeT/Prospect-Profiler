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
      var isMe = currentProfile && p.id === currentProfile.id;
      var isMgr = p.role === "manager";
      var roleCls = isMgr ? "role-manager" : "role-advisor";
      var roleLabel = isMgr ? "Manager" : "Advisor";
      var joinDate = new Date(p.created_at).toLocaleDateString("en-SG", {day: "2-digit", month: "short", year: "numeric"});
      var newRole = isMgr ? "advisor" : "manager";
      var btnLabel = isMgr ? "Demote to Advisor" : "Promote to Manager";
      var btnStyle = isMgr
        ? "background:rgba(192,57,43,.12);border:1px solid rgba(192,57,43,.3);color:#E74C3C"
        : "background:rgba(26,95,138,.12);border:1px solid rgba(26,95,138,.3);color:#5BA4CF";

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
        + '</div>'
        + (isMe ? '<div style="font-size:11px;color:var(--mu);font-family:sans-serif;margin-top:10px;text-align:center;font-style:italic">This is you</div>'
          : '<button onclick="changeRole(\'' + p.id + '\',\'' + newRole + '\')" style="margin-top:10px;width:100%;padding:9px;border-radius:8px;font-family:sans-serif;font-size:12px;font-weight:600;cursor:pointer;' + btnStyle + '">' + btnLabel + '</button>')
        + '</div>';
    });
  }

  app.innerHTML = h;
  renderHeaderRight();
}



// ── CHANGE USER ROLE ──
async function changeRole(userId, newRole) {
  var label = newRole === "manager" ? "promote to Manager" : "demote to Advisor";
  if (!confirm("Are you sure you want to " + label + "?")) return;

  var r = await sbUpdateRole(userId, newRole);
  if (r.error) {
    toast("Error: " + r.error.message);
  } else {
    toast("Role updated to " + newRole);
    renderManageAccounts();
  }
}
