// predictor + charts + marketplace + demands (prices shown per sq.ft)
const $=id=>document.getElementById(id);
const fmt=n=>"Rs "+Math.round(n).toLocaleString("en-IN");
const store=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const load=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??f}catch{return f};};
function ticker(){
  const el=$("tick"); if(!el) return;
  const rows=Object.entries(SECTORS).map(([s,d])=>{
    const j=(Math.random()*2-1)*0.004, p=d.base/9*(1+j);
    return `${s} ${fmt(p)}/sq.ft <span class="${j>=0?'up':''}">${j>=0?'▲':'▼'}</span>`;
  });
  el.innerHTML=rows.join(" &nbsp;•&nbsp; ");
}
setInterval(ticker,3000); ticker();
let chartSec="Sec 34";
function drawChart(){
  const c=$("chart"); if(!c) return; const ctx=c.getContext("2d");
  const W=c.width=c.offsetWidth*2, H=c.height=460;
  ctx.clearRect(0,0,W,H);
  const d=SECTORS[chartSec].trend.map(v=>v/9), max=Math.max(...d)*1.15, min=0;
  ctx.strokeStyle="#4f46e5"; ctx.lineWidth=4; ctx.beginPath();
  d.forEach((v,i)=>{const x=40+i*(W-80)/(d.length-1), y=H-40-(v-min)/(max-min)*(H-80); i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
  ctx.stroke();
  ctx.fillStyle="#5b6b8c"; ctx.font="22px Inter";
  d.forEach((v,i)=>{const x=40+i*(W-80)/(d.length-1), y=H-40-(v-min)/(max-min)*(H-80);
    ctx.fillStyle="#4f46e5";ctx.beginPath();ctx.arc(x,y,8,0,7);ctx.fill();
    ctx.fillStyle="#5b6b8c";ctx.fillText(YEARS[i],x-20,H-8);});
  $("chartLbl").textContent=chartSec+" — "+fmt(SECTORS[chartSec].base/9)+"/sq.ft (2026)";
}
function predict(){
  const s=$("pSec").value, area=+$("pArea").value||100, yrs=+$("pYrs").value||5;
  const sec=SECTORS[s]; const rate=sec.growth;
  const fut=sec.base/9*Math.pow(1+rate,yrs);
  const cagr=(rate*100).toFixed(1);
  $("pOut").innerHTML=`<div class="kpi">${fmt(fut)}<span class="mut"> /sq.ft in ${2026+yrs}</span></div>
  <p>Total for ${area} sq.ft: <b>${fmt(fut*area)}</b> &nbsp; <span class="pill">CAGR ${cagr}%</span>
  <span class="pill">${sec.zone}</span></p>
  <p class="mut">Verdict: ${rate>0.09?"High-growth corridor — good for 5yr+ hold.":"Stable premium sector — safe, moderate upside."} Rental yield ~2.5-3.5%. Stamp duty ~7%.</p>`;
  drawProj(s,area,yrs);
}
function drawProj(s,area,yrs){
  const c=$("proj"); if(!c) return; const ctx=c.getContext("2d");
  const W=c.width=c.offsetWidth*2,H=c.height=460;ctx.clearRect(0,0,W,H);
  const sec=SECTORS[s];let pts=[];for(let i=0;i<=yrs;i++)pts.push(sec.base/9*Math.pow(1+sec.growth,i));
  const max=Math.max(...pts)*1.05;ctx.strokeStyle="#059669";ctx.lineWidth=4;ctx.beginPath();
  pts.forEach((v,i)=>{const x=40+i*(W-80)/yrs,y=H-40-v/max*(H-80);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
  ctx.stroke();ctx.fillStyle="#059669";
  pts.forEach((v,i)=>{const x=40+i*(W-80)/(yrs||1),y=H-40-v/max*(H-80);ctx.beginPath();ctx.arc(x,y,7,0,7);ctx.fill();});
}
function emi(){
  const P=+$("eP").value||5000000,R=(+$("eR").value||9)/1200,N=(+$("eY").value||20)*12;
  const e=P*R*Math.pow(1+R,N)/(Math.pow(1+R,N)-1);
  $("eOut").innerHTML=`Monthly EMI: <b>${fmt(e)}</b> &nbsp; Total payable: <b>${fmt(e*N)}</b>`;
}
function roi(){
  const buy=+$("rBuy").value||10000000,sell=+$("rSell").value||14000000,yrs=+$("rY").value||5,rent=+$("rRent").value||20000;
  const gain=sell-buy+rent*12*yrs, pct=(gain/buy*100).toFixed(1), ann=(Math.pow(sell/buy,1/yrs)-1)*100;
  $("rOut").innerHTML=`Net gain: <b>${fmt(gain)}</b> (${pct}%) &nbsp; <span class="pill">≈ ${ann.toFixed(1)}%/yr</span>`;
}
function waLink(phone,msg){return "https://wa.me/91"+String(phone).replace(/\D/g,"")+"?text="+encodeURIComponent(msg||"Hi, I saw your property on Smart Property Analyser.");}
function renderDealers(){
  const el=$("dealers"); if(!el)return;
  const d=load("dealers",DEALERS_SEED), l=load("listings",LISTINGS_SEED);
  el.innerHTML=d.map(x=>{
    const props=l.filter(p=>p.by===x.name||p.phone===x.phone);
    const plist=props.length?props.map(p=>`<div style="background:#f4f6ff;border:1px solid rgba(60,80,180,.14);border-radius:8px;padding:8px;margin-top:6px;font-size:13px"><b>${p.title}</b><br><span class="mut">${p.sector} • ${p.type} • ${p.area||""} sq.ft</span><br><b>${fmt(p.price)}</b> <span class="pill">${p.tag||""}</span><br><a href="tel:${p.phone}"><button class="ghost" style="margin-top:4px">Call</button></a> <a href="${waLink(p.phone,"Hi "+x.name+", I'm interested in: "+p.title)}" target="_blank"><button class="ghost" style="margin-top:4px">WhatsApp</button></a></div>`).join(""):`<p class="mut" style="font-size:13px">No live listings yet.</p>`;
    const init=x.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    return `<div class="card"><div style="display:flex;gap:10px;align-items:center"><div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#10b981);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700">${init}</div>
    <div><h3 style="margin:0">${x.name} <span class="tag">★${x.rating}</span></h3><p class="mut">${x.owner||""} • ${x.exp||""} exp</p></div></div>
    <p class="mut" style="margin-top:8px">${x.area} • ${x.spl}</p>
    <p style="font-size:13px">📞 ${x.phone} • ${x.deals} deals closed<br><span class="mut">RERA: ${x.rera||"verify on call"}</span></p>
    <div style="display:flex;gap:6px;margin:6px 0"><a href="tel:${x.phone}"><button>Call</button></a><a href="${waLink(x.phone)}" target="_blank"><button class="ghost">WhatsApp</button></a></div>
    <details><summary class="mut">Properties for sale (${props.length}) — tap to view</summary>${plist}</details></div>`;
  }).join("");
}
function renderListings(){
  const el=$("lists"); if(!el)return;
  const l=load("listings",LISTINGS_SEED);
  const q=(($("q")&&$("q").value)||"").toLowerCase();
  const df=$("dFilter"), only=df?df.value:"All dealers";
  el.innerHTML=l.filter(x=>((x.title+x.sector+x.type+x.by).toLowerCase().includes(q))&&(only==="All dealers"||x.by===only)).map(x=>
  `<div class="card"><div style="display:flex;justify-content:space-between"><span class="pill">${x.tag||x.type}</span><span class="mut">${x.sector}</span></div><h3 style="margin-top:6px">${x.title}</h3><p class="mut">${x.area||""} sq.ft • ${x.type}</p><p><b>${fmt(x.price)}</b> <span class="mut">(${fmt(x.price/(x.area||1))}/sq.ft)</span></p><p class="mut">Seller: ${x.by} • ${x.phone}</p><div style="display:flex;gap:6px"><a href="tel:${x.phone}"><button>Call seller</button></a><a href="${waLink(x.phone,"Hi, I'm interested in your listing: "+x.title+" ("+fmt(x.price)+")")}" target="_blank"><button class="ghost">WhatsApp</button></a></div></div>`).join("")||"<p class='mut'>No matches. Try another search or dealer.</p>";
  if(df&&!df.options.length){df.innerHTML=`<option>All dealers</option>`+[...new Set(l.map(x=>x.by))].map(b=>`<option>${b}</option>`).join("");}
}
function addListing(){
  const l=load("listings",LISTINGS_SEED);
  l.unshift({id:"p"+Date.now(),title:$("lT").value||"Plot",sector:$("lS").value,price:+$("lP").value||0,area:+($("lA")&&$("lA").value)||0,type:$("lTy").value,by:$("lBy").value||"Owner",phone:$("lPh").value||"-",tag:"New"});
  store("listings",l);renderListings();renderDealers();
  const df=$("dFilter");if(df)df.innerHTML="";
  alert("Published! Visible in Marketplace + under your dealer card.");
}
function renderDemands(){
  const el=$("dems"); if(!el)return;
  const d=load("demands",DEMANDS_SEED), l=load("listings",LISTINGS_SEED);
  el.innerHTML=d.map((x,i)=>{
    const matches=l.filter(p=>p.type===x.type||p.sector===x.loc).length;
    return `<div class="card" style="margin-bottom:8px"><b>${x.name}</b> <span class="pill">${matches} match${matches===1?"":"es"}</span><br><span style="font-size:13px">Wants: ${x.type} in ${x.loc} • Budget ${x.budget}</span><br><span class="mut" style="font-size:12px">${x.note||""} • 📞 ${x.phone||""}</span><br><div style="display:flex;gap:6px;margin-top:4px"><a href="tel:${x.phone}"><button class="ghost">Call buyer</button></a><button class="ghost" onclick="delDemand(${i})">Done</button></div></div>`;
  }).join("")||"<span class='mut'>No demands yet — be the first.</span>";
}
function delDemand(i){const d=load("demands",DEMANDS_SEED);d.splice(i,1);store("demands",d);renderDemands();}
function addDemand(){
  const d=load("demands",DEMANDS_SEED);
  const b=$("dB").value||"-";
  d.unshift({name:$("dN").value||"Buyer",phone:$("dP")?$("dP").value:"",budget:b,loc:$("dL").value||"Any",type:$("dT").value||"Any",note:$("dNote")?$("dNote").value:""});
  store("demands",d);renderDemands();alert("Requirement posted! Dealers can now call you.");
}
function addDealer(){
  const d=load("dealers",DEALERS_SEED);
  d.unshift({name:$("dlN").value||"New Dealer",area:$("dlA").value||"Chandigarh",phone:$("dlP").value||"-",deals:0,rating:5,spl:$("dlS").value||"General"});
  store("dealers",d);renderDealers();
}
function ask(q){
  q=q.toLowerCase();
  const has=(...w)=>w.some(x=>q.includes(x));
  if(has("buy","invest","best sector","where"))return "For budget < Rs 80L pick Zirakpur / Mohali Rd (CAGR 10%+). For safe premium pick Sec 8/9/17. Tell me budget + horizon and I'll narrow it.";
  if(has("sell","when"))return "Sell signal: 3yr gain >35% or rental yield <2%. Sec 34/44 owners sitting since 2021 are up ~45% — good time to partially book.";
  if(has("predict","future","2028","2030"))return "Use the predictor: pick sector, area, years. Rule: price x (1+CAGR)^years.";
  if(has("loan","emi"))return "Banks fund ~75-80% at 8.5-9.5%. Use the EMI calculator. Keep EMI <40% of income.";
  if(has("dealer","broker"))return "Top rated: UT Land Hub (4.9, Sec 17) and Goyal Properties (4.8, Sec 34). Verify RERA + title before token money.";
  if(has("rera","legal","stamp","fraud"))return "Checklist: RERA ID, title chain 30 yrs, no dues, registered sale deed only. Stamp duty ~7% + 1% registration.";
  if(has("rent","yield"))return "Chandigarh rental yield is 2.5-3.5%. A Rs 2Cr flat rents ~Rs 40-55K/mo.";
  if(has("hi","hello","namaste"))return "Namaste! I guide land buy/sell in Chandigarh. Ask: best sector under 1Cr? predict Sec 34 2030? EMI? legal checklist?";
  return "I can help with: buy vs sell timing, sector growth, prediction, EMI/ROI, dealer contacts, legal checklist. Try: 'best sector under 1 crore for 5 years?'";
}
function send(){
  const i=$("qin"); if(!i) return; const t=i.value.trim();if(!t)return;
  $("chat").innerHTML+=`<div class="um"><span>${t}</span></div>`;
  $("chat").innerHTML+=`<div class="bm"><span>${ask(t)}</span></div>`;
  i.value="";$("chat").scrollTop=9999;
}
const on=(id,ev,fn)=>{const e=$(id);if(e)e[ev]=fn;};
window.onload=()=>{
  const secs=Object.keys(SECTORS);
  ["pSec","lS","cSec"].forEach(id=>{const e=$(id);if(e)e.innerHTML=secs.map(s=>`<option>${s}</option>`).join("");});
  if($("pSec"))$("pSec").value="Sec 34";chartSec="Sec 34";
  if($("cSec"))$("cSec").value=chartSec;
  if($("chart"))drawChart();renderDealers();renderListings();renderDemands();
  if($("chat"))$("chat").innerHTML=`<div class="bm"><span>Namaste! Ask about sectors, prediction, EMI, or legal tips.</span></div>`;
  on("cSec","onchange",e=>{chartSec=e.target.value;drawChart();});
  on("q","oninput",renderListings);
  const heat=$("heat");
  if(heat){const all=Object.entries(SECTORS).sort((a,b)=>b[1].growth-a[1].growth);const mx=all[0][1].growth;
  heat.innerHTML=all.map(([s,d])=>{const g=Math.round(d.growth/mx*100);
    return `<div class="card"><b>${s}</b><div class="mut">${d.zone} • ${fmt(d.base/9)}/sq.ft</div><div style="background:#dbe4ff;border-radius:6px;margin-top:6px"><div style="width:${g}%;background:linear-gradient(90deg,#4f46e5,#10b981);padding:3px 6px;border-radius:6px;font-size:12px;color:#fff">${(d.growth*100).toFixed(1)}% CAGR</div></div></div>`;}).join("");
  }
};
