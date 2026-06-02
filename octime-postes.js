(function(){
  "use strict";
  var existing=document.getElementById("octp-panel");
  if(existing){
    var b=document.getElementById("octp-bouton");
    if(b){b.click();return;}
  }
  if(!document.querySelector("#CorpsPlanning .colJours table.groupe tbody tr[data-mat]")){
    alert("Ouvre d'abord un planning OCTIME (vue mensuelle) avant de cliquer.");return;
  }
  var ANNEXE=/^[A-Z]+\d[A-Z]+\d?$/;
  var ANNEXE_EXTRA=/^(DEB|EMB|LIFT|ADS)\d*$/;
  var BAT_SOUS=["B1","B1.2","B2","B2.2","B3","BM","BS"];
  var ANNEXES_SOUS=["Lift","ADS","Débarcadère","Embarcadère"];
  function annexeSous(u){
    if(/^LIFT/.test(u))return"Lift";
    if(/^ADS/.test(u))return"ADS";
    if(/^DEB/.test(u))return"Débarcadère";
    if(/^EMB/.test(u))return"Embarcadère";
    if(u.indexOf("L")!==-1)return"Lift";
    if(u.indexOf("A")!==-1)return"ADS";
    if(u.indexOf("D")!==-1)return"Débarcadère";
    return null;
  }
  function categorie(raw){
    var t=(raw||"").trim();
    if(t===""||t.toUpperCase()==="HC")return"Non planifié";
    var u=t.toUpperCase();
    if(u==="RH")return"Repos";
    if(u.indexOf("FORM")===0)return"Formation";
    if(ANNEXE.test(t)||ANNEXE_EXTRA.test(u))return annexeSous(u)||"Annexes";
    if(u.indexOf("CE")===0)return"CE";
    if(BAT_SOUS.indexOf(u)!==-1)return u;
    if(/^B3/.test(u))return"B3";
    return"Autres";
  }
  function noms(){var m={};document.querySelectorAll("#CorpsPlanning .colEmployes table.groupe tbody tr[data-mat]").forEach(function(tr){var n=tr.querySelector(".nom");m[tr.getAttribute("data-mat")]=n?n.textContent.trim():tr.getAttribute("data-mat");});return m;}
  function planning(){var L=[],nb=0,dd=null;document.querySelectorAll("#CorpsPlanning .colJours table.groupe tbody").forEach(function(tb){if(!dd){var d=tb.getAttribute("data-date-debut");if(d&&d.length===8)dd=new Date(+d.slice(0,4),+d.slice(4,6)-1,+d.slice(6,8));}tb.querySelectorAll("tr[data-mat]").forEach(function(tr){var c=[];tr.querySelectorAll(":scope > td").forEach(function(td){c.push(td.textContent.trim());});nb=Math.max(nb,c.length);L.push({mat:tr.getAttribute("data-mat"),codes:c});});});return{dd:dd,nb:nb,L:L};}
  var JF=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],MF=["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
  function lbl(dd,i){if(!dd)return"Jour "+(i+1);var d=new Date(dd.getTime());d.setDate(d.getDate()+i);return JF[d.getDay()]+" "+d.getDate()+" "+MF[d.getMonth()];}
  var CSS="#octp-bouton{position:fixed;right:16px;bottom:16px;z-index:2147483646;background:#2b6cb0;color:#fff;border:none;border-radius:20px;padding:10px 16px;font:600 13px/1 system-ui,Arial,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.3)}#octp-panel{position:fixed;right:16px;bottom:64px;z-index:2147483647;width:min(360px,92vw);max-height:78vh;display:flex;flex-direction:column;background:#fff;color:#1a202c;border:1px solid #cbd5e0;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,.35);font:13px/1.4 system-ui,Arial,sans-serif;overflow:hidden}#octp-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#2b6cb0;color:#fff}#octp-close{cursor:pointer;font-size:20px;padding:0 4px}#octp-controls{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border-bottom:1px solid #e2e8f0}#octp-controls label{display:flex;align-items:center;gap:6px}#octp-jour,#octp-filtre{flex:1;padding:4px 6px}#octp-resultat{overflow:auto;padding:8px 12px 14px}.octp-grp{margin-bottom:12px}.octp-grp-t{font-weight:700;text-transform:uppercase;font-size:12px;letter-spacing:.04em;border-left:4px solid #2b6cb0;padding:4px 8px;background:#edf2f7;border-radius:3px}.octp-cnt{float:right;background:#2b6cb0;color:#fff;border-radius:10px;padding:0 8px;font-size:11px}.octp-grp ul{margin:6px 0 0;padding:0 0 0 14px;list-style:none}.octp-grp li{padding:1px 0}.octp-code{color:#718096;font-size:11px}.octp-sous-wrap{padding:4px 0 0 8px;border-left:2px solid #e2e8f0;margin:4px 4px 0}.octp-BAT>.octp-sous-wrap{border-left-color:#c6f6d5}.octp-Annexes>.octp-sous-wrap{border-left-color:#d9d6fe}.octp-sous-grp{margin-bottom:7px}.octp-sous-t{font-weight:700;text-transform:uppercase;font-size:11px;letter-spacing:.04em;border-left:3px solid #888;padding:3px 8px;background:#f0f4f8;border-radius:2px}.octp-cnt-sous{float:right;background:#718096;color:#fff;border-radius:10px;padding:0 7px;font-size:10px}.octp-sous-grp ul{margin:4px 0 0;padding:0 0 0 12px;list-style:none}.octp-sous-grp li{padding:1px 0}.octp-BAT>.octp-grp-t{border-left-color:#276749}.octp-sous-B1 .octp-sous-t{border-left-color:#38a169}.octp-sous-B12 .octp-sous-t{border-left-color:#68d391}.octp-sous-B2 .octp-sous-t{border-left-color:#dd6b20}.octp-sous-B22 .octp-sous-t{border-left-color:#f6ad55}.octp-sous-B3 .octp-sous-t{border-left-color:#4b6afa}.octp-sous-BM .octp-sous-t{border-left-color:#9f7aea}.octp-sous-BS .octp-sous-t{border-left-color:#fc8181}.octp-Annexes>.octp-grp-t{border-left-color:#805ad5}.octp-sous-Lift .octp-sous-t{border-left-color:#0694a2}.octp-sous-ADS .octp-sous-t{border-left-color:#5850ec}.octp-sous-Dbarcadre .octp-sous-t{border-left-color:#e3a008}.octp-sous-Embarcadre .octp-sous-t{border-left-color:#e74694}.octp-CE>.octp-grp-t{border-left-color:#e53e3e}.octp-Repos>.octp-grp-t{border-left-color:#a0aec0}.octp-Formation>.octp-grp-t{border-left-color:#d69e2e}";
  var st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);
  var btn=document.createElement("button");btn.id="octp-bouton";btn.textContent="Postes / jour";document.body.appendChild(btn);
  var p=document.createElement("div");p.id="octp-panel";p.style.display="none";
  p.innerHTML='<div id="octp-head"><strong>Effectifs par poste</strong><span id="octp-close" title="Fermer">×</span></div><div id="octp-controls"><label>Jour : <select id="octp-jour"></select></label><label><input id="octp-filtre" type="text" placeholder="filtrer un nom…"></label></div><div id="octp-resultat"></div>';
  document.body.appendChild(p);
  var N=noms(),P=planning();
  var sel=p.querySelector("#octp-jour");
  function remplirJours(){sel.innerHTML="";for(var i=0;i<P.nb;i++){var o=document.createElement("option");o.value=i;o.textContent=lbl(P.dd,i);sel.appendChild(o);}}
  function rendre(){
    var idx=+sel.value,f=(p.querySelector("#octp-filtre").value||"").toLowerCase(),g={};
    P.L.forEach(function(l){var c=l.codes[idx];if(c===undefined)return;var cat=categorie(c);(g[cat]=g[cat]||[]).push({nom:N[l.mat]||l.mat,code:c});});
    Object.keys(g).forEach(function(k){var byCode=ANNEXES_SOUS.indexOf(k)!==-1;g[k].sort(function(a,b){return byCode?(a.code.localeCompare(b.code)||a.nom.localeCompare(b.nom,"fr")):a.nom.localeCompare(b.nom,"fr");});});
    function filtres(cat){return(g[cat]||[]).filter(function(x){return!f||x.nom.toLowerCase().indexOf(f)!==-1;});}
    function superGroupe(label,sous,showCode){
      var visible=sous.filter(function(c){return filtres(c).length>0;});
      var generique=filtres(label);
      if(!visible.length&&!generique.length)return"";
      var total=visible.reduce(function(n,c){return n+filtres(c).length;},0)+generique.length;
      var cls=label.replace(/[^A-Za-z0-9]/g,"");
      var h='<div class="octp-grp octp-'+cls+'"><div class="octp-grp-t">'+label+' <span class="octp-cnt">'+total+'</span></div><div class="octp-sous-wrap">';
      visible.forEach(function(cat){
        var gens=filtres(cat);
        var catCls=cat.replace(/[^A-Za-z0-9]/g,"");
        h+='<div class="octp-sous-grp octp-sous-'+catCls+'"><div class="octp-sous-t">'+cat+' <span class="octp-cnt-sous">'+gens.length+'</span></div>';
        h+='<ul>'+gens.map(function(x){var d=showCode?' <span class="octp-code">'+x.code+'</span>':'';return'<li>'+x.nom+d+'</li>';}).join("")+'</ul></div>';
      });
      if(generique.length){
        h+='<div class="octp-sous-grp"><div class="octp-sous-t">Divers <span class="octp-cnt-sous">'+generique.length+'</span></div>';
        h+='<ul>'+generique.map(function(x){return'<li>'+x.nom+' <span class="octp-code">'+x.code+'</span></li>';}).join("")+'</ul></div>';
      }
      return h+'</div></div>';
    }
    var h=superGroupe("BAT",BAT_SOUS,false);
    var ceGens=filtres("CE");
    if(ceGens.length)h+='<div class="octp-grp octp-CE"><div class="octp-grp-t">CE <span class="octp-cnt">'+ceGens.length+'</span></div><ul>'+ceGens.map(function(x){return'<li>'+x.nom+' <span class="octp-code">'+x.code+'</span></li>';}).join("")+'</ul></div>';
    h+=superGroupe("Annexes",ANNEXES_SOUS,true);
    var known=BAT_SOUS.concat(ANNEXES_SOUS).concat(["BAT","CE","Annexes","Autres","Formation","Repos","Non planifié"]);
    ["Autres","Formation","Repos","Non planifié"].forEach(function(cat){
      var gens=filtres(cat);if(!gens.length)return;
      var showCode=(cat==="Autres");
      var cls=cat.replace(/[^A-Za-z0-9]/g,"");
      h+='<div class="octp-grp octp-'+cls+'"><div class="octp-grp-t">'+cat+' <span class="octp-cnt">'+gens.length+'</span></div><ul>'+gens.map(function(x){var d=showCode?' <span class="octp-code">'+x.code+'</span>':'';return'<li>'+x.nom+d+'</li>';}).join("")+'</ul></div>';
    });
    Object.keys(g).forEach(function(cat){
      if(known.indexOf(cat)!==-1)return;
      var gens=filtres(cat);if(!gens.length)return;
      var cls=cat.replace(/[^A-Za-z0-9]/g,"");
      h+='<div class="octp-grp octp-'+cls+'"><div class="octp-grp-t">'+cat+' <span class="octp-cnt">'+gens.length+'</span></div><ul>'+gens.map(function(x){return'<li>'+x.nom+' <span class="octp-code">'+x.code+'</span></li>';}).join("")+'</ul></div>';
    });
    p.querySelector("#octp-resultat").innerHTML=h||'<p>Aucune donnée.</p>';
  }
  remplirJours();
  sel.addEventListener("change",rendre);
  p.querySelector("#octp-filtre").addEventListener("input",rendre);
  p.querySelector("#octp-close").addEventListener("click",function(){p.style.display="none";});
  btn.addEventListener("click",function(){N=noms();P=planning();remplirJours();p.style.display=p.style.display==="none"?"flex":"none";if(p.style.display==="flex")rendre();});
  p.style.display="flex";rendre();
})();
