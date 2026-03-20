// ── HOME PAGE (Profiling Form) ──

function homeHTML() {
  var advName = info.adv && info.adv !== "Advisor" ? info.adv : '';
  if (!advName && currentProfile) advName = currentProfile.full_name || currentProfile.username || '';

  return '<div style="text-align:center;padding:20px 0 18px">'
    + '<div style="font-size:42px;margin-bottom:8px">&#127919;</div>'
    + '<div style="font-size:9px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;font-family:sans-serif;margin-bottom:6px">Prospect Profiling</div>'
    + '<h1 style="font-size:20px;font-weight:normal;margin-bottom:5px">Read Any Prospect</h1>'
    + '<p style="font-size:13px;color:var(--mu);font-family:sans-serif;line-height:1.6">8 questions + body language = instant DISC &amp; MBTI profile</p>'
    + '</div>'
    + '<div class="card">'
    + '<span class="ey">Your Details</span>'
    + '<label class="lbl" style="margin-top:0">Your Name (Advisor)</label>'
    + '<input type="text" id="iAdv" value="' + escH(advName) + '" placeholder="Your name" autocomplete="off">'
    + '<span class="ey" style="margin-top:14px">Prospect Details</span>'
    + '<label class="lbl" style="margin-top:4px">Prospect Name</label>'
    + '<input type="text" id="iNm" value="' + (info.name && info.name !== "Prospect" ? escH(info.name) : "") + '" placeholder="Wei Jie, Priya, Ahmad..." autocomplete="off">'
    + '<div class="g2">'
    + '<div><label class="lbl" style="margin-top:0">Age Range</label>'
    + '<select id="iAg"><option value="">Select...</option>'
    + ['20-25','26-30','31-35','36-40','41-45','46+'].map(function(a) { return '<option' + (info.age === a ? ' selected' : '') + '>' + a + '</option>'; }).join('')
    + '</select></div>'
    + '<div><label class="lbl" style="margin-top:0">Meeting #</label>'
    + '<select id="iMt">'
    + '<option value="1"' + (info.meeting === "1" ? ' selected' : '') + '>1st - Opening</option>'
    + '<option value="2"' + (info.meeting === "2" ? ' selected' : '') + '>2nd - Presentation</option>'
    + '<option value="3"' + (info.meeting === "3" ? ' selected' : '') + '>3rd - Closing</option>'
    + '<option value="4"' + (info.meeting === "4" ? ' selected' : '') + '>Servicing</option>'
    + '</select></div>'
    + '</div>'
    + '<label class="lbl" style="margin-top:10px">Occupation / Industry</label>'
    + '<input type="text" id="iOc" value="' + escH(info.occ || "") + '" placeholder="Engineer, Self-employed, Teacher..." autocomplete="off">'
    + '</div>'
    + '<div style="background:rgba(201,168,76,.07);border:1px solid rgba(201,168,76,.18);border-radius:12px;padding:13px 15px;margin-bottom:20px">'
    + '<div class="ey" style="margin-bottom:6px">How it works</div>'
    + '<div style="font-size:13px;color:var(--mu);font-family:sans-serif;line-height:1.8">1. Answer 8 profiling questions<br>2. Tick body language signals<br>3. Get instant DISC + MBTI profile<br>4. Save to database or download</div>'
    + '</div>';
}

function qHTML(batch, pn) {
  var h = '<span class="ey">Questions ' + (pn === 1 ? '1-4' : '5-8') + '</span>'
    + '<h2 style="font-size:19px;font-weight:normal;margin-bottom:4px">Profiling ' + escH(info.name || 'prospect') + '</h2>'
    + '<p style="font-size:13px;color:var(--mu);font-family:sans-serif;line-height:1.6;margin-bottom:16px">Weave into conversation. Pick the best match.</p>';
  batch.forEach(function(qi) {
    var q = QS[qi];
    var pc = q.ph === "open" ? "po" : "pd";
    var pl = q.ph === "open" ? "Opening" : "Discovery";
    h += '<div style="margin-bottom:22px">'
      + '<span class="ptag ' + pc + '">' + pl + '</span>'
      + '<p class="qtip">&#128161; ' + q.tip + '</p>'
      + '<div class="qask">' + q.ask + '</div>';
    q.opts.forEach(function(o, oi) {
      var sel = ans[qi] && ans[qi].oi === oi;
      h += '<div class="opt' + (sel ? ' s' + o.d : '') + '" data-qi="' + qi + '" data-oi="' + oi + '" data-d="' + o.d + '" onclick="selO(this)">'
        + '<div class="rc"><div class="rd"></div></div>'
        + '<span class="otx">' + o.t + '</span>'
        + '<span class="dbg">DISC-' + o.d + '</span>'
        + '</div>';
    });
    h += '</div>';
  });
  return h;
}

function nvHTML(gi) {
  var g = NVG[gi];
  var cnt = g.items.filter(function(it) { return ckNV[it.id]; }).length;
  var h = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:11px">'
    + '<span style="font-size:22px">' + g.em + '</span>'
    + '<div><div style="font-size:16px">' + g.tt + '</div>'
    + '<div style="font-size:11px;color:var(--mu);font-family:sans-serif;margin-top:1px">' + g.st + '</div></div></div>'
    + '<p style="font-size:13px;color:var(--mu);font-family:sans-serif;line-height:1.5;margin-bottom:11px">Tick everything you observed.</p>'
    + '<div style="font-size:11px;color:var(--gold);font-family:sans-serif;margin-bottom:10px">'
    + (cnt === 0 ? "Nothing ticked yet" : cnt + " signal" + (cnt !== 1 ? "s" : "") + " ticked") + '</div>';
  g.items.forEach(function(it) {
    var ticked = !!ckNV[it.id];
    h += '<div class="nvi' + (ticked ? ' ck' + it.d : '') + '" data-id="' + it.id + '" data-d="' + it.d + '" data-gi="' + gi + '" onclick="tgNV(this)">'
      + '<div class="cb">' + (ticked ? '&#10003;' : '') + '</div>'
      + '<span style="font-size:13px;color:' + (ticked ? 'var(--tx)' : 'var(--mu)') + ';font-family:sans-serif;line-height:1.5;flex:1">' + it.t + '</span>'
      + (ticked ? '<span class="dbg" style="display:block">DISC-' + it.d + '</span>' : '')
      + '</div>';
  });
  return h;
}

function resultHTML() {
  var p = PR[pf.pri], s = PR[pf.sec];
  var nm = info.name;
  var mx = Math.max.apply(null, Object.values(pf.dc));
  var mls = {"1": "1st Meeting", "2": "2nd Meeting", "3": "3rd Meeting", "4": "Servicing"};
  var ml = mls[info.meeting] || "1st Meeting";
  var dt = new Date().toLocaleDateString("en-SG", {day: "2-digit", month: "short", year: "numeric"});
  var dims = [
    {la: "Extravert", lb: "Introvert", sa: pf.mb.E, sb: pf.mb.I},
    {la: "Sensing", lb: "iNtuitive", sa: pf.mb.S, sb: pf.mb.N},
    {la: "Thinking", lb: "Feeling", sa: pf.mb.T, sb: pf.mb.F},
    {la: "Judging", lb: "Perceiving", sa: pf.mb.J, sb: pf.mb.P}
  ];
  var h = "";
  // Print header
  h += '<div class="rph"><div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;margin-bottom:4px">Prospect Profile Report</div>'
    + '<div style="font-size:22px;font-weight:bold">' + nm + '</div>'
    + '<div style="font-size:12px;color:#666;margin-top:3px">Advisor: ' + info.adv + ' &middot; ' + dt + ' &middot; ' + ml + '</div></div>';
  // Hero
  h += '<div style="border-radius:14px;overflow:hidden;border:1px solid ' + p.col + '55;margin-bottom:12px">'
    + '<div style="padding:20px 16px 14px;background:linear-gradient(135deg,' + p.col + 'EE,' + p.col + '88)">'
    + '<span style="font-size:36px;float:right">' + p.em + '</span>'
    + '<div style="font-size:9px;letter-spacing:3px;color:rgba(255,255,255,.65);text-transform:uppercase;font-family:sans-serif;margin-bottom:4px">' + ml + ' &middot; ' + info.adv + ' &middot; ' + dt + '</div>'
    + '<div style="font-size:22px;color:#fff;font-weight:normal;margin-bottom:2px">' + nm + '</div>'
    + '<div style="font-size:12px;color:rgba(255,255,255,.7);font-family:sans-serif;margin-bottom:10px">' + (info.occ || "") + (info.age ? " &middot; Age " + info.age : "") + '</div>'
    + '<div style="display:flex;flex-wrap:wrap;gap:7px">'
    + '<span style="padding:4px 12px;border-radius:20px;font-family:sans-serif;font-size:11px;font-weight:700;background:rgba(255,255,255,.22);color:#fff">DISC-' + pf.pri + ' &middot; ' + p.nm + '</span>'
    + '<span style="padding:4px 12px;border-radius:20px;font-family:sans-serif;font-size:11px;font-weight:700;background:rgba(0,0,0,.22);color:rgba(255,255,255,.8)">Secondary: ' + pf.sec + ' &middot; ' + s.nm + '</span>'
    + '<span style="padding:4px 12px;border-radius:20px;font-family:sans-serif;font-size:11px;font-weight:700;background:rgba(0,0,0,.22);color:rgba(255,255,255,.8)">MBTI: ' + pf.mbs + ' &middot; ' + p.mb + '</span>'
    + '</div></div>'
    + '<div style="padding:12px 16px;border-top:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.3)">'
    + '<div style="font-size:9px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;font-family:sans-serif;margin-bottom:5px">Advisor Quick Read</div>'
    + '<div style="font-size:13px;color:#E8E0D0;font-family:sans-serif;line-height:1.7;font-style:italic">&ldquo;' + p.sg + '&rdquo;</div>'
    + '</div></div>';
  // Action buttons - conditionally show Save or Login prompt
  if (currentProfile) {
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px">'
      + '<button class="abtn ab-save" onclick="saveToDb()"><span class="ai">&#128190;</span><span>Save</span><span style="font-size:10px;opacity:.8;font-weight:400">to database</span></button>'
      + '<button class="abtn ab-pdf" onclick="dlPDF()"><span class="ai">&#128196;</span><span>PDF</span><span style="font-size:10px;opacity:.8;font-weight:400">via print</span></button>'
      + '<button class="abtn ab-csv" onclick="dlCSV()"><span class="ai">&#128202;</span><span>CSV</span><span style="font-size:10px;opacity:.8;font-weight:400">download</span></button>'
      + '</div>';
  } else {
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">'
      + '<button class="abtn ab-pdf" onclick="dlPDF()"><span class="ai">&#128196;</span><span>PDF</span><span style="font-size:10px;opacity:.8;font-weight:400">via print</span></button>'
      + '<button class="abtn ab-csv" onclick="dlCSV()"><span class="ai">&#128202;</span><span>CSV</span><span style="font-size:10px;opacity:.8;font-weight:400">download</span></button>'
      + '</div>'
      + '<button class="anotes" style="background:rgba(201,168,76,.1);border-color:rgba(201,168,76,.3);color:var(--gold)" onclick="navigate(\'#/login\')">'
      + '&#128100; Log in to save results &amp; keep history</button>';
  }
  h += '<button class="anotes" onclick="openNotes()">&#128221; Add / Edit Notes</button>';
  // Opening line
  h += '<div class="card" style="border-color:' + p.col + '44;background:' + p.col + '12">'
    + '<span class="ey" style="color:' + p.col + '">Try This Opening Line</span>'
    + '<div style="font-size:14px;font-family:sans-serif;line-height:1.7;font-style:italic">' + p.op + '</div>'
    + '</div>';
  // DISC scores
  h += '<div class="card">';
  if (pf.occUsed) {
    h += '<span style="display:inline-block;padding:2px 10px;border-radius:20px;font-size:10px;font-family:sans-serif;font-weight:600;background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.3);color:#C9A84C;margin-bottom:10px">&#128084; Occupation factored in: ' + escH(pf.occUsed) + '</span>';
  }
  h += '<span class="ey">DISC Score &middot; ' + pf.qCount + ' questions + ' + pf.nvCount + ' observations</span>';
  ["D","I","S","C"].forEach(function(d) {
    h += '<div class="srow"><div class="slr"><span class="sl" style="color:' + PR[d].col + '">DISC-' + d + ' &mdash; ' + PR[d].nm + '</span><span class="sp">' + (pf.dc[d] || 0) + ' pts</span></div>'
      + '<div class="str"><div class="sfill" style="width:' + (mx > 0 ? Math.round((pf.dc[d] || 0) / mx * 100) : 0) + '%;background:' + PR[d].col + '"></div></div></div>';
  });
  // MBTI
  h += '<div style="border-top:1px solid rgba(255,255,255,.08);margin-top:13px;padding-top:13px"><span class="ey">MBTI Result</span>';
  dims.forEach(function(dm) {
    var tot = dm.sa + dm.sb;
    var aWins = dm.sa >= dm.sb;
    var winLbl = aWins ? dm.la : dm.lb;
    var loseLbl = aWins ? dm.lb : dm.la;
    var winScore = aWins ? dm.sa : dm.sb;
    var loseScore = aWins ? dm.sb : dm.sa;
    var barPc = tot > 0 ? Math.round(winScore / tot * 100) : 50;
    h += '<div style="background:rgba(255,255,255,.04);border-radius:10px;padding:11px 13px;margin-bottom:9px;border:1px solid rgba(255,255,255,.07)">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'
      + '<span style="font-size:12px;font-weight:700;font-family:sans-serif;color:#C9A84C">' + (tot === 0 ? "No signals yet" : winLbl + " &rarr; " + winScore + " signal" + (winScore !== 1 ? "s" : "")) + '</span>'
      + '<span style="font-size:10px;font-family:sans-serif;color:#8A8070">vs ' + loseLbl + (tot === 0 ? "" : ' (' + loseScore + ')') + '</span>'
      + '</div>'
      + '<div style="height:8px;background:rgba(255,255,255,.08);border-radius:4px">'
      + '<div style="height:100%;border-radius:4px;background:#C9A84C;width:' + barPc + '%"></div></div>'
      + '<div style="margin-top:5px;font-size:10px;font-family:sans-serif;color:#8A8070">' + (tot === 0 ? "Answer questions to see this" : "Strength: " + barPc + "%") + '</div>'
      + '</div>';
  });
  h += '</div></div>';
  // Traits
  h += '<div class="card"><span class="ey">Personality Traits</span><div class="trwp">';
  p.tr.forEach(function(t) { h += '<span class="trp" style="background:' + p.col + '22;border:1px solid ' + p.col + '55;color:' + p.col + '">' + t + '</span>'; });
  h += '</div></div>';
  // Do/Dont
  h += '<div class="ddg"><div class="doc"><div class="ddt gn">&check; Do This</div>';
  p.dos.forEach(function(d) { h += '<div class="di">' + d + '</div>'; });
  h += '</div><div class="dnt"><div class="ddt rd2">&times; Avoid</div>';
  p.dnts.forEach(function(d) { h += '<div class="dn">' + d + '</div>'; });
  h += '</div></div>';
  // Style + Watch
  h += '<div class="card"><span class="ey">How to Run This Conversation</span><p class="fup">' + p.st + '</p>'
    + '<div class="wbox"><div class="wlbl">&#9888; Watch For &mdash; Act Immediately</div><div class="wtx">' + p.wf + '</div></div></div>';
  // Follow up
  h += '<div class="card" style="background:rgba(201,168,76,.06);border-color:rgba(201,168,76,.2)">'
    + '<span class="ey">Follow-Up Style</span><p class="fup">' + p.fu + '</p></div>';
  // Communication playbook
  var catIcons = {engage: "&#128172;", appt: "&#128197;", followup: "&#128242;", objections: "&#128737;", close: "&#9989;"};
  var catBorders = {engage: "rgba(201,168,76,.3)", appt: "rgba(26,95,138,.3)", followup: "rgba(26,122,64,.3)", objections: "rgba(192,57,43,.3)", close: "rgba(201,168,76,.4)"};
  var catBgs = {engage: "rgba(201,168,76,.07)", appt: "rgba(26,95,138,.07)", followup: "rgba(26,122,64,.07)", objections: "rgba(192,57,43,.07)", close: "rgba(201,168,76,.1)"};
  h += '<div class="card" style="border-color:rgba(201,168,76,.3);background:rgba(201,168,76,.05)">'
    + '<span class="ey">Communication Playbook &mdash; DISC-' + pf.pri + '</span>'
    + '<p style="font-size:12px;color:var(--mu);font-family:sans-serif;line-height:1.6;margin-bottom:14px">Ready-to-use statements. Replace [Name], [Day], [detail] with real info. Tap any statement to copy.</p>';
  ["engage","appt","followup","objections","close"].forEach(function(cat) {
    var sec = p.msgs[cat];
    h += '<div style="border-radius:11px;border:1px solid ' + catBorders[cat] + ';background:' + catBgs[cat] + ';margin-bottom:13px;overflow:hidden">'
      + '<div style="padding:11px 13px 8px;border-bottom:1px solid rgba(255,255,255,.07)">'
      + '<span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;font-family:sans-serif;color:var(--gold);font-weight:700">' + catIcons[cat] + ' ' + sec.lbl + '</span></div>';
    sec.items.forEach(function(stmt, si) {
      var sid = "s_" + cat + "_" + si;
      h += '<div id="' + sid + '" onclick="cpStmt(this)" style="padding:11px 13px;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;display:flex;align-items:flex-start;gap:9px">'
        + '<span style="font-size:10px;color:var(--mu);font-family:sans-serif;flex-shrink:0;margin-top:2px;font-weight:700">' + (si + 1) + '.</span>'
        + '<span class="stmt-txt" style="font-size:13px;color:var(--tx);font-family:sans-serif;line-height:1.6;flex:1">' + stmt + '</span>'
        + '<span style="font-size:10px;color:var(--mu);font-family:sans-serif;flex-shrink:0;margin-top:2px">&#128203;</span>'
        + '</div>';
    });
    h += '</div>';
  });
  h += '</div>';
  // Notes
  h += '<div class="card"><span class="ey">Notes</span>'
    + '<p style="font-size:13px;color:var(--mu);font-family:sans-serif;font-style:italic" id="notePrint">' + (notes || "No notes added yet.") + '</p></div>';
  // Reset
  h += '<button class="arst" onclick="resetAll()">&#8592; Profile Another Prospect</button>';
  return h;
}

// ── SAVE TO DATABASE ──
async function saveToDb() {
  if (!pf) { toast("No profile yet"); return; }
  var session = await sbGetSession();
  if (!session) { toast("Not logged in"); return; }

  var r = await sbSaveResult({
    user_id: session.user.id,
    advisor_name: info.adv,
    prospect_name: info.name,
    age_range: info.age || null,
    occupation: info.occ || null,
    meeting: info.meeting || null,
    disc_primary: pf.pri,
    disc_secondary: pf.sec,
    score_d: pf.dc.D || 0,
    score_i: pf.dc.I || 0,
    score_s: pf.dc.S || 0,
    score_c: pf.dc.C || 0,
    mbti: pf.mbs,
    questions_answered: pf.qCount,
    observations_count: pf.nvCount,
    raw_answers: ans,
    nv_observations: ckNV,
    notes: notes
  });

  if (r.error) { toast("Error: " + r.error.message); }
  else { toast("Saved to database!"); }
}
