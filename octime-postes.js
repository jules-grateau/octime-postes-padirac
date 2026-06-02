(function(){
  "use strict";
  var existing=document.getElementById("octp-panel");
  if(existing){ // déjà chargé : on bascule l'affichage
    var b=document.getElementById("octp-bouton");
    if(b){b.click();return;}
  }
  if(!document.querySelector("#CorpsPlanning .colJours table.groupe tbody tr[data-mat]")){
    alert("Ouvre d'abord un planning OCTIME (vue mensuelle) avant de cliquer.");return;
  }
  var ANNEXE=/^[A-Z]+\d[A-Z]+\d?$/;
  function categorie(raw){
    var t=(raw||"").trim();
    if(t===""||t.toUpperCase()==="HC")return"Non planifié";
    var u=t.toUpperCase();
    if(u==="RH")return"Repos";
    if(u.indexOf("FORM")===0)return"Formation";
    if(ANNEXE.test(t))return"Annexes";
    if(u.indexOf("CE")===0)return"CE";
    if(/^B1(\.\d)?$/.test(u))return"B1";
    if(/^B2(\.\d)?$/.test(u))return"B2";
    if(/^B3/.test(u))return"B3";
    return"Autres";
  }
  var ORDRE=["B1","B2","B3","CE","Annexes","Autres","Formation","Repos","Non planifié"];
  function noms(){var m={};document.querySelectorAll("#CorpsPlanning .colEmployes table.groupe tbody tr[data-mat]").forEach(function(tr){var n=tr.querySelector(".nom");m[tr.getAttribute("data-mat")]=n?n.textContent.trim():tr.getAttribute("data-mat");});return m;}
  function planning(){var L=[],nb=0,dd=null;document.querySelectorAll("#CorpsPlanning .colJours table.groupe tbody").forEach(function(tb){if(!dd){var d=tb.getAttribute("data-date-debut");if(d&&d.length===8)dd=new Date(+d.slice(0,4),+d.slice(4,6)-1,+d.slice(6,8));}tb.querySelectorAll("tr[data-mat]").forEach(function(tr){var c=[];tr.querySelectorAll(":scope > td").forEach(function(td){c.push(td.textContent.trim());});nb=Math.max(nb,c.length);L.push({mat:tr.getAttribute("data-mat"),codes:c});});});return{dd:dd,nb:nb,L:L};}
  var JF=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],MF=["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
  function lbl(dd,i){if(!dd)return"Jour "+(i+1);var d=new Date(dd.getTime());d.setDate(d.getDate()+i);return JF[d.getDay()]+" "+d.getDate()+" "+MF[d.getMonth()];}
  var CSS="#octp-bouton{position:fixed;right:16px;bottom:16px;z-index:2147483646;background:#2b6cb0;color:#fff;border:none;border-radius:20px;padding:10px 16px;font:600 13px/1 system-ui,Arial,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.3)}#octp-panel{position:fixed;right:16px;bottom:64px;z-index:2147483647;width:min(360px,92vw);max-height:78vh;display:flex;flex-direction:column;background:#fff;color:#1a202c;border:1px solid #cbd5e0;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,.35);font:13px/1.4 system-ui,Arial,sans-serif;overflow:hidden}#octp-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#2b6cb0;color:#fff}#octp-close{cursor:pointer;font-size:20px;padding:0 4px}#octp-controls{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border-bottom:1px solid #e2e8f0}#octp-controls label{display:flex;align-items:center;gap:6px}#octp-jour,#octp-filtre{flex:1;padding:4px 6px}#octp-resultat{overflow:auto;padding:8px 12px 14px}.octp-grp{margin-bottom:12px}.octp-grp-t{font-weight:700;text-transform:uppercase;font-size:12px;letter-spacing:.04em;border-left:4px solid #2b6cb0;padding:4px 8px;background:#edf2f7;border-radius:3px}.octp-cnt{float:right;background:#2b6cb0;color:#fff;border-radius:10px;padding:0 8px;font-size:11px}.octp-grp ul{margin:6px 0 0;padding:0 0 0 14px;list-style:none}.octp-grp li{padding:1px 0}.octp-code{color:#718096;font-size:11px}.octp-B1 .octp-grp-t{border-left-color:#38a169}.octp-B2 .octp-grp-t{border-left-color:#dd6b20}.octp-B3 .octp-grp-t{border-left-color:#4b6afa}.octp-CE .octp-grp-t{border-left-color:#e53e3e}.octp-Annexes .octp-grp-t{border-left-color:#805ad5}.octp-Repos .octp-grp-t{border-left-color:#a0aec0}.octp-Formation .octp-grp-t{border-left-color:#d69e2e}";
  var st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);
  var btn=document.createElement("button");btn.id="octp-bouton";btn.textContent="Postes / jour";document.body.appendChild(btn);
  var p=document.createElement("div");p.id="octp-panel";p.style.display="none";
  p.innerHTML='<div id="octp-head"><strong>Effectifs par poste</strong><span id="octp-close" title="Fermer">×</span></div><div id="octp-controls"><label>Jour : <select id="octp-jour"></select></label><label><input id="octp-filtre" type="text" placeholder="filtrer un nom…"></label></div><div id="octp-resultat"></div>';
  document.body.appendChild(p);
  var N=noms(),P=planning();
  var sel=p.querySelector("#octp-jour");
  function remplirJours(){sel.innerHTML="";for(var i=0;i<P.nb;i++){var o=document.createElement("option");o.value=i;o.textContent=lbl(P.dd,i);sel.appendChild(o);}}
  function rendre(){var idx=+sel.value,f=(p.querySelector("#octp-filtre").value||"").toLowerCase(),g={};P.L.forEach(function(l){var c=l.codes[idx];if(c===undefined)return;var cat=categorie(c);(g[cat]=g[cat]||[]).push({nom:N[l.mat]||l.mat,code:c});});Object.keys(g).forEach(function(k){g[k].sort(function(a,b){return a.nom.localeCompare(b.nom,"fr");});});var cats=ORDRE.filter(function(c){return g[c];});Object.keys(g).forEach(function(c){if(cats.indexOf(c)===-1)cats.push(c);});var h="";cats.forEach(function(cat){var gens=g[cat].filter(function(x){return !f||x.nom.toLowerCase().indexOf(f)!==-1;});if(!gens.length)return;h+='<div class="octp-grp octp-'+cat.replace(/[^A-Za-z0-9]/g,"")+'"><div class="octp-grp-t">'+cat+' <span class="octp-cnt">'+gens.length+'</span></div><ul>'+gens.map(function(x){var d=(categorie(x.code)==="Annexes"||cat==="Autres")?' <span class="octp-code">'+x.code+'</span>':'';return '<li>'+x.nom+d+'</li>';}).join("")+'</ul></div>';});p.querySelector("#octp-resultat").innerHTML=h||'<p>Aucune donnée.</p>';}
  remplirJours();
  sel.addEventListener("change",rendre);
  p.querySelector("#octp-filtre").addEventListener("input",rendre);
  p.querySelector("#octp-close").addEventListener("click",function(){p.style.display="none";});
  btn.addEventListener("click",function(){N=noms();P=planning();remplirJours();p.style.display=p.style.display==="none"?"flex":"none";if(p.style.display==="flex")rendre();});
  p.style.display="flex";rendre();
})();
