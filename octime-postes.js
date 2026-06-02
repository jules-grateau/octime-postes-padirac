(function(){
  "use strict";
  var existing=document.getElementById("octp-host");
  if(existing){
    var sr=existing.shadowRoot;
    var b=sr&&sr.getElementById("octp-bouton");
    if(b){b.click();return;}
  }
  if(!document.querySelector("#CorpsPlanning .colJours table.groupe tbody tr[data-mat]")){
    alert("Ouvre d'abord un planning OCTIME (vue mensuelle) avant de cliquer.");return;
  }
  var ANNEXE=/^[A-Z]+\d[A-Z]+\d?$/;
  var ANNEXE_EXTRA=/^(DEB|EMB|LIFT|ADS)\d*$/;
  var BAT_SOUS=["B1","B1.2","B2","B2.2","B3","BM","BS"];
  var ANNEXES_SOUS=["Lift","ADS","Débarcadère","Embarcadère"];
  var ORDRE_CAT=BAT_SOUS.concat(["CE"]).concat(ANNEXES_SOUS).concat(["Annexes","Autres","Formation","Repos","Non planifié"]);
  var PARENTS_ORDRE=["BAT","CE"].concat(ANNEXES_SOUS).concat(["Annexes","Autres","Formation","Repos","Non planifié"]);
  function parentCat(cat){
    if(BAT_SOUS.indexOf(cat)!==-1)return"BAT";
    if(ANNEXES_SOUS.indexOf(cat)!==-1)return cat;
    return cat;
  }
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
  var CSS="*{box-sizing:border-box;font-family:system-ui,Arial,sans-serif}#octp-bouton{position:absolute;right:16px;bottom:16px;pointer-events:auto;background:#2b6cb0;color:#fff;border:none;border-radius:20px;padding:10px 16px;font:600 14px/1 system-ui,Arial,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.3)}#octp-panel{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:auto;display:flex;flex-direction:column;background:#fff;color:#1a202c;font:16px/1.5 system-ui,Arial,sans-serif;overflow:hidden}#octp-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#2b6cb0;color:#fff;font-size:20px;font-weight:700;flex-shrink:0}#octp-close{cursor:pointer;font-size:26px;line-height:1;color:#fff;padding:0 0 0 8px}#octp-tabs{display:flex;background:#f7fafc;border-bottom:1px solid #e2e8f0;flex-shrink:0}.octp-tab{flex:1;padding:13px 8px;background:none;border:none;border-bottom:3px solid transparent;font:600 17px/1 system-ui,Arial,sans-serif;cursor:pointer;color:#718096;text-align:center}.octp-tab.octp-actif{border-bottom-color:#2b6cb0;color:#2b6cb0;background:#fff}#octp-controls,#octp-ctrl-resume{display:flex;flex-direction:column;gap:8px;padding:12px 16px;border-bottom:1px solid #e2e8f0;flex-shrink:0}#octp-controls label,#octp-ctrl-resume label{display:flex;align-items:center;gap:8px;font-size:15px}#octp-jour,#octp-filtre,#octp-personne{flex:1;padding:8px 10px;font-size:15px;border:1px solid #cbd5e0;border-radius:6px;background:#fff;color:#1a202c}#octp-resultat{overflow:auto;padding:8px 12px 14px;flex:1;display:flex;flex-direction:column}.octp-grp{margin-bottom:12px;display:flex;flex-direction:column}.octp-grp-t{font-weight:700;text-transform:uppercase;font-size:14px;letter-spacing:.04em;border-left:4px solid #2b6cb0;padding:4px 8px;background:#edf2f7;border-radius:3px}.octp-cnt{float:right;background:#2b6cb0;color:#fff;border-radius:10px;padding:0 8px;font-size:11px}.octp-grp ul{margin:6px 0 0;padding:0 0 0 14px;list-style:none;display:flex;flex-direction:column}.octp-grp li{padding:1px 0}.octp-code{color:#718096;font-size:11px}.octp-sous-wrap{padding:4px 0 0 8px;border-left:2px solid #e2e8f0;margin:4px 4px 0;display:flex;flex-direction:column}.octp-BAT>.octp-sous-wrap{border-left-color:#c6f6d5}.octp-Annexes>.octp-sous-wrap{border-left-color:#d9d6fe}.octp-sous-grp{margin-bottom:7px;display:flex;flex-direction:column}.octp-sous-t{font-weight:700;text-transform:uppercase;font-size:12px;letter-spacing:.04em;border-left:3px solid #888;padding:3px 8px;background:#f0f4f8;border-radius:2px}.octp-cnt-sous{float:right;background:#718096;color:#fff;border-radius:10px;padding:0 7px;font-size:10px}.octp-sous-grp ul{margin:4px 0 0;padding:0 0 0 12px;list-style:none;display:flex;flex-direction:column}.octp-sous-grp li{padding:1px 0}.octp-BAT>.octp-grp-t{border-left-color:#276749}.octp-sous-B1 .octp-sous-t{border-left-color:#38a169}.octp-sous-B12 .octp-sous-t{border-left-color:#68d391}.octp-sous-B2 .octp-sous-t{border-left-color:#dd6b20}.octp-sous-B22 .octp-sous-t{border-left-color:#f6ad55}.octp-sous-B3 .octp-sous-t{border-left-color:#4b6afa}.octp-sous-BM .octp-sous-t{border-left-color:#9f7aea}.octp-sous-BS .octp-sous-t{border-left-color:#fc8181}.octp-Annexes>.octp-grp-t{border-left-color:#805ad5}.octp-sous-Lift .octp-sous-t{border-left-color:#0694a2}.octp-sous-ADS .octp-sous-t{border-left-color:#5850ec}.octp-sous-Dbarcadre .octp-sous-t{border-left-color:#e3a008}.octp-sous-Embarcadre .octp-sous-t{border-left-color:#e74694}.octp-CE>.octp-grp-t{border-left-color:#e53e3e}.octp-Repos>.octp-grp-t{border-left-color:#a0aec0}.octp-Formation>.octp-grp-t{border-left-color:#d69e2e}.octp-res-stats{display:flex;gap:16px;padding:8px 10px;background:#edf2f7;border-radius:6px;margin-bottom:12px;font-size:13px}.octp-res-grp{margin-bottom:12px;display:flex;flex-direction:column}.octp-res-t{font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.04em;padding:4px 8px;background:#edf2f7;border-left:4px solid #2b6cb0;border-radius:3px}.octp-res-sous-wrap{padding:4px 0 0 8px;border-left:2px solid #e2e8f0;margin:4px 4px 0;display:flex;flex-direction:column}.octp-res-code-grp{margin-bottom:6px;display:flex;flex-direction:column}.octp-res-code-t{font-weight:700;text-transform:uppercase;font-size:11px;letter-spacing:.03em;padding:2px 6px;color:#4a5568}.octp-res-code-grp ul{margin:3px 0 0;padding:0 0 0 10px;list-style:none;display:flex;flex-direction:column}.octp-res-code-grp li{padding:3px 0;font-size:12px;border-bottom:1px solid #f7f7f7}.octp-res-jour{font-weight:600}.octp-res-jours{padding:2px 6px;color:#4a5568;font-size:12px;line-height:1.9}.octp-res-BAT .octp-res-t{border-left-color:#276749}.octp-res-CE .octp-res-t{border-left-color:#e53e3e}.octp-res-Lift .octp-res-t{border-left-color:#0694a2}.octp-res-ADS .octp-res-t{border-left-color:#5850ec}.octp-res-Dbarcadre .octp-res-t{border-left-color:#e3a008}.octp-res-Embarcadre .octp-res-t{border-left-color:#e74694}.octp-res-Repos .octp-res-t{border-left-color:#a0aec0}.octp-res-Formation .octp-res-t{border-left-color:#d69e2e}";

  var host=document.createElement("div");
  host.id="octp-host";
  host.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483640;pointer-events:none";
  document.body.appendChild(host);
  var shadow=host.attachShadow({mode:"open"});
  var st=document.createElement("style");st.textContent=CSS;shadow.appendChild(st);
  var btn=document.createElement("button");btn.id="octp-bouton";btn.textContent="Postes / jour";shadow.appendChild(btn);
  var p=document.createElement("div");p.id="octp-panel";p.style.display="none";
  p.innerHTML='<div id="octp-head"><strong>Effectifs par poste</strong><span id="octp-close" title="Fermer">×</span></div><div id="octp-tabs"><button id="octp-tab-postes" class="octp-tab octp-actif">Par poste</button><button id="octp-tab-resume" class="octp-tab">Résumé</button></div><div id="octp-controls"><label>Jour : <select id="octp-jour"></select></label><label><input id="octp-filtre" type="text" placeholder="filtrer un nom…"></label></div><div id="octp-ctrl-resume" style="display:none"><label>Employé : <select id="octp-personne"></select></label></div><div id="octp-resultat"></div>';
  shadow.appendChild(p);

  var N=noms(),P=planning();
  var onglet="postes",personnesRemplies=false;
  var sel=p.querySelector("#octp-jour");
  var personSel=p.querySelector("#octp-personne");
  var controls=p.querySelector("#octp-controls");
  var ctrlResume=p.querySelector("#octp-ctrl-resume");
  var tabPostes=p.querySelector("#octp-tab-postes");
  var tabResume=p.querySelector("#octp-tab-resume");
  var resultat=p.querySelector("#octp-resultat");
  function defaultJour(){
    if(!P.dd)return 0;
    var today=new Date();
    if(today.getFullYear()===P.dd.getFullYear()&&today.getMonth()===P.dd.getMonth()){
      return Math.max(0,Math.min(today.getDate()-P.dd.getDate(),P.nb-1));
    }
    return 0;
  }
  function remplirJours(){sel.innerHTML="";for(var i=0;i<P.nb;i++){var o=document.createElement("option");o.value=i;o.textContent=lbl(P.dd,i);sel.appendChild(o);}sel.value=defaultJour();}
  function remplirPersonnes(force){
    if(personnesRemplies&&!force)return;
    var prev=personSel.value;
    personSel.innerHTML="";
    Object.keys(N).map(function(mat){return{mat:mat,nom:N[mat]};})
      .sort(function(a,b){return a.nom.localeCompare(b.nom,"fr");})
      .forEach(function(e){var o=document.createElement("option");o.value=e.mat;o.textContent=e.nom;personSel.appendChild(o);});
    if(prev)personSel.value=prev;
    personnesRemplies=true;
  }
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
    resultat.innerHTML=h||'<p>Aucune donnée.</p>';
  }
  function rendreResume(){
    var mat=personSel.value;
    if(!mat){resultat.innerHTML='<p style="padding:8px 0">Sélectionne un employé.</p>';return;}
    var empData=null;
    for(var i=0;i<P.L.length;i++){if(P.L[i].mat===mat){empData=P.L[i];break;}}
    if(!empData){resultat.innerHTML='<p>Données introuvables.</p>';return;}
    var parParent={};
    for(var d=0;d<P.nb;d++){
      var code=empData.codes[d]||"";
      var parent=parentCat(categorie(code));
      if(!parParent[parent])parParent[parent]={};
      (parParent[parent][code]=parParent[parent][code]||[]).push(d);
    }
    var parents=Object.keys(parParent).sort(function(a,b){
      var oa=PARENTS_ORDRE.indexOf(a),ob=PARENTS_ORDRE.indexOf(b);
      if(oa<0)oa=999;if(ob<0)ob=999;
      return oa-ob;
    });
    var travailles=0,repos=0,nonPlanifies=0;
    for(var i=0;i<P.nb;i++){
      var cat=categorie(empData.codes[i]||"");
      if(cat==="Repos")repos++;
      else if(cat==="Non planifié")nonPlanifies++;
      else travailles++;
    }
    var h='<div class="octp-res-stats"><span>Travaillé : <strong>'+travailles+'j</strong></span><span>Repos : <strong>'+repos+'j</strong></span><span>Non planifié : <strong>'+nonPlanifies+'j</strong></span></div>';
    parents.forEach(function(parent){
      var codeMap=parParent[parent];
      var codes=Object.keys(codeMap).sort(function(a,b){return a.localeCompare(b,"fr");});
      var total=codes.reduce(function(n,c){return n+codeMap[c].length;},0);
      var cls=parent.replace(/[^A-Za-z0-9]/g,"");
      h+='<div class="octp-res-grp octp-res-'+cls+'"><div class="octp-res-t">'+parent+' <span class="octp-cnt">'+total+'</span></div><div class="octp-res-sous-wrap">';
      codes.forEach(function(code){
        var jours=codeMap[code];
        var isADS=(annexeSous(code.toUpperCase())==="ADS");
        var label=code||"—";
        h+='<div class="octp-res-code-grp"><div class="octp-res-code-t">'+label+' <span class="octp-cnt-sous">'+jours.length+'</span></div>';
        if(isADS){
          h+='<ul>';
          jours.forEach(function(di){
            var collegues=[];
            P.L.forEach(function(l){
              if(l.mat===mat)return;
              var c=l.codes[di]||"";
              if(annexeSous(c.toUpperCase())==="ADS")collegues.push({nom:N[l.mat]||l.mat,code:c});
            });
            collegues.sort(function(a,b){return a.code.localeCompare(b.code)||a.nom.localeCompare(b.nom,"fr");});
            h+='<li><span class="octp-res-jour">'+lbl(P.dd,di)+'</span>';
            if(collegues.length)h+=' — '+collegues.map(function(c){return c.nom+' <span class="octp-code">'+c.code+'</span>';}).join(', ');
            h+='</li>';
          });
          h+='</ul>';
        } else {
          h+='<div class="octp-res-jours">'+jours.map(function(d){return lbl(P.dd,d);}).join(' · ')+'</div>';
        }
        h+='</div>';
      });
      h+='</div></div>';
    });
    resultat.innerHTML=h||'<p>Aucune donnée.</p>';
  }
  remplirJours();
  sel.addEventListener("change",rendre);
  p.querySelector("#octp-filtre").addEventListener("input",rendre);
  personSel.addEventListener("change",rendreResume);
  tabPostes.addEventListener("click",function(){
    onglet="postes";
    tabPostes.className="octp-tab octp-actif";tabResume.className="octp-tab";
    controls.style.display="";ctrlResume.style.display="none";
    rendre();
  });
  tabResume.addEventListener("click",function(){
    onglet="resume";
    tabResume.className="octp-tab octp-actif";tabPostes.className="octp-tab";
    controls.style.display="none";ctrlResume.style.display="";
    remplirPersonnes();rendreResume();
  });
function ouvrirPanel(){host.style.pointerEvents="auto";p.style.display="flex";}
  function fermerPanel(){p.style.display="none";host.style.pointerEvents="none";}
  p.querySelector("#octp-close").addEventListener("click",fermerPanel);
  btn.addEventListener("click",function(){
    N=noms();P=planning();personnesRemplies=false;
    remplirJours();
    if(p.style.display==="none"){
      ouvrirPanel();
      if(onglet==="postes")rendre();
      else{remplirPersonnes();rendreResume();}
    } else {
      fermerPanel();
    }
  });
  ouvrirPanel();rendre();
})();
