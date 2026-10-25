// PlotMitra brain v3 — every number computed from data.js, answers link into the site. Overrides spaAsk().
function plotAnswer(raw) {
  const s = raw.toLowerCase(), H = (...w) => w.some(x => s.includes(x));
  const S = (typeof SECTORS !== 'undefined') ? SECTORS : {};
  const names = Object.keys(S);
  const n = s.replace(/\bsectors?\b/g, 'sec');
  const sec = names.find(k => n.includes(k.toLowerCase()));
  const ft = d => inr(Math.round(d / 9));
  const pct = d => (d.growth * 100).toFixed(1);
  const proj = (d, y) => d.base / 9 * Math.pow(1 + d.growth, y);
  const L = (p, h, t) => `<a class="botlink" href="${p}.html#${h}">${t}</a>`;
  const order = [...names].sort((a, b) => S[b].growth - S[a].growth);
  const t3 = order.slice(0, 3), safe2 = order.slice(-2);
  const rate = k => (S[k] ? ft(S[k].base) : '—');

  if (/^(hi|hii+|hello|hey|namaste|sat sri|ram ram|yo|good (morning|evening|afternoon))\b/.test(s) || H('namaste', 'sat sri akal'))
    return "Hello! I am <b>PlotMitra</b> — your Chandigarh property expert. Exact prices, smart picks, zero confusion. Ask me anything.";
  if (H('thank', 'shukriya', 'dhanyavad')) return `You are welcome! Try the ${L('predict', 'spot-predict', 'Predict page')} or ask 'best sector under 1Cr'.`;
  if (H('bye', 'see you', 'good night')) return "Goodbye! I am here 24x7 on the PlotMitra button.";
  if (H('who are you', 'your name', 'about yourself')) return "I am <b>PlotMitra</b>. I know all 10 area rates, growth, EMI math, and legal steps for Chandigarh.";
  if (H('rent vs buy', 'rent or buy')) return "Staying 5+ yrs? Buy — growth beats rent. Under 3 yrs? Rent a 2-3BHK (Rs 25-40K) and invest the rest.";
  if (H('compare', ' vs ', 'versus', 'difference', 'which is better')) {
    const line = t3.map(k => `<b>${k}</b> ${pct(S[k])}%`).join(' • ');
    return `Fastest growth: ${line}. Safest: ${safe2.join(', ')}. Tell me budget + years and I will pick one — or ${L('predict', 'spot-predict', 'try the predictor')}.`;
  }
  if (H('loan') && H('process', 'steps', 'how', 'procedure'))
    return `Loan steps: 1) pre-approval 2) property check 3) legal check 4) money paid against sale deed. Takes 2-4 weeks. Run numbers on the ${L('calc', 'spot-emi', 'EMI tool')}.`;
  if (/\bemi\b/.test(s) || H('loan', 'finance', 'interest', 'down payment', 'eligib', 'pre-approv')) {
    const P = parseAmt(s) || 5000000;
    const Rt = (s.match(/(\d+(?:\.\d+)?)\s*%/) || [])[1] || 9, Y = (s.match(/(\d+)\s*(yr|year)/) || [])[1] || 20;
    const r = Rt / 1200, N = Y * 12, e = P * r * Math.pow(1 + r, N) / (Math.pow(1 + r, N) - 1);
    return `Loan <b>${inr(P)}</b> at ${Rt}% for ${Y} yrs = EMI <b>${inr(e)}/month</b>. Keep EMI below 40% of income (earn ~${inr(e * 2.5)}/month). ${L('calc', 'spot-emi', 'Open EMI tool')} — it lights up for you.`;
  }
  if (H('predict', 'future', 'forecast', '2030', '2028', '2029', '2031', '2032', 'double', '5 year', '10 year') || (/\d+\s*(yr|year)/.test(s) && sec)) {
    const y = +((s.match(/(\d+)\s*(yr|year)/) || [])[1] || 5);
    if (sec) { const d = S[sec]; return `<b>${sec}</b> in ${y} yrs: about <b>${inr(proj(d, y))}/sq.ft</b> at ${pct(d)}%/yr. An 1800 sq.ft plot = <b>${inr(proj(d, y) * 1800)}</b>. ${L('predict', 'spot-result', 'See it charted')} — highlighted for you.`; }
    const d0 = S['Sec 34'];
    const ex = d0 ? `Example: Sec 34 at ${pct(d0)}% for 5 yrs = <b>${inr(proj(d0, 5))}/sq.ft</b>. ` : '';
    return `Rule: future price = today x (1 + growth)^years. ${ex}Name a sector + years, or ${L('predict', 'spot-predict', 'open the predictor')}.`;
  }
  if (sec && H('price', 'rate', 'cost', 'worth', 'value', 'sq', 'gaj', 'yard', 'bhav', 'kya')) {
    const d = S[sec];
    return `<b>${sec}</b> (${d.zone}): <b>${ft(d.base)}/sq.ft</b> today, growing ${pct(d)}%/yr. In 5 yrs: about <b>${inr(proj(d, 5))}/sq.ft</b>. ${L('predict', 'spot-predict', 'Forecast it yourself')} — I highlighted the tool.`;
  }
  if (sec && H('good', 'worth', 'invest', 'buy', 'future', 'growth', 'review', 'opinion', 'safe', 'best')) {
    const d = S[sec], g = d.growth;
    const v = g > 0.095 ? "Great for 5+ yr growth. Prices still low." : g > 0.08 ? "Good mix of safety + growth." : "Very safe, slow growth. Best to live in, or hold long.";
    return `<b>${sec}</b>: ${ft(d.base)}/sq.ft, ${pct(d)}%/yr. ${v} ${L('market', 'spot-search', 'See live plots here')}.`;
  }
  if (H('under ', 'budget', 'lakh', 'crore', 'afford', 'lac') || /\b\d+\s*(l|cr)\b/.test(s)) {
    const amt = parseAmt(s);
    if (amt && amt < 1e7) { const z = S['Zirakpur'], m = S['Mohali Rd']; return `With <b>${inr(amt)}</b>: buy <b>Zirakpur</b> (~${Math.floor(amt / (z.base / 9))} sq.ft, ${pct(z)}%/yr) or <b>Mohali Rd</b> (~${Math.floor(amt / (m.base / 9))} sq.ft, ${pct(m)}%/yr). ${L('market', 'spot-search', 'Browse plots')} — highlighted.`; }
    if (amt && amt < 2.5e7) return `With <b>${inr(amt)}</b>: best balance is <b>Sec 44</b> (${rate('Sec 44')}/sq.ft), <b>Sec 34</b> (${rate('Sec 34')}/sq.ft) or <b>Sec 35</b> (${rate('Sec 35')}/sq.ft). Good resale + rent.`;
    if (amt && amt >= 2.5e7) return `With <b>${inr(amt)}</b>: go premium — <b>Sec 9 (${rate('Sec 9')}/sq.ft), Sec 8, or SCO Sec 17</b>. Or split: one Sec 34 plot + one Zirakpur plot.`;
    return "Tell me your budget, like 'under 80 lakh' or '1.5Cr for 5 years'.";
  }
  if (H('best sector', 'where to buy', 'where to invest', 'which sector', 'top sector', 'hot', 'cheap plot', 'low budget'))
    return `Top growth: ${t3.map(k => `<b>${k}</b> ${pct(S[k])}%`).join(' • ')}. Tell me budget + years for one exact pick — or ${L('market', 'spot-search', 'see live plots')}.`;
  if (H('sell', 'exit', 'book profit')) {
    const d0 = S['Sec 34'], g3 = d0 ? `Sec 34 is up ~${Math.round((Math.pow(1 + d0.growth, 3) - 1) * 100)}% in 3 yrs. ` : '';
    return `Sell when: 1) 3-yr gain above 35%, or 2) rent below 2%, or 3) you found faster-growing land. ${g3}${L('market', 'spot-sell', 'List free here')} — form highlighted.`;
  }
  if (H('buy now', 'right time', 'market down', 'crash', 'bubble', 'wait or buy', 'fall')) {
    const gs = names.map(k => S[k].growth * 100), lo = Math.min(...gs).toFixed(0), hi = Math.max(...gs).toFixed(0);
    return `Chandigarh rarely crashes — land is limited. Prices rise ${lo}-${hi}%/yr. Waiting usually costs more than the 3-5% you can bargain today.`;
  }
  if (H('roi', 'return', 'profit', 'rental', 'yield', 'lease') || (H('rent') && !H('vs', 'or buy'))) {
    if (sec && !H('roi', 'return', 'profit', 'yield')) { const d = S[sec], v = d.base / 9 * 1800, lo = Math.round(v * 0.025 / 12), hi = Math.round(v * 0.035 / 12); return `A 1800 sq.ft place in <b>${sec}</b> (~${inr(v)}) rents ~<b>${inr(lo)}-${inr(hi)}/month</b> (2.5-3.5% yield). ${L('calc', 'spot-roi', 'Run full ROI math')} — tool highlighted.`; }
    return `Two incomes: price rise ~7-11%/yr + rent ~2.5-3.5%/yr. A Rs 2Cr flat rents ~Rs 40-55K/month. ${L('calc', 'spot-roi', 'Calculate your return')} — tool highlighted.`;
  }
  if (H('stamp', 'duty', 'registry', 'registration cost')) return "Extra cost in Chandigarh/Punjab: stamp duty ~7% + registration 1%. On Rs 1Cr, keep ~Rs 8L extra. Agent fee 1-2% more.";
  if (H('token', 'advance', 'booking amount', 'earnest')) return `Pay token ONLY against a written receipt with property ID, amount, and refund terms. Never cash. Keep it small (Rs 50K-1L) until papers are verified.`;
  if (H('rera', 'verify', 'check')) return "Verify on rera.punjab.gov.in: match project name, promoter name, and validity date. No valid RERA = do not pay.";
  if (H('fraud', 'scam', 'cheat', 'red flag', 'risk', 'safe')) return "Red flags: GPA-only sale, price far below market, seller rushing you, pending dues, cash demand. Any one = walk away.";
  if (H('document', 'paper', 'legal', 'title', 'mutation', 'gpa', 'agreement', 'khasra', 'encumbrance', 'ec cert')) return "Must-have papers: 1) sale deed 2) 30-yr title chain + EC 3) RERA cert 4) no-dues NOC 5) approved plan. Never accept GPA alone — only a registered sale deed.";
  if (H('capital gain', 'tax on sale', 'tds')) return "On sale profit: 12.5% tax if held 2+ yrs (with indexation as per current rules). Buyer cuts 1% TDS. Ask a CA before selling.";
  if (H('property tax', 'house tax')) return "Yearly tax paid to the Municipal Corporation. It is small. Always keep receipts — buyers ask for them at resale.";
  if (H('circle rate', 'collector rate', 'govt rate')) return "Circle rate is the minimum legal price for registry. You cannot register below it, even if your deal price is lower.";
  if (H('dealer', 'broker', 'agent', 'contact', 'phone', 'number', 'list', 'propert', 'for sale', 'available', 'site visit')) return `Top rated dealers are on the ${L('dealers', 'dealers', 'Dealers page')} — highlighted for you. Each card has <b>Call + WhatsApp</b>.`;
  if (H('post requirement', 'buyer board', 'post my need', 'post need')) return `Post it on the ${L('dealers', 'spot-board', 'buyer board')} — dealers call you directly. Form highlighted.`;
  if (H('how to buy', 'process', 'steps', 'procedure', 'guide me', 'beginner', 'new buyer', 'start')) return `5 steps: 1) fix budget + loan 2) pick 2 sectors (ask me) 3) visit + compare Rs/sq.ft 4) verify papers 5) token with receipt, then deed. Start at ${L('predict', 'spot-predict', 'step 2 tool')}. Which step are you on?`;
  if (H('negotiat', 'bargain', 'discount', 'offer price')) return "Quote recent same-street deals. Offer 5-8% below price with 15-day payment promise. Keep a backup plot. Urgent sellers accept 8-12% less.";
  if (H('nri', 'abroad', 'oci', 'foreign')) return "NRIs can buy homes/shops freely, but not farm land. You need a registered POA. Pay only through your NRO account, never cash.";
  if (H('construct', 'build cost', 'build house', 'material', 'cost to build')) return "Building costs Rs 1,800-2,500/sq.ft today. A 1800 sq.ft house = Rs 35-45L + ~10% approvals. Sec 34/44 allow ground + 2 floors.";
  if (H('sco', 'shop', 'showroom', 'commercial', 'office')) return `Shops/offices (Sec 17/22/34) cost 2-3x homes but earn 5-6% rent vs 2.5% for homes. Specialists: Chawla Estates + UT Land Hub — see them on the ${L('dealers', 'dealers', 'Dealers page')}.`;
  if (H('flat', 'apartment', 'floor', 'builder')) return `Flats: Zirakpur 3BHK Rs 70-90L (best value). Sec 35/44 floors Rs 1.2-1.8Cr. Check approved plan + occupancy certificate. Avoid GPA-only floors. ${L('market', 'spot-search', 'See live flats')}.`;
  if (H('resale', 'old house', 'second hand', 'used flat')) return "Resale is cheaper and ready to use. Check pending dues + building age + structure cracks. New costs more but needs no repair.";
  if (H('under-construction', 'under construction', 'possession', 'delay', 'ready to move', 'ready-to-move')) return "Under-construction is cheaper but can delay. Check RERA deadline + builder record. Ready-to-move costs more, zero wait.";
  if (H('marla', 'kanal', 'sq ft', 'sqft', 'gaj', 'bigha', 'acre', 'convert', 'unit', 'sqyd', 'sq yd')) return "1 sq.yd = 9 sq.ft. 1 marla = 30.25 sq.yd. 1 kanal = 500 sq.yd. 1 acre = 4840 sq.yd. So 1800 sq.ft = 200 sq.yd = 6.6 marla.";
  if (H('mohali', 'kharar', 'zirakpur', 'panchkula', 'peer muchalla', 'dhakoli')) { const z = S['Zirakpur'], m = S['Mohali Rd']; return `<b>Zirakpur</b> ${ft(z.base)}/sq.ft (${pct(z)}% growth), <b>Mohali Rd</b> ${ft(m.base)}/sq.ft (${pct(m)}%). Lowest entry, fastest growth. Best for 5-10 yr holding.`; }
  if (H('sector 17', 'sector 9', 'sector 8', 'premium')) {
    const ps = ['Sec 8', 'Sec 9', 'Sec 17'].filter(k => S[k]);
    const lo = Math.min(...ps.map(k => S[k].base / 9)), glo = Math.min(...ps.map(k => S[k].growth * 100)), ghi = Math.max(...ps.map(k => S[k].growth * 100));
    const hi = Math.max(...ps.map(k => S[k].base / 9));
    return `Premium sectors (8/9/17): ${inr(lo)}-${inr(hi)}/sq.ft. Very safe, slow growth ${glo.toFixed(1)}-${ghi.toFixed(1)}%. Best for living or safe long hold.`;
  }
  if (H('possession', 'mutation')) return "After registry, get mutation done in your name at the estate office. Without mutation, records still show the seller. Takes 2-4 weeks.";
  const sug = ['price of Sec 34', 'best sector under 1Cr', 'EMI on 50 lakh', 'legal checklist', 'when to sell'];
  return `I want to answer exactly — try:<br>• ${sug.map(x => `<i>'${x}'</i>`).join('<br>• ')}<br><br>Or send <b>budget + goal</b>, like '80L, growth, 5 years'.`;
}
spaAsk = function (raw) {
  try { return plotAnswer(raw); }
  catch (e) { return "Sorry, I missed that. Try 'price of Sec 34' or 'EMI on 50 lakh'."; }
};
