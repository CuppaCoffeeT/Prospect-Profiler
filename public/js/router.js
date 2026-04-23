// ── ROUTER ──

var currentProfile = null;

function renderHeaderRight() {
  var el = document.getElementById("hdrRight");
  if (!el) return;

  if (currentProfile) {
    el.innerHTML = '<button class="hdr-burger" onclick="toggleMenu()">&#9776;</button>';
  } else {
    el.innerHTML = '<button class="hdr-login" onclick="navigate(\'#/login\')">Login</button>';
  }
}

function toggleMenu() {
  var pop = document.getElementById("menuPopover");
  var ov = document.getElementById("menuOverlay");
  var isOpen = pop.classList.contains("on");
  if (isOpen) {
    closeMenu();
  } else {
    var isManager = currentProfile && currentProfile.role === "manager";
    var h = '<button class="menu-item" onclick="menuNav(\'#/home\')"><span class="mi-icon">&#127919;</span>Profiling</button>'
      + '<button class="menu-item" onclick="menuNav(\'#/results\')"><span class="mi-icon">&#128203;</span>Results</button>';
    if (isManager) {
      h += '<button class="menu-item" onclick="menuNav(\'#/manage-accounts\')"><span class="mi-icon">&#128101;</span>Manage Accounts</button>';
    }
    h += '<button class="menu-item" onclick="menuNav(\'#/account\')"><span class="mi-icon">&#9881;</span>Account Settings</button>'
      + '<div class="menu-sep"></div>'
      + '<button class="menu-item danger" onclick="doLogout()"><span class="mi-icon">&#10140;</span>Log Out</button>';
    pop.innerHTML = h;
    pop.classList.add("on");
    ov.classList.add("on");
  }
}

function closeMenu() {
  document.getElementById("menuPopover").classList.remove("on");
  document.getElementById("menuOverlay").classList.remove("on");
}

function menuNav(hash) {
  closeMenu();
  navigate(hash);
}

async function doLogout() {
  closeMenu();
  await sb.auth.signOut();
}

function clearBot() {
  document.getElementById("bot").innerHTML = "";
}

function navigate(hash) {
  location.hash = hash;
}

async function consumeRecoveryTokens(rawHash) {
  var secondHash = rawHash.indexOf("#", 1);
  if (secondHash === -1) return;
  var fragment = rawHash.substring(secondHash + 1);
  var params = new URLSearchParams(fragment);
  var accessToken = params.get("access_token");
  var refreshToken = params.get("refresh_token");
  if (!accessToken || !refreshToken) return;
  await sb.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  history.replaceState(null, "", window.location.pathname + window.location.search + "#/reset");
}

async function route() {
  // Supabase appends auth tokens as a second "#" fragment on recovery links
  // (e.g. "#/reset#access_token=..."). Strip anything after the route segment.
  var rawHash = location.hash || "#/home";
  var hashParts = rawHash.split("#");
  var hash = hashParts.length > 1 ? "#" + hashParts[1] : "#/home";
  var app = document.getElementById("app");
  var prg = document.getElementById("prg");
  prg.style.display = "none";

  var session = await sbGetSession();

  // Fetch profile if logged in
  if (session && !currentProfile) {
    app.innerHTML = '<div class="loading-wrap"><div class="spinner"></div></div>';
    currentProfile = await sbGetProfile(session.user.id);
  }
  if (!session) {
    currentProfile = null;
  }

  // Public routes (no login required)
  if (hash === "#/home" || hash === "" || hash === "#/") {
    inProfileFlow = false;
    go(0);
    return;
  }

  // Auth pages
  if (hash === "#/login" || hash === "#/signup" || hash === "#/forgot") {
    if (session) {
      location.hash = "#/home";
      return;
    }
    if (hash === "#/signup") {
      app.innerHTML = signupHTML();
    } else if (hash === "#/forgot") {
      app.innerHTML = forgotHTML();
    } else {
      app.innerHTML = loginHTML();
    }
    renderHeaderRight();
    clearBot();
    document.getElementById("hSub").textContent = "DISC \u00d7 MBTI \u00b7 Auto-Profile";
    return;
  }

  // Reset password page - accessible with recovery session
  if (hash === "#/reset") {
    // Supabase's detectSessionInUrl can't parse tokens when they sit after
    // our "#/reset" route hash, so pull them out manually and install session.
    await consumeRecoveryTokens(rawHash);
    app.innerHTML = resetHTML();
    renderHeaderRight();
    clearBot();
    document.getElementById("hSub").textContent = "DISC \u00d7 MBTI \u00b7 Auto-Profile";
    return;
  }

  // Protected routes - require login
  if (!session) {
    location.hash = "#/login";
    return;
  }

  // Manager-only guard
  if (hash === "#/manage-accounts" && currentProfile.role !== "manager") {
    location.hash = "#/home";
    return;
  }

  // Route to page
  if (hash === "#/results") {
    inProfileFlow = false;
    renderResults();
  } else if (hash === "#/account") {
    inProfileFlow = false;
    renderAccount();
  } else if (hash === "#/manage-accounts") {
    inProfileFlow = false;
    renderManageAccounts();
  } else {
    location.hash = "#/home";
  }
}

// Listen for hash changes
window.addEventListener("hashchange", route);

// Listen for auth state changes
sb.auth.onAuthStateChange(function(event, session) {
  if (event === "SIGNED_IN") {
    currentProfile = null;
    route();
  } else if (event === "SIGNED_OUT") {
    currentProfile = null;
    location.hash = "#/home";
  }
});

// Initial route
route();
