// ── PROFILER STATE & LOGIC ──

var scr = 0;
var ans = new Array(8).fill(null);
var ckNV = {};
var info = {};
var notes = "";
var pf = null;
var TOTAL = 2 + NVG.length; // 2 Q screens + 5 NV screens = 7
var inProfileFlow = false;

// ── NOTES ──
function openNotes() {
  document.getElementById("nta").value = notes;
  document.getElementById("mbg").classList.add("on");
}
function saveNotes() {
  notes = document.getElementById("nta").value;
  document.getElementById("mbg").classList.remove("on");
  toast("Notes saved");
}

// ── NAVIGATION ──
function go(n) {
  scr = n;
  window.scrollTo(0, 0);
  var app = document.getElementById("app");
  var bot = document.getElementById("bot");
  var prg = document.getElementById("prg");
  var sub = document.getElementById("hSub");

  if (n === 0) {
    inProfileFlow = false;
    prg.style.display = "none";
    sub.textContent = "DISC \u00d7 MBTI \u00b7 Auto-Profile";
    app.innerHTML = homeHTML();
    bot.innerHTML = '<button class="bnx" style="width:100%" onclick="startForm()">Start Profiling &#8594;</button>';
  } else if (n === 1 || n === 2) {
    inProfileFlow = true;
    prg.style.display = "block";
    updatePrg(n);
    sub.textContent = "Profiling " + (info.name || "prospect");
    var batch = n === 1 ? [0,1,2,3] : [4,5,6,7];
    app.innerHTML = qHTML(batch, n);
    var allDone = batch.every(function(i) { return ans[i] !== null; });
    bot.innerHTML = '<button class="bbk" onclick="goBack()">&#8592; Back</button><button class="bnx" id="btnNext" onclick="goNext()" ' + (allDone ? "" : "disabled") + '>Next &#8594;</button>';
  } else if (n >= 3 && n <= TOTAL) {
    inProfileFlow = true;
    prg.style.display = "block";
    updatePrg(n);
    sub.textContent = "Profiling " + (info.name || "prospect");
    var gi = n - 3;
    app.innerHTML = nvHTML(gi);
    var isLast = (n === TOTAL);
    bot.innerHTML = '<button class="bbk" onclick="goBack()">&#8592; Back</button><button class="bnx" onclick="goNext()">' + (isLast ? "Generate Profile &#8594;" : "Next &#8594;") + '</button>';
  } else if (n === "R") {
    inProfileFlow = true;
    prg.style.display = "none";
    sub.textContent = (info.name || "Prospect") + " \u00b7 Profile Ready";
    app.innerHTML = resultHTML();
    bot.innerHTML = "";
  }
}

function updatePrg(n) {
  var pc = Math.round(n / TOTAL * 100);
  document.getElementById("pFill").style.width = pc + "%";
  document.getElementById("sLbl").textContent = "Step " + n + " of " + TOTAL;
  document.getElementById("pcLbl").textContent = pc + "%";
}

function startForm() {
  info = {
    adv: document.getElementById("iAdv").value.trim() || "Advisor",
    name: document.getElementById("iNm").value.trim() || "Prospect",
    age: document.getElementById("iAg").value,
    meeting: document.getElementById("iMt").value,
    occ: document.getElementById("iOc").value.trim()
  };
  go(1);
}

function goNext() {
  if (scr === TOTAL) { pf = calcPf(); go("R"); }
  else { go(scr + 1); }
}

function goBack() {
  if (scr === "R" || scr <= 1) {
    inProfileFlow = false;
    go(0);
    renderNavBar();
  } else { go(scr - 1); }
}

function selO(el) {
  var qi = +el.dataset.qi, oi = +el.dataset.oi, dc = el.dataset.d;
  ans[qi] = {oi: oi, d: dc, mb: QS[qi].opts[oi].mb};
  var batch = qi < 4 ? [0,1,2,3] : [4,5,6,7];
  var pn = qi < 4 ? 1 : 2;
  document.getElementById("app").innerHTML = qHTML(batch, pn);
  var allDone = batch.every(function(i) { return ans[i] !== null; });
  var btn = document.getElementById("btnNext");
  if (btn) btn.disabled = !allDone;
}

function tgNV(el) {
  var id = el.dataset.id, gi = +el.dataset.gi;
  ckNV[id] = !ckNV[id];
  document.getElementById("app").innerHTML = nvHTML(gi);
}

// ── SCORING ──
function occNudge(dc, mb, occ) {
  if (!occ) return;
  var o = occ.toLowerCase();
  if (/engineer|software|developer|it |data|analyst|analytic|auditor|accountant|accounting|scientist|research|actuari|statistic|architect|cybersec|network|database|quality|tester/.test(o)) { dc.C += 2; mb.T++; mb.I++; }
  if (/sales|business dev|entrepreneur|director|ceo|md |founder|gm |general manager|managing|vp |vice president|head of|chief|partner/.test(o)) { dc.D += 2; mb.E++; mb.T++; }
  if (/market|creative|design|artist|pr |public rel|events|media|influenc|content|performer|music|fashion|photog|social media|community/.test(o)) { dc.I += 2; mb.E++; mb.N++; }
  if (/teacher|educat|lecturer|professor|nurse|nursing|social work|counsell|therapist|psycholog|hr |human res|admin|customer serv|support|care|caregiv|welfare|nonprofit|volunteer/.test(o)) { dc.S += 2; mb.F++; mb.I++; }
  if (/lawyer|attorney|legal|solicitor|finance|banker|banking|investment|fund|consultant|advisor|adviser|manager|project|operations|compliance|risk/.test(o)) { dc.D++; dc.C++; mb.T++; }
  if (/self.employ|freelanc|own business|business owner|sole prop|proprietor/.test(o)) { dc.D++; dc.I++; mb.E++; }
  if (/doctor|physician|surgeon|specialist|pharmacist|dentist|optom|medical|clinic|hospital/.test(o)) { dc.C++; dc.D++; mb.T++; }
}

function calcPf() {
  var dc = {D: 0, I: 0, S: 0, C: 0}, mb = {E: 0, I: 0, T: 0, F: 0, J: 0, P: 0, S: 0, N: 0};
  occNudge(dc, mb, info.occ || "");
  ans.forEach(function(a) { if (!a) return; dc[a.d] = (dc[a.d] || 0) + 2; mb[a.mb.v] = (mb[a.mb.v] || 0) + 1; });
  NVG.forEach(function(g) { g.items.forEach(function(it) { if (ckNV[it.id]) dc[it.d] = (dc[it.d] || 0) + 1; }); });
  var s = Object.entries(dc).sort(function(a, b) { return b[1] - a[1]; });
  return {
    dc: dc, mb: mb, pri: s[0][0], sec: s[1][0],
    mbs: (mb.E >= mb.I ? "E" : "I") + (mb.S >= mb.N ? "S" : "N") + (mb.T >= mb.F ? "T" : "F") + (mb.J >= mb.P ? "J" : "P"),
    nvCount: Object.values(ckNV).filter(Boolean).length,
    qCount: ans.filter(Boolean).length,
    occUsed: info.occ || ""
  };
}

function resetAll() {
  ans = new Array(8).fill(null);
  ckNV = {}; info = {}; notes = ""; pf = null;
  inProfileFlow = false;
  go(0);
  renderNavBar();
}
