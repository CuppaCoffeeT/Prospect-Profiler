// ── UTILITIES ──

function escH(s){return s.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");}

function toast(msg){
  var t=document.getElementById("toast");
  t.textContent=msg;t.classList.add("on");
  setTimeout(function(){t.classList.remove("on");},2500);
}

function cpStmt(el){
  var txt=el.querySelector(".stmt-txt").textContent;
  if(navigator.clipboard){
    navigator.clipboard.writeText(txt).then(function(){
      el.style.background="rgba(201,168,76,.15)";
      setTimeout(function(){el.style.background="";},700);
      toast("Copied!");
    });
  } else {
    var ta=document.createElement("textarea");ta.value=txt;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);
    toast("Copied!");
  }
}

function dlPDF(){
  var np=document.getElementById("notePrint");
  if(np)np.textContent=notes||"No notes added.";
  setTimeout(function(){window.print();},80);
}

function dlCSV(){
  if(!pf){toast("No profile yet");return;}
  var dt=new Date().toISOString().slice(0,10);
  var hdr="Date,Advisor,Prospect,Age,Occupation,Meeting,DISC Primary,DISC Secondary,MBTI,Score D,Score I,Score S,Score C,Questions,Observations,Notes";
  var row=[dt,info.adv,info.name,info.age,info.occ,info.meeting,pf.pri,pf.sec,pf.mbs,
    pf.dc.D||0,pf.dc.I||0,pf.dc.S||0,pf.dc.C||0,pf.qCount,pf.nvCount,
    '"'+notes.replace(/"/g,'""')+'"'].join(",");
  var blob=new Blob([hdr+"\n"+row],{type:"text/csv"});
  var a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="profile_"+info.name.replace(/\s+/g,"_")+"_"+dt+".csv";
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  toast("CSV saved");
}
