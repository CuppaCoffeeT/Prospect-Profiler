// ── AUTH PAGES ──

function loginHTML() {
  return '<div class="auth-wrap">'
    + '<div style="margin-bottom:12px"><a href="#/home" class="auth-link" style="font-size:13px">&larr; Back to Home</a></div>'
    + '<div class="auth-logo">'
    + '<div class="logo-icon">&#127919;</div>'
    + '<div class="auth-title">Prospect Profiler</div>'
    + '<div class="auth-sub">Sign in to continue</div>'
    + '</div>'
    + '<div class="card">'
    + '<div class="err-box" id="authErr"></div>'
    + '<label class="lbl" style="margin-top:0">Email</label>'
    + '<input type="email" id="aEmail" placeholder="your@email.com" autocomplete="email">'
    + '<label class="lbl">Password</label>'
    + '<div class="pwd-row">'
    + '<input type="password" id="aPwd" placeholder="Your password" autocomplete="current-password">'
    + '<button class="pwd-toggle" type="button" onclick="togglePwd(\'aPwd\',this)">Show</button>'
    + '</div>'
    + '<div style="text-align:right;margin-top:8px">'
    + '<a href="#/forgot" class="auth-link" style="font-size:12px">Forgot password?</a>'
    + '</div>'
    + '<button class="bnx" style="width:100%;margin-top:14px" onclick="doLogin()" id="btnLogin">Sign In</button>'
    + '</div>'
    + '<div class="auth-footer">Don\'t have an account? <a href="#/signup" class="auth-link">Sign Up</a></div>'
    + '</div>';
}

function signupHTML() {
  return '<div class="auth-wrap">'
    + '<div style="margin-bottom:12px"><a href="#/home" class="auth-link" style="font-size:13px">&larr; Back to Home</a></div>'
    + '<div class="auth-logo">'
    + '<div class="logo-icon">&#127919;</div>'
    + '<div class="auth-title">Create Account</div>'
    + '<div class="auth-sub">Join as a Financial Advisor</div>'
    + '</div>'
    + '<div class="card">'
    + '<div class="err-box" id="authErr"></div>'
    + '<div class="success-box" id="authOk"></div>'
    + '<label class="lbl" style="margin-top:0">Username</label>'
    + '<input type="text" id="aUser" placeholder="Choose a username" autocomplete="username">'
    + '<div class="err-msg" id="errUser"></div>'
    + '<label class="lbl">Email</label>'
    + '<input type="email" id="aEmail" placeholder="your@email.com" autocomplete="email">'
    + '<div class="err-msg" id="errEmail"></div>'
    + '<label class="lbl">Password</label>'
    + '<div class="pwd-row">'
    + '<input type="password" id="aPwd" placeholder="Min 8 characters" autocomplete="new-password">'
    + '<button class="pwd-toggle" type="button" onclick="togglePwd(\'aPwd\',this)">Show</button>'
    + '</div>'
    + '<div class="err-msg" id="errPwd"></div>'
    + '<label class="lbl">Confirm Password</label>'
    + '<div class="pwd-row">'
    + '<input type="password" id="aPwd2" placeholder="Re-enter password" autocomplete="new-password">'
    + '<button class="pwd-toggle" type="button" onclick="togglePwd(\'aPwd2\',this)">Show</button>'
    + '</div>'
    + '<div class="err-msg" id="errPwd2"></div>'
    + '<button class="bnx" style="width:100%;margin-top:14px" onclick="doSignup()" id="btnSignup">Create Account</button>'
    + '</div>'
    + '<div class="auth-footer">Already have an account? <a href="#/login" class="auth-link">Sign In</a></div>'
    + '</div>';
}

function forgotHTML() {
  return '<div class="auth-wrap">'
    + '<div style="margin-bottom:12px"><a href="#/home" class="auth-link" style="font-size:13px">&larr; Back to Home</a></div>'
    + '<div class="auth-logo">'
    + '<div class="logo-icon">&#128274;</div>'
    + '<div class="auth-title">Reset Password</div>'
    + '<div class="auth-sub">We\'ll send you a reset link</div>'
    + '</div>'
    + '<div class="card">'
    + '<div class="err-box" id="authErr"></div>'
    + '<div class="success-box" id="authOk"></div>'
    + '<label class="lbl" style="margin-top:0">Email</label>'
    + '<input type="email" id="aEmail" placeholder="your@email.com" autocomplete="email">'
    + '<button class="bnx" style="width:100%;margin-top:14px" onclick="doForgot()" id="btnForgot">Send Reset Link</button>'
    + '</div>'
    + '<div class="auth-footer"><a href="#/login" class="auth-link">&larr; Back to Sign In</a></div>'
    + '</div>';
}

function resetHTML() {
  return '<div class="auth-wrap">'
    + '<div class="auth-logo">'
    + '<div class="logo-icon">&#128274;</div>'
    + '<div class="auth-title">Set New Password</div>'
    + '<div class="auth-sub">Enter your new password below</div>'
    + '</div>'
    + '<div class="card">'
    + '<div class="err-box" id="authErr"></div>'
    + '<div class="success-box" id="authOk"></div>'
    + '<label class="lbl" style="margin-top:0">New Password</label>'
    + '<div class="pwd-row">'
    + '<input type="password" id="aPwd" placeholder="Min 8 characters" autocomplete="new-password">'
    + '<button class="pwd-toggle" type="button" onclick="togglePwd(\'aPwd\',this)">Show</button>'
    + '</div>'
    + '<div class="err-msg" id="errPwd"></div>'
    + '<label class="lbl">Confirm New Password</label>'
    + '<div class="pwd-row">'
    + '<input type="password" id="aPwd2" placeholder="Re-enter password" autocomplete="new-password">'
    + '<button class="pwd-toggle" type="button" onclick="togglePwd(\'aPwd2\',this)">Show</button>'
    + '</div>'
    + '<div class="err-msg" id="errPwd2"></div>'
    + '<button class="bnx" style="width:100%;margin-top:14px" onclick="doReset()" id="btnReset">Update Password</button>'
    + '</div>'
    + '<div class="auth-footer"><a href="#/login" class="auth-link">&larr; Back to Sign In</a></div>'
    + '</div>';
}

function togglePwd(id, btn) {
  var inp = document.getElementById(id);
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = 'Hide'; }
  else { inp.type = 'password'; btn.textContent = 'Show'; }
}

function showAuthErr(msg) {
  var el = document.getElementById('authErr');
  if (el) { el.textContent = msg; el.classList.add('on'); }
}

function showAuthOk(msg) {
  var el = document.getElementById('authOk');
  if (el) { el.textContent = msg; el.classList.add('on'); }
}

function clearAuthMsgs() {
  var err = document.getElementById('authErr');
  var ok = document.getElementById('authOk');
  if (err) err.classList.remove('on');
  if (ok) ok.classList.remove('on');
  ['errUser', 'errEmail', 'errPwd', 'errPwd2'].forEach(function(id) {
    var e = document.getElementById(id);
    if (e) e.textContent = '';
  });
}

function setAuthLoading(btnId, loading) {
  var btn = document.getElementById(btnId);
  if (!btn) return;
  if (loading) {
    btn._origText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px"></span>';
  } else {
    btn.disabled = false;
    btn.textContent = btn._origText || 'Submit';
  }
}

async function doLogin() {
  clearAuthMsgs();
  var email = document.getElementById('aEmail').value.trim();
  var pwd = document.getElementById('aPwd').value;
  if (!email || !pwd) { showAuthErr('Please fill in all fields.'); return; }

  setAuthLoading('btnLogin', true);
  var r = await sbLogin(email, pwd);
  setAuthLoading('btnLogin', false);

  if (r.error) { showAuthErr(r.error.message); return; }
  currentProfile = null;
  location.hash = '#/home';
}

async function doSignup() {
  clearAuthMsgs();
  var user = document.getElementById('aUser').value.trim();
  var email = document.getElementById('aEmail').value.trim();
  var pwd = document.getElementById('aPwd').value;
  var pwd2 = document.getElementById('aPwd2').value;
  var valid = true;

  if (!user || user.length < 3) {
    document.getElementById('errUser').textContent = 'Username must be at least 3 characters';
    valid = false;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('errEmail').textContent = 'Enter a valid email address';
    valid = false;
  }
  if (!pwd || pwd.length < 8) {
    document.getElementById('errPwd').textContent = 'Password must be at least 8 characters';
    valid = false;
  }
  if (pwd !== pwd2) {
    document.getElementById('errPwd2').textContent = 'Passwords do not match';
    valid = false;
  }
  if (!valid) return;

  setAuthLoading('btnSignup', true);
  var r = await sbSignUp(email, pwd, user);
  setAuthLoading('btnSignup', false);

  if (r.error) { showAuthErr(r.error.message); return; }

  if (r.data.user && !r.data.session) {
    showAuthOk('Account created! Check your email to confirm, then sign in.');
  } else {
    currentProfile = null;
    location.hash = '#/home';
  }
}

async function doForgot() {
  clearAuthMsgs();
  var email = document.getElementById('aEmail').value.trim();
  if (!email) { showAuthErr('Please enter your email address.'); return; }

  setAuthLoading('btnForgot', true);
  var r = await sbResetPassword(email);
  setAuthLoading('btnForgot', false);

  if (r.error) { showAuthErr(r.error.message); return; }
  showAuthOk('Reset link sent! Check your email inbox.');
}

async function doReset() {
  clearAuthMsgs();
  var pwd = document.getElementById('aPwd').value;
  var pwd2 = document.getElementById('aPwd2').value;
  var valid = true;

  if (!pwd || pwd.length < 8) {
    document.getElementById('errPwd').textContent = 'Password must be at least 8 characters';
    valid = false;
  }
  if (pwd !== pwd2) {
    document.getElementById('errPwd2').textContent = 'Passwords do not match';
    valid = false;
  }
  if (!valid) return;

  setAuthLoading('btnReset', true);
  var r = await sbUpdatePassword(pwd);
  setAuthLoading('btnReset', false);

  if (r.error) { showAuthErr(r.error.message); return; }

  showAuthOk('Password updated! Signing you in…');
  currentProfile = null;
  setTimeout(function() { location.hash = '#/home'; }, 800);
}
