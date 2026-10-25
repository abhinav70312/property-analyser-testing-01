// PlotMitra — trained Chandigarh property AI (prices per sq.ft)
const BOT_LOGO = `<svg viewBox="0 0 48 48" fill="none"><defs><linearGradient id="pmMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f5ff"/><stop offset=".45" stop-color="#b9c2ef"/><stop offset=".8" stop-color="#7c86d8"/><stop offset="1" stop-color="#5a63bd"/></linearGradient><radialGradient id="pmEye" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="#e6fdff"/><stop offset=".45" stop-color="#22d3ee"/><stop offset="1" stop-color="#0b6b82"/></radialGradient><radialGradient id="pmCore" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#22d3ee"/><stop offset="1" stop-color="#4f46e5"/></radialGradient></defs><ellipse cx="24" cy="44.5" rx="10" ry="2.4" fill="#1e1b4b" opacity=".3"/><rect x="17" y="36" width="4.5" height="7" rx="2.2" fill="url(#pmMetal)" stroke="#454fb8"/><rect x="26.5" y="36" width="4.5" height="7" rx="2.2" fill="url(#pmMetal)" stroke="#454fb8"/><rect x="8" y="26" width="4.5" height="9" rx="2.2" fill="url(#pmMetal)" stroke="#454fb8"/><rect x="35.5" y="26" width="4.5" height="9" rx="2.2" fill="url(#pmMetal)" stroke="#454fb8"/><rect x="14" y="24" width="20" height="13" rx="6" fill="url(#pmMetal)" stroke="#454fb8" stroke-width="1.5"/><circle cx="24" cy="30.5" r="4" fill="url(#pmCore)" stroke="#0b6b82"/><circle cx="24" cy="30.5" r="1.6" fill="#fff"/><rect x="6.5" y="11" width="4.5" height="8" rx="2.2" fill="url(#pmMetal)" stroke="#454fb8"/><rect x="37" y="11" width="4.5" height="8" rx="2.2" fill="url(#pmMetal)" stroke="#454fb8"/><circle cx="8.7" cy="15" r="1.2" fill="#22d3ee"/><circle cx="39.3" cy="15" r="1.2" fill="#22d3ee"/><rect x="10" y="5" width="28" height="20" rx="9" fill="url(#pmMetal)" stroke="#454fb8" stroke-width="1.5"/><ellipse cx="24" cy="7.8" rx="10" ry="2.2" fill="#fff" opacity=".45"/><rect x="14.5" y="9.5" width="19" height="11.5" rx="5.5" fill="#0b1026" stroke="#22d3ee" stroke-opacity=".45"/><g class="botEye"><ellipse cx="20" cy="15" rx="3" ry="3.8" fill="url(#pmEye)"/><ellipse cx="28" cy="15" rx="3" ry="3.8" fill="url(#pmEye)"/><circle cx="21" cy="13.8" r="1" fill="#fff"/><circle cx="29" cy="13.8" r="1" fill="#fff"/></g><rect x="20" y="18" width="2" height="1.6" rx=".8" fill="#22d3ee"/><rect x="23" y="17.4" width="2" height="2.8" rx=".8" fill="#22d3ee"/><rect x="26" y="18" width="2" height="1.6" rx=".8" fill="#22d3ee"/></svg>`;
const inr = n => "Rs " + Math.round(n).toLocaleString("en-IN");
function parseAmt(s){let m=s.match(/(\d+(?:\.\d+)?)\s*(crore|cr|lakh|l|k|thousand)/i);if(!m){let n=s.match(/(\d{5,})/);return n?+n[1]:0;}let v=parseFloat(m[1]),u=m[2].toLowerCase();if(u[0]==="c")return v*1e7;if(u[0]==="l")return v*1e5;return v*1e3;}
function spaAsk(raw){
  const s=raw.toLowerCase(), H=(...w)=>w.some(x=>s.includes(x));
  const S=(typeof SECTORS!=="undefined")?SECTORS:{};
  const secName=Object.keys(S).find(k=>s.includes(k.toLowerCase()));
  if(/^(hi|hii+|hello|hey|namaste|sat sri|ram ram|yo|good (morning|evening|afternoon))\b/.test(s)||H("namaste","sat sri akal"))
    return "Hello! I'm <b>PlotMitra</b>, your Chandigarh land guide. Rates now per sq.ft. Try: <i>'price of Sec 34'</i>, <i>'best sector under 1Cr'</i>, <i>'EMI on 50L'</i>, <i>'legal checklist'</i>.";
  if(H("thank","shukriya","dhanyavad","great","nice","awesome")) return "Anytime! Next: post your need on the <b>Dealers</b> page, or list a property on <b>Marketplace</b>.";
  if(H("who are you","your name","about yourself")) return "I'm <b>PlotMitra</b> — trained on Chandigarh/Mohali/Zirakpur rates (per sq.ft), growth, EMI/ROI math, RERA law and this site's dealer listings.";
  if(H("bye","see you","good night")) return "Bye! I'm on the 🏠 button 24x7. Good luck with your land hunt!";
  if(secName&&H("price","rate","cost","worth","value","sq","gaj","yard","bhav")){const d=S[secName];return `<b>${secName}</b> (${d.zone}): <b>${inr(d.base/9)}/sq.ft</b> in 2026, CAGR ${(d.growth*100).toFixed(1)}%. 5-yr view: <b>${inr(d.base/9*Math.pow(1+d.growth,5))}/sq.ft</b>. ${d.growth>0.09?"High-growth pick.":"Premium stable pick."} Forecast it on the <b>Predict</b> page.`;}
  if(secName&&(H("good","worth","invest","buy","future","growth","review","opinion"))){const d=S[secName];return `<b>${secName}</b>: ${inr(d.base/9)}/sq.ft, ${(d.growth*100).toFixed(1)}%/yr. Verdict: ${d.growth>0.095?"Excellent for 5+ yr growth. Entry still cheap.":d.growth>0.08?"Balanced safety + growth.":"Premium/safe, moderate upside; best for own use or long hold."} Yield ~2.5-3.5%.`;}
  if(H("compare","vs ","versus","difference","which is better")){const rows=Object.entries(S).sort((a,b)=>b[1].growth-a[1].growth).map(([k,d])=>`${k}: ${inr(d.base/9)} (${(d.growth*100).toFixed(1)}%)`).join("<br>");return "Prices per sq.ft, sorted by fastest growth:<br>"+rows+"<br><br><b>Growth</b> → Zirakpur/Mohali Rd. <b>Balance</b> → Sec 34/44/35. <b>Safety</b> → Sec 8/9/17. Give me budget + years for one exact pick.";}
  if(H("under ","budget","lakh","crore","afford","lac")||/\b\d+\s*(l|cr)/.test(s)){
    const amt=parseAmt(s);
    if(amt&&amt<1e7) return `Budget ~<b>${inr(amt)}</b>: <b>Zirakpur</b> (~Rs 6,444/sq.ft = ~${Math.floor(amt/6444)} sq.ft) or <b>Mohali Rd</b> (~Rs 8,000/sq.ft = ~${Math.floor(amt/8000)} sq.ft). Both 10%+ CAGR.`;
    if(amt&&amt<2.5e7) return `Budget ~<b>${inr(amt)}</b>: best balance — <b>Sec 44</b> (~Rs 13,111/sq.ft), <b>Sec 34</b> (~Rs 14,667/sq.ft) or <b>Sec 35</b>. Good resale + rental.`;
    if(amt&&amt>=2.5e7) return `Budget ~<b>${inr(amt)}</b>: premium open — <b>Sec 9 / Sec 8 / SCO Sec 17</b> (commercial, highest rent). Or split: Sec 34 plot + Zirakpur plot for safety + growth.`;
    return "Tell me budget like <i>'under 80 lakh'</i> or <i>'1.5Cr for 5 years'</i> and I'll name sector + plot size.";
  }
  if(H("best sector","where to buy","where to invest","which sector","top sector","hot")) return "Top picks: 🥇 <b>Zirakpur</b> (~Rs 6,444/sq.ft, 11.2%) 🥈 <b>Mohali Rd</b> (~Rs 8,000/sq.ft, 10.4%) 🥉 <b>Sec 44</b> (~Rs 13,111/sq.ft, inside Chd). Share your budget and time horizon, and I will pick the exact sector for you.";
  if(H("predict","future","forecast","2030","2028","2029","2031","2032","double","5 year","10 year")){const y=((s.match(/(\d+)\s*(yr|year)/)||[])[1]||5);if(secName){const d=S[secName],f=d.base/9*Math.pow(1+d.growth,+y);return `<b>${secName}</b> in ${y} yrs: <b>${inr(f)}/sq.ft</b> at ${(d.growth*100).toFixed(1)}%/yr. An 1800 sq.ft plot = <b>${inr(f*1800)}</b>. Exact math on <b>Predict</b> page.`;}return `Rule: future price = today's price x (1 + yearly growth)^years. E.g. Sec 34 (8.9%), 5 yrs = <b>${inr(132000/9*Math.pow(1.089,5))}/sq.ft</b>. Say <i>'Sec 44 in 7 years'</i> or open <b>Predict</b>.`;}
  if(H("sell","exit","book profit")) return "Sell when: 3-yr gain >35% OR yield <2% OR you can move to higher CAGR. Sec 34/44 since 2021 = up ~45% — good time to book a <i>partial</i> profit. List free on <b>Marketplace</b>.";
  if(H("buy now","right time","market down","crash","bubble","wait or buy")) return "Chandigarh rarely crashes (fixed supply, planned city). Trend +7-11%/yr. Waiting usually costs more than the 3-5% discount you could negotiate today. Buy ready-title, hold 5+ yrs.";
  if(H("emi","loan","finance","interest","down payment","eligib")){const P=parseAmt(s)||5000000;const R=(s.match(/(\d+(?:\.\d+)?)\s*%/)||[])[1]||9,Y=(s.match(/(\d+)\s*(yr|year)/)||[])[1]||20;const r=R/1200,N=Y*12,e=P*r*Math.pow(1+r,N)/(Math.pow(1+r,N)-1);return `Loan: <b>${inr(P)}</b> @ ${R}% x ${Y}yrs = EMI <b>${inr(e)}/mo</b>, total <b>${inr(e*N)}</b>. Banks usually fund about 80% of the price; keep the EMI under 40% of your income. Full tool on <b>Calculators</b>.`;}
  if(H("roi","return","profit","rental","rent ","yield","lease")) return "Chandigarh: growth 7-11%/yr + rent 2.5-3.5%. Rs 2Cr flat = Rs 40-55K/mo. Yield = annual rent / price x 100. ROI tool is on <b>Calculators</b>.";
  if(H("stamp","duty","registry","registration","tax","capital gain","rera","legal","paper","document","fraud","check","verify","title","mutation","gpa","agreement")) return "Legal pack: 1) RERA ID (agent+project) 2) 30-yr title chain + EC 3) no HUDA/estate dues 4) CLU if converted 5) <b>registered sale deed only</b> (never GPA alone) 6) khasra + physical measurement match. Cost ~7% stamp + 1% registration + 1-2% agent.";
  if(H("dealer","broker","agent","contact","phone","number","list","propert","for sale","available","site visit")) return "Live sellers (<b>Dealers</b> page): UT Land Hub ★4.9 (Sec 17), Goyal ★4.8 (Sec 34), Chawla ★4.6 (SCO), Green Acres ★4.4 (budget). Each card has <b>Call + WhatsApp</b> + their properties. Post your need on the buyer board — they'll call you.";
  if(H("how to buy","process","steps","procedure","guide me","beginner","new buyer")) return "Steps: 1) budget + loan pre-approval 2) shortlist 2 sectors (ask me) 3) visits + compare Rs/sq.ft 4) legal (title/RERA/dues) 5) pay token money only against a written receipt 6) registered deed + mutation. Which step are you currently on?";
  if(H("negotiat","bargain","discount","offer price")) return "What works: quote recent deals on the same street, offer 5-8% below ask with 15-day close, ask seller to share stamp cost, keep a backup plot. Motivated sellers often accept 8-12% below the asking price.";
  if(H("nri","abroad","oci","foreign")) return "NRIs: residential/commercial OK (no farm land). Registered + attested POA needed. TDS ~12.5% LTCG on sale. Always pay through your NRO account, never in cash.";
  if(H("construction","build cost","build house","material")) return "Build cost: Rs 1,800-2,500/sq.ft. An 1800 sq.ft plot = Rs 35-45L to build + ~10% approvals. Sec 34/44 allow G+2.";
  if(H("sco","shop","showroom","commercial","office")) return "Commercial (Sec 17/22/34): 2-3x residential price, 5-6% yield vs 2.5%. Specialists: Chawla Estates + UT Land Hub on Dealers page.";
  if(H("flat","apartment","floor","builder")) return "Flats: Zirakpur 3BHK Rs 70-90L (value), Sec 35/44 floors Rs 1.2-1.8Cr. Check approved plan, occupancy certificate, stilt + backup. Avoid floors sold on GPA alone without a registered sale deed.";
  if(H("marla","kanal","sq ft","sqft","gaj","bigha","acre","convert","unit")) return "1 sq.yd = 9 sq.ft. 1 marla = 30.25 sq.yd (272 sq.ft). 1 kanal = 500 sq.yd (4500 sq.ft). 1 acre = 4840 sq.yd. So an 1800 sq.ft plot ≈ 200 sq.yd ≈ 6.6 marla.";
  if(H("rent vs buy","rent or buy")) return "If you plan to stay 5+ years, buying beats renting (8%+ growth vs 3% rent). For under 3 years, rent Sec 35/44 (Rs 25-40K 2-3BHK) and invest the rest. Breakeven ~4-5 yrs.";
  if(H("mohali","kharar","zirakpur","panchkula","peer muchalla","dhakoli")) return "Greater-Chandigarh: <b>Zirakpur</b> ~Rs 6,444/sq.ft (11.2%), <b>Mohali Rd</b> ~Rs 8,000/sq.ft (10.4%) — highest growth, lowest entry. Panchkula ~Rs 9-10K/sq.ft. Best for budget + 5-10 yr horizon.";
  const sug=["best sector under 1Cr for 5 years","price of Sec 34","compare Sec 34 vs Zirakpur","EMI on 50 lakh","legal checklist","talk to a dealer"];
  return `Tell me a bit more — try:<br>• ${sug.map(x=>`<i>'${x}'</i>`).join("<br>• ")}<br><br>Or send <b>budget + goal</b> (e.g. <i>'80L, growth, 5 years'</i>). I cover all 10 areas: ${Object.keys(S).join(", ")}.`;
}
function spaTime(){const d=new Date();return d.getHours()+":"+String(d.getMinutes()).padStart(2,"0");}
function spaToggle(){const p=document.getElementById("spaPop");p.classList.toggle("open");if(p.classList.contains("open")){const f=document.getElementById("spaFab");if(f)f.classList.remove("attn");}}
function spaReact(m){spaBubble("b",m);const p=document.getElementById("spaPop");if(!p.classList.contains("open")){const f=document.getElementById("spaFab");if(f){f.classList.remove("attn");void f.offsetWidth;f.classList.add("attn");}}}
function spaBubble(who,text){
  const c=document.getElementById("spaChat");
  if(who==="u")c.innerHTML+=`<div class="um"><span>${text.replace(/</g,"&lt;")}</span><div class="stamp">${spaTime()}</div></div>`;
  else c.innerHTML+=`<div class="bm"><div class="ava">${BOT_LOGO}</div><div><span>${text}</span><div class="stamp">PlotMitra • ${spaTime()}</div></div></div>`;
  c.scrollTop=9999;
}
function spaSend(txt){
  const i=document.getElementById("spaIn"),t=(txt||i.value).trim();if(!t)return;
  spaBubble("u",t);i.value="";
  const c=document.getElementById("spaChat");
  c.innerHTML+=`<div class="bm typ" id="spaTyp"><div class="ava">${BOT_LOGO}</div><span>typing…</span></div>`;c.scrollTop=9999;
  setTimeout(()=>{document.getElementById("spaTyp")?.remove();spaBubble("b",spaAsk(t));},550);
}
document.addEventListener("DOMContentLoaded",()=>{
  if(document.getElementById("spaFab"))return;
  document.body.insertAdjacentHTML("beforeend",
  `<div id="spaFabWrap"><div id="spaFab" onclick="spaToggle()" title="Chat with PlotMitra">${BOT_LOGO}<div id="spaDot"></div></div><div id="spaFabName" onclick="spaToggle()">PlotMitra</div></div>
  <div id="spaPop"><div id="spaHead"><div id="spaAva">${BOT_LOGO}</div>
  <div><b>PlotMitra</b> <span style="background:#10b981;font-size:10px;padding:2px 8px;border-radius:999px">AI • online</span><br><small>Chandigarh property expert — exact prices, smart picks</small></div><span id="spaX" onclick="spaToggle()">✕</span></div></div>
  <div id="spaChat"></div>
  <div id="spaChips"><button onclick="spaSend('best sector under 1Cr for 5 years')">Best under 1Cr</button><button onclick="spaSend('price of Sec 34')">Sec 34 rate</button><button onclick="spaSend('compare Sec 34 vs Zirakpur')">Compare</button><button onclick="spaSend('EMI on 50 lakh')">EMI help</button><button onclick="spaSend('legal checklist')">Legal</button><button onclick="spaSend('talk to a dealer')">Dealers</button></div>
  <div id="spaRow"><input id="spaIn" placeholder="Ask PlotMitra…"><button onclick="spaSend()">Send</button></div></div>`);
  const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  let greet="Hello! I'm <b>PlotMitra</b> — your Chandigarh property expert. Exact prices, smart picks, zero confusion. Ask me anything, e.g. <i>'price of Sec 44'</i> or <i>'best sector under 1Cr'</i>.";
  if(page.includes("predict"))greet="Hello! I'm <b>PlotMitra</b>. Run a forecast below, then ask me <i>'is Sec 34 good for 5 years?'</i> for my take.";
  else if(page.includes("market"))greet="Hello! I'm <b>PlotMitra</b>. Browse the plots, or tell me your budget and I'll shortlist sectors.";
  else if(page.includes("dealer"))greet="Hello! I'm <b>PlotMitra</b>. Ask me <i>'talk to a dealer'</i> and I'll point you to the right one.";
  else if(page.includes("calc"))greet="Hello! I'm <b>PlotMitra</b>. Try the EMI tool, then ask me <i>'EMI on 80 lakh'</i> to compare.";
  spaBubble("b",greet);
  const hook=(n,m)=>{try{if(typeof window[n]==="function"){const o=window[n];window[n]=function(){const r=o.apply(this,arguments);try{spaReact(m);}catch(e){}return r;};}}catch(e){}};
  hook("predict","Nice forecast! Ask me <i>'is this sector good for 5 years?'</i> and I'll give you my verdict.");
  hook("addListing","Your property is live! Ask me <i>'when to sell'</i> for pricing tips.");
  hook("addDemand","Requirement posted! Meanwhile ask me <i>'best sector under 1Cr'</i>.");
  hook("addDealer","Welcome aboard! Your firm now shows in the directory.");
  hook("emi","EMI done! Keep it under 40% of income. Ask me anything on loans.");
  hook("roi","ROI done! Ask me <i>'rent vs buy'</i> if you're still deciding.");
  document.getElementById("spaIn").addEventListener("keydown",e=>{if(e.key==="Enter")spaSend();});
});
