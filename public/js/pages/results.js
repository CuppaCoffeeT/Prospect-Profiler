// ── MANAGE RESULTS PAGE ──

var resultsCache = null;
var resultsSearch = "";

async function renderResults() {
  var app = document.getElementById("app");
  app.innerHTML = '<div class="loading-wrap"><div class="spinner"></div></div>';
  document.getElementById("prg").style.display = "none";
  document.getElementById("hSub").textContent = "Manage Results";

  var isManager = currentProfile && currentProfile.role === "manager";
  var r;
  if (isManager) {
    r = await sbGetAllResults();
  } else {
    var session = await sbGetSession();
    r = await sbGetResults(session.user.id);
  }

  resultsCache = r.data || [];
  renderResultsList();
}

function renderResultsList() {
  var app = document.getElementById("app");
  var bot = document.getElementById("bot");
  var isManager = currentProfile && currentProfile.role === "manager";
  var filtered = resultsCache;

  if (resultsSearch) {
    var q = resultsSearch.toLowerCase();
    filtered = resultsCache.filter(function(r) {
      return (r.prospect_name && r.prospect_name.toLowerCase().indexOf(q) >= 0)
        || (r.disc_primary && r.disc_primary.toLowerCase().indexOf(q) >= 0)
        || (r.mbti && r.mbti.toLowerCase().indexOf(q) >= 0)
        || (r.advisor_name && r.advisor_name.toLowerCase().indexOf(q) >= 0);
    });
  }

  var h = '<span class="ey">Saved Profiles</span>'
    + '<div class="search-bar" style="position:relative">'
    + '<span class="search-icon">&#128269;</span>'
    + '<input type="text" placeholder="Search by name, DISC, MBTI..." value="' + escH(resultsSearch) + '" oninput="resultsSearch=this.value;renderResultsList()">'
    + '</div>';

  if (filtered.length === 0) {
    h += '<div class="empty-state">'
      + '<div class="empty-icon">&#128203;</div>'
      + '<div style="font-size:15px;margin-bottom:6px">' + (resultsCache.length === 0 ? "No profiles saved yet" : "No results match your search") + '</div>'
      + '<div style="font-size:12px">' + (resultsCache.length === 0 ? "Complete a profiling session and save it to see it here." : "Try a different search term.") + '</div>'
      + '</div>';
  } else {
    h += '<div style="font-size:11px;color:var(--mu);font-family:sans-serif;margin-bottom:10px">' + filtered.length + ' profile' + (filtered.length !== 1 ? 's' : '') + '</div>';
    filtered.forEach(function(r) {
      var dt = new Date(r.created_at).toLocaleDateString("en-SG", {day: "2-digit", month: "short", year: "numeric"});
      var priCol = PR[r.disc_primary] ? PR[r.disc_primary].col : "#888";
      var secCol = PR[r.disc_secondary] ? PR[r.disc_secondary].col : "#888";
      var mls = {"1": "1st", "2": "2nd", "3": "3rd", "4": "Svc"};
      h += '<div class="result-card" onclick="viewResult(\'' + r.id + '\')">'
        + '<div class="rc-top">'
        + '<div>'
        + '<div class="rc-name">' + escH(r.prospect_name) + '</div>'
        + '<div class="rc-date">' + dt + '</div>'
        + '</div>'
        + '<button class="rc-del" onclick="event.stopPropagation();deleteResult(\'' + r.id + '\')" title="Delete">&#128465;</button>'
        + '</div>'
        + '<div class="rc-meta">'
        + '<span class="disc-badge" style="background:' + priCol + '22;border:1px solid ' + priCol + '55;color:' + priCol + '">DISC-' + r.disc_primary + '</span>'
        + '<span class="disc-badge" style="background:' + secCol + '22;border:1px solid ' + secCol + '55;color:' + secCol + '">2nd: ' + r.disc_secondary + '</span>'
        + '<span class="disc-badge" style="background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.3);color:var(--gold)">' + r.mbti + '</span>'
        + (r.meeting ? '<span class="disc-badge" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:var(--mu)">' + (mls[r.meeting] || r.meeting) + '</span>' : '')
        + '</div>';
      if (isManager && r.profiles) {
        h += '<div class="rc-advisor">Advisor: ' + escH(r.profiles.full_name || r.profiles.username || r.advisor_name) + '</div>';
      }
      h += '</div>';
    });
  }

  app.innerHTML = h;
  renderNavBar();
}

function viewResult(id) {
  var r = resultsCache.find(function(x) { return x.id === id; });
  if (!r) return;

  // Reconstruct pf and info from DB data to reuse resultHTML
  info = {
    adv: r.advisor_name,
    name: r.prospect_name,
    age: r.age_range || "",
    meeting: r.meeting || "1",
    occ: r.occupation || ""
  };
  pf = {
    dc: {D: r.score_d, I: r.score_i, S: r.score_s, C: r.score_c},
    mb: {E: 0, I: 0, T: 0, F: 0, J: 0, P: 0, S: 0, N: 0},
    pri: r.disc_primary,
    sec: r.disc_secondary,
    mbs: r.mbti,
    nvCount: r.observations_count,
    qCount: r.questions_answered,
    occUsed: r.occupation || ""
  };
  // Reconstruct MBTI signals from the type string
  if (r.mbti) {
    pf.mb[r.mbti[0] === 'E' ? 'E' : 'I'] = 3;
    pf.mb[r.mbti[1] === 'S' ? 'S' : 'N'] = 3;
    pf.mb[r.mbti[2] === 'T' ? 'T' : 'F'] = 3;
    pf.mb[r.mbti[3] === 'J' ? 'J' : 'P'] = 3;
  }
  notes = r.notes || "";
  ans = r.raw_answers || new Array(8).fill(null);
  ckNV = r.nv_observations || {};

  var app = document.getElementById("app");
  app.innerHTML = resultHTML();

  var bot = document.getElementById("bot");
  bot.innerHTML = '<button class="bbk" onclick="renderResults()">&#8592; Back to Results</button>';
}

async function deleteResult(id) {
  if (!confirm("Delete this profile?")) return;
  var r = await sbDeleteResult(id);
  if (r.error) { toast("Error: " + r.error.message); return; }
  toast("Profile deleted");
  resultsCache = resultsCache.filter(function(x) { return x.id !== id; });
  renderResultsList();
}
