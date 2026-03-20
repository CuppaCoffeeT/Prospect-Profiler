// ── ROUTER ──

var currentProfile = null;

function renderNavBar() {
  var bot = document.getElementById("bot");
  if (inProfileFlow) return;

  var hash = location.hash || "#/home";
  var loggedIn = !!currentProfile;
  var isManager = loggedIn && currentProfile.role === "manager";

  var tabs = [
    {hash: "#/home", icon: "&#127919;", label: "Profile"},
  ];

  if (loggedIn) {
    tabs.push({hash: "#/results", icon: "&#128203;", label: "Results"});
    if (isManager) {
      tabs.push({hash: "#/manage-accounts", icon: "&#128101;", label: "Accounts"});
      tabs.push({hash: "#/roles", icon: "&#128272;", label: "Roles"});
    }
    tabs.push({hash: "#/account", icon: "&#128100;", label: "Account"});
  } else {
    tabs.push({hash: "#/login", icon: "&#128100;", label: "Login"});
  }

  var h = '<div class="nav-bar">';
  tabs.forEach(function(tab) {
    var active = hash === tab.hash ? " active" : "";
    h += '<button class="nav-tab' + active + '" onclick="navigate(\'' + tab.hash + '\')">'
      + '<span class="nav-icon">' + tab.icon + '</span>'
      + '<span>' + tab.label + '</span>'
      + '</button>';
  });
  h += '</div>';
  bot.innerHTML = h;
}

function renderAuthBot() {
  document.getElementById("bot").innerHTML = "";
}

function navigate(hash) {
  location.hash = hash;
}

async function route() {
  var hash = location.hash || "#/home";
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
    renderNavBar();
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
    renderNavBar();
    document.getElementById("hSub").textContent = "DISC \u00d7 MBTI \u00b7 Auto-Profile";
    return;
  }

  // Protected routes - require login
  if (!session) {
    location.hash = "#/login";
    return;
  }

  // Manager-only guard
  if ((hash === "#/manage-accounts" || hash === "#/roles") && currentProfile.role !== "manager") {
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
  } else if (hash === "#/roles") {
    inProfileFlow = false;
    renderRoleSettings();
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
