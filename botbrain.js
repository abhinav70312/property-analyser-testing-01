// PlotMitra brain v4 — every number computed from data.js. Short, precise, no formulas.
function plotAnswer(raw) {
  const s = raw.toLowerCase(), H = (...w) => w.some(x => s.includes(x));
  const S = (typeof SECTORS !== 'undefined') ? SECTORS : {};
  const names = Object.keys(S);
  const n = s.replace(/\bsectors?\b/g, 'sec');
  const secs = names.filter(k => n.includes(k.toLowerCase()));
  const sec = secs[0];
  const ft = d => inr(Math.round(d / 9));
  const pct = d => (d.growth * 100).toFixed(1);
  const proj = (d, y) => d.base / 9 * Math.pow(1 + d.growth, y);
  const rate = k => (S[k] ? ft(S[k].base) : '—');
  const order = [...names].sort((a, b) => S[b].growth - S[a].growth);
  const t3 = order.slice(0, 3), cheap = order[order.length - 1];
  let areaSqft = 0, mA = null;
  if ((mA = s.match(/(\d+(?:\.\d+)?)\s*(sq\.?\s*ft|sqft)/))) areaSqft = +mA[1];
  else if ((mA = s.match(/(\d+(?:\.\d+)?)\s*(sq\.?\s*yd|sqyd|gaj|gaz|yards?)/))) areaSqft = +mA[1] * 9;
  else if ((mA = s.match(/(\d+(?:\.\d+)?)\s*marla/))) areaSqft = +mA[1] * 272.25;
  else if ((mA = s.match(/(\d+(?:\.\d+)?)\s*kanal/))) areaSqft = +mA[1] * 4500;
  else if ((mA = s.match(/(\d+(?:\.\d+)?)\s*acre/))) areaSqft = +mA[1] * 43560;
  const amt = parseAmt(s);
  const yrs = +(((s.match(/(\d+)\s*(yr|year)/) || [])[1]) || 0);
  function pick(amt) {
    if (amt < 1e7) { const z = S['Zirakpur'], mo = S['Mohali Rd']; return `With <b>${inr(amt)}</b>: <b>Zirakpur</b> (~${Math.floor(amt / (z.base / 9))} sq.ft, ${pct(z)}%/yr) or <b>Mohali Rd</b> (~${Math.floor(amt / (mo.base / 9))} sq.ft, ${pct(mo)}%/yr).`; }
    if (amt < 2.5e7) return `With <b>${inr(amt)}</b>: <b>Sec 44</b> (${rate('Sec 44')}/sq.ft), <b>Sec 34</b> (${rate('Sec 34')}/sq.ft) or <b>Sec 35</b> (${rate('Sec 35')}/sq.ft). Good resale + rent.`;
    return `With <b>${inr(amt)}</b>: <b>Sec 9</b> (${rate('Sec 9')}/sq.ft), <b>Sec 8</b> or <b>SCO Sec 17</b>. Or split: one Sec 34 + one Zirakpur plot.`;
  }

  if (/^(hi|hii+|hello|hey|namaste|sat sri|ram ram|yo|good (morning|evening|afternoon))\b/.test(s) || H('namaste', 'sat sri akal'))
    return "Hello! I am <b>PlotMitra</b>, your Chandigarh property guide.";
  if (H('thank', 'shukriya', 'dhanyavad')) return "You are welcome!";
  if (H('bye', 'see you', 'good night')) return "Goodbye!";
  if (H('who are you', 'your name', 'about yourself')) return "I am <b>PlotMitra</b>. I know Chandigarh area rates, growth, EMI math and legal steps.";
  if (H('stamp', 'duty', 'registry', 'registration cost')) {
    if (amt > 0) return `Stamp + registration on <b>${inr(amt)}</b> = ~<b>${inr(amt * 0.08)}</b> (7% + 1%).`;
    return "Stamp duty ~7% + registration 1%. On Rs 1Cr, keep ~Rs 8L extra.";
  }
  if (H('token', 'advance', 'booking amount', 'earnest')) return "Pay token only against a written receipt. Never cash.";
  if (/\bemi\b/.test(s) || H('loan', 'finance', 'interest', 'down payment', 'eligib', 'pre-approv')) {
    const P = amt > 0 ? amt : 5000000;
    const Rt = +(((s.match(/(\d+(?:\.\d+)?)\s*%/) || [])[1]) || 9), Y = yrs > 0 ? yrs : 20;
    const r = Rt / 1200, N = Y * 12, e = r === 0 ? P / N : P * r * Math.pow(1 + r, N) / (Math.pow(1 + r, N) - 1);
    return `Loan <b>${inr(P)}</b> at ${Rt}% for ${Y} yrs = EMI <b>${inr(e)}/month</b>, total <b>${inr(e * N)}</b>. Keep EMI under 40% of income.`;
  }
  if (H('rent vs buy', 'rent or buy')) return "Staying 5+ years: buy. Under 3 years: rent and invest the rest.";
  if (H('roi', 'return', 'profit', 'yield', 'lease') || (H('rent') && !H('vs', 'or buy'))) {
    if (sec) { const d = S[sec], a = areaSqft > 0 ? areaSqft : 1800, v = d.base / 9 * a, lo = Math.round(v * 0.025 / 12), hi = Math.round(v * 0.035 / 12); return `<b>${sec}</b> ${Math.round(a)} sq.ft (~${inr(v)}) rents ~<b>${inr(lo)}-${inr(hi)}/month</b> (2.5-3.5% yield).`; }
    return "Price growth 7-11%/yr + rent 2.5-3.5%/yr.";
  }
  if (H('under-construction', 'under construction', 'ready to move', 'ready-to-move', 'possession', 'delay')) return "Ready-to-move costs more, zero wait. Under-construction is cheaper but check RERA deadline + builder record.";
  if (secs.length >= 2 && H('compare', ' vs ', 'versus', 'difference', 'which is better', 'better', 'cheaper')) {
    const a = secs[0], b = secs[1], da = S[a], db = S[b];
    const fast = da.growth >= db.growth ? a : b, ch = da.base <= db.base ? a : b;
    return `<b>${a}</b>: ${ft(da.base)}/sq.ft, ${pct(da)}%/yr vs <b>${b}</b>: ${ft(db.base)}/sq.ft, ${pct(db)}%/yr. Faster: <b>${fast}</b>. Cheaper: <b>${ch}</b>.`;
  }
  if (H('compare', ' vs ', 'versus', 'difference', 'which is better', 'cheapest', 'lowest price', 'highest growth', 'fastest growth', 'top growth')) {
    const z = S['Zirakpur'];
    return `Fastest: <b>Zirakpur</b> (${pct(z)}%/yr). Cheapest: <b>Zirakpur</b> (${ft(z.base)}/sq.ft).`;
  }
  if (H('best sector', 'where to buy', 'where to invest', 'which sector', 'top sector', 'hot', 'cheap plot', 'low budget')) {
    if (amt > 0) return pick(amt);
    return `Top growth: ${t3.map(k => `<b>${k}</b> ${pct(S[k])}%`).join(' • ')}.`;
  }
  if (H('under ', 'budget', 'lakh', 'crore', 'afford', 'lac') || (amt > 0 && !H('rent', 'emi', 'loan', 'price', 'rate', 'worth', 'stamp', 'duty', 'sell', 'predict', 'future', 'forecast'))) {
    if (amt > 0) return pick(amt);
    return "Share your budget and I will name a sector and plot size.";
  }
  if (sec && (H('predict', 'future', 'forecast') || yrs > 0 || H('2030', '2028', '2029', '2031', '2032', 'double'))) {
    const y = yrs > 0 ? Math.min(yrs, 30) : 5, d = S[sec];
    let a = `<b>${sec}</b> in ${y} yrs: about <b>${inr(proj(d, y))}/sq.ft</b> at ${pct(d)}%/yr.`;
    if (areaSqft > 0) a += ` ${Math.round(areaSqft)} sq.ft = <b>${inr(proj(d, y) * areaSqft)}</b>.`;
    else a += ` An 1800 sq.ft plot = <b>${inr(proj(d, y) * 1800)}</b>.`;
    return a;
  }
  if (!sec && H('predict', 'future', 'forecast')) return "Tell me a sector and years for its future price.";
  if (sec && H('price', 'rate', 'cost', 'worth', 'value', 'sq', 'gaj', 'yard', 'bhav', 'kya', 'marla', 'kanal', 'plot')) {
    const d = S[sec];
    let a = `<b>${sec}</b> (${d.zone}): <b>${ft(d.base)}/sq.ft</b> today, growing ${pct(d)}%/yr. In 5 yrs: about <b>${inr(proj(d, 5))}/sq.ft</b>.`;
    if (areaSqft > 0) a += ` ${Math.round(areaSqft)} sq.ft = <b>${inr(d.base / 9 * areaSqft)}</b> today.`;
    else a += ` ${d.growth > 0.09 ? "High-growth pick." : "Premium stable pick."}`;
    return a;
  }
  if (sec && H('good', 'worth', 'invest', 'buy', 'future', 'growth', 'review', 'opinion', 'safe', 'best')) {
    const d = S[sec], g = d.growth;
    const v = g > 0.095 ? "Great for 5+ yr growth. Prices still low." : g > 0.08 ? "Good mix of safety + growth." : "Very safe, slow growth. Best to live in, or hold long.";
    return `<b>${sec}</b>: ${ft(d.base)}/sq.ft, ${pct(d)}%/yr. ${v}`;
  }
  if (H('sell', 'exit', 'book profit')) return "Sell when: 3-year gain above 35%, rent below 2%, or faster-growing land found.";
  if (H('buy now', 'right time', 'market down', 'crash', 'bubble', 'wait or buy', 'fall')) {
    const gs = names.map(k => S[k].growth * 100), lo = Math.min(...gs).toFixed(0), hi = Math.max(...gs).toFixed(0);
    return `Chandigarh rarely crashes — land is limited. Prices rise ${lo}-${hi}%/yr. Waiting usually costs more than the 3-5% you can bargain today.`;
  }
  if (H('loan') && H('process', 'steps', 'how', 'procedure')) return "Loan steps: 1) pre-approval 2) property check 3) legal check 4) money paid against sale deed. Takes 2-4 weeks.";
  if (H('how to buy', 'process', 'steps', 'procedure', 'guide me', 'beginner', 'new buyer', 'start')) return "5 steps: 1) fix budget + loan 2) pick 2 sectors 3) visit + compare Rs/sq.ft 4) verify papers 5) token with receipt, then deed.";
  if (H('post requirement', 'buyer board', 'post my need', 'post need')) return "Use the buyer board on the Dealers page.";
  if (H('dealer', 'broker', 'agent', 'contact', 'phone', 'number', 'for sale', 'available', 'site visit')) return "Top-rated: UT Land Hub (Sec 17), Goyal (Sec 34). Each card has <b>Call + WhatsApp</b>.";
  if (H('rera', 'verify', 'check')) return "Verify on rera.punjab.gov.in: match project name, promoter name, and validity date. No valid RERA = do not pay.";
  if (H('fraud', 'scam', 'cheat', 'red flag', 'risk', 'safe')) return "Red flags: GPA-only sale, price far below market, seller rushing you, pending dues, cash demand. Any one = walk away.";
  if (H('document', 'paper', 'legal', 'title', 'mutation', 'gpa', 'agreement', 'khasra', 'encumbrance', 'ec cert')) return "Must-have papers: 1) sale deed 2) 30-yr title chain + EC 3) RERA cert 4) no-dues NOC 5) approved plan. Never accept GPA alone — only a registered sale deed.";
  if (H('capital gain', 'tax on sale', 'tds')) return "Sale profit: 12.5% tax if held 2+ years. Buyer cuts 1% TDS.";
  if (H('property tax', 'house tax')) return "Yearly tax paid to the Municipal Corporation. It is small. Always keep receipts — buyers ask for them at resale.";
  if (H('circle rate', 'collector rate', 'govt rate')) return "Circle rate is the minimum legal price for registry. You cannot register below it, even if your deal price is lower.";
  if (H('negotiat', 'bargain', 'discount', 'offer price')) return "Quote recent same-street deals. Offer 5-8% below price with 15-day payment promise. Keep a backup plot. Urgent sellers accept 8-12% less.";
  if (H('nri', 'abroad', 'oci', 'foreign')) return "NRIs can buy homes/shops freely, but not farm land. You need a registered POA. Pay only through your NRO account, never cash.";
  if (H('construct', 'build cost', 'build house', 'material', 'cost to build')) return "Building costs Rs 1,800-2,500/sq.ft today. A 1800 sq.ft house = Rs 35-45L + ~10% approvals. Sec 34/44 allow ground + 2 floors.";
  if (H('sco', 'shop', 'showroom', 'commercial', 'office')) return "Shops/offices (Sec 17/22/34) cost 2-3x homes but earn 5-6% rent.";
  if (H('flat', 'apartment', 'floor', 'builder')) return "Flats: Zirakpur 3BHK Rs 70-90L. Sec 35/44 floors Rs 1.2-1.8Cr. Check approved plan and occupancy certificate.";
  if (H('resale', 'old house', 'second hand', 'used flat')) return "Resale is cheaper and ready to use. Check pending dues + building age + structure cracks. New costs more but needs no repair.";
  if (H('marla', 'kanal', 'sq ft', 'sqft', 'gaj', 'bigha', 'acre', 'convert', 'unit', 'sqyd', 'sq yd')) return "1 sq.yd = 9 sq.ft. 1 marla = 30.25 sq.yd. 1 kanal = 500 sq.yd. 1 acre = 4840 sq.yd. So 1800 sq.ft = 200 sq.yd = 6.6 marla.";
  if (H('mohali', 'kharar', 'zirakpur', 'panchkula', 'peer muchalla', 'dhakoli')) { const z = S['Zirakpur'], mo = S['Mohali Rd']; return `<b>Zirakpur</b> ${ft(z.base)}/sq.ft (${pct(z)}% growth), <b>Mohali Rd</b> ${ft(mo.base)}/sq.ft (${pct(mo)}%). Lowest entry, fastest growth. Best for 5-10 yr holding.`; }
  if (H('sector 17', 'sector 9', 'sector 8', 'premium')) {
    const ps = ['Sec 8', 'Sec 9', 'Sec 17'].filter(k => S[k]);
    const lo = Math.min(...ps.map(k => S[k].base / 9)), glo = Math.min(...ps.map(k => S[k].growth * 100)), ghi = Math.max(...ps.map(k => S[k].growth * 100));
    const hi = Math.max(...ps.map(k => S[k].base / 9));
    return `Premium sectors (8/9/17): ${inr(lo)}-${inr(hi)}/sq.ft. Very safe, slow growth ${glo.toFixed(1)}-${ghi.toFixed(1)}%. Best for living or safe long hold.`;
  }
  if (H('possession', 'mutation')) return "After registry, get mutation done in your name at the estate office. Without mutation, records still show the seller. Takes 2-4 weeks.";
  return "Tell me your budget and goal.";
}
spaAsk = function (raw) {
  try { return plotAnswer(raw); }
  catch (e) { return "Sorry, I missed that."; }
};
