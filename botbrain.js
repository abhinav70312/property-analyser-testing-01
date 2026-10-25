// PlotMitra brain v2 — short, simple, accurate answers. Overrides spaAsk(). Loaded after widget.js.
function plotAnswer(raw) {
  const s = raw.toLowerCase(), H = (...w) => w.some(x => s.includes(x));
  const S = (typeof SECTORS !== 'undefined') ? SECTORS : {};
  const names = Object.keys(S);
  const sec = names.find(k => s.includes(k.toLowerCase()));
  const ft = d => inr(Math.round(d / 9));
  const pct = d => (d.growth * 100).toFixed(1);
  const proj = (d, y) => d.base / 9 * Math.pow(1 + d.growth, y);

  // greetings
  if (/^(hi|hii+|hello|hey|namaste|sat sri|ram ram|yo|good (morning|evening|afternoon))\b/.test(s) || H('namaste', 'sat sri akal'))
    return "Hello! I am <b>PlotMitra</b>, your Chandigarh land guide. Ask a sector price, budget advice, EMI, or legal steps.";
  if (H('thank', 'shukriya', 'dhanyavad')) return "You are welcome! Try the <b>Predict</b> page for a forecast, or ask 'best sector under 1Cr'.";
  if (H('bye', 'see you', 'good night')) return "Goodbye! I am here 24x7 on the PlotMitra button.";
  if (H('who are you', 'your name', 'about yourself')) return "I am <b>PlotMitra</b>. I know all 10 area rates, growth, EMI math, and legal steps for Chandigarh.";
  // compare (rent-vs-buy handled earlier — it also contains 'vs')
  if (H('rent vs buy', 'rent or buy')) return "Staying 5+ yrs? Buy — growth beats rent. Under 3 yrs? Rent a 2-3BHK (Rs 25-40K) and invest the rest.";
  if (H('compare', ' vs ', 'versus', 'difference', 'which is better'))
    return "Fastest growth: <b>Zirakpur</b> 11.2%, <b>Mohali Rd</b> 10.4%, <b>Sec 44</b> 9.3%. Safest: Sec 8, 9, 17. Tell me budget + years and I will pick one.";
  // loan process before generic loan math
  if (H('loan') && H('process', 'steps', 'how', 'procedure'))
    return "Loan steps: 1) pre-approval 2) property check 3) legal check 4) money paid against sale deed. Takes 2-4 weeks.";
  // EMI / loan math with live numbers
  if (H('emi', 'loan', 'finance', 'interest', 'down payment', 'eligib', 'pre-approv')) {
    const P = parseAmt(s) || 5000000;
    const Rt = (s.match(/(\d+(?:\.\d+)?)\s*%/) || [])[1] || 9, Y = (s.match(/(\d+)\s*(yr|year)/) || [])[1] || 20;
    const r = Rt / 1200, N = Y * 12, e = P * r * Math.pow(1 + r, N) / (Math.pow(1 + r, N) - 1);
    return `Loan <b>${inr(P)}</b> at ${Rt}% for ${Y} yrs = EMI <b>${inr(e)}/month</b>. Banks fund ~80%. Keep EMI below 40% of income (earn ~${inr(e * 2.5)}/month).`;
  }
  // forecast
  if (H('predict', 'future', 'forecast', '2030', '2028', '2029', '2031', '2032', 'double', '5 year', '10 year')) {
    const y = +((s.match(/(\d+)\s*(yr|year)/) || [])[1] || 5);
    if (sec) { const d = S[sec]; return `<b>${sec}</b> in ${y} yrs: about <b>${inr(proj(d, y))}/sq.ft</b> at ${pct(d)}%/yr. An 1800 sq.ft plot = <b>${inr(proj(d, y) * 1800)}</b>.`; }
    return `Rule: future price = today x (1 + growth)^years. Example: Sec 34 at 8.9% for 5 yrs = <b>${ft(132000 * Math.pow(1.089, 5))}/sq.ft</b>. Name a sector + years.`;
  }
  // sector price
  if (sec && H('price', 'rate', 'cost', 'worth', 'value', 'sq', 'gaj', 'yard', 'bhav', 'kya')) {
    const d = S[sec];
    return `<b>${sec}</b> (${d.zone}): <b>${ft(d.base)}/sq.ft</b> today, growing ${pct(d)}%/yr. In 5 yrs: about <b>${inr(proj(d, 5))}/sq.ft</b>.`;
  }
  // sector review
  if (sec && H('good', 'worth', 'invest', 'buy', 'future', 'growth', 'review', 'opinion', 'safe', 'best')) {
    const d = S[sec], g = d.growth;
    const v = g > 0.095 ? "Great for 5+ yr growth. Prices still low." : g > 0.08 ? "Good mix of safety + growth." : "Very safe, slow growth. Best to live in, or hold long.";
    return `<b>${sec}</b>: ${ft(d.base)}/sq.ft, ${pct(d)}%/yr. ${v} Rent income ~2.5-3.5%/yr.`;
  }
  // budget
  if (H('under ', 'budget', 'lakh', 'crore', 'afford', 'lac') || /\b\d+\s*(l|cr)\b/.test(s)) {
    const amt = parseAmt(s);
    if (amt && amt < 1e7) return `With <b>${inr(amt)}</b>: buy <b>Zirakpur</b> (~${Math.floor(amt / 6444)} sq.ft) or <b>Mohali Rd</b> (~${Math.floor(amt / 8000)} sq.ft). Both grow 10%+/yr.`;
    if (amt && amt < 2.5e7) return `With <b>${inr(amt)}</b>: best balance is <b>Sec 44</b>, <b>Sec 34</b> or <b>Sec 35</b>. Good resale + rent.`;
    if (amt && amt >= 2.5e7) return `With <b>${inr(amt)}</b>: go premium — <b>Sec 9, Sec 8, or SCO Sec 17</b>. Or split: one Sec 34 plot + one Zirakpur plot.`;
    return "Tell me your budget, like 'under 80 lakh' or '1.5Cr for 5 years'.";
  }
  if (H('best sector', 'where to buy', 'where to invest', 'which sector', 'top sector', 'hot', 'cheap plot', 'low budget'))
    return "Top picks: <b>Zirakpur</b> (11.2%), <b>Mohali Rd</b> (10.4%), <b>Sec 44</b> (9.3%). Tell me budget + years for one exact pick.";
  // sell / buy timing
  if (H('sell', 'exit', 'book profit')) return "Sell when: 1) 3-yr gain above 35%, or 2) rent below 2%, or 3) you found faster-growing land. Sec 34/44 owners since 2021 are up ~45% — a good time to sell part.";
  if (H('buy now', 'right time', 'market down', 'crash', 'bubble', 'wait or buy', 'fall')) return "Chandigarh rarely crashes — land is limited. Prices rise 7-11%/yr. Waiting usually costs more than the 3-5% you can bargain today.";
  // money: roi, stamp, token
  if (H('roi', 'return', 'profit', 'rental', 'yield', 'lease') || (H('rent') && !H('vs', 'or buy'))) return "Chandigarh earns two ways: price rise 7-11%/yr + rent 2.5-3.5%/yr. A Rs 2Cr flat rents ~Rs 40-55K/month. Full math on the <b>Calculators</b> page.";
  if (H('stamp', 'duty', 'registry', 'registration cost')) return "Extra cost in Chandigarh/Punjab: stamp duty ~7% + registration 1%. On Rs 1Cr, keep ~Rs 8L extra. Agent fee 1-2% more.";
  if (H('token', 'advance', 'booking amount', 'earnest')) return "Pay token ONLY against a written receipt with property ID, amount, and refund terms. Never pay cash. Keep it small (Rs 50K-1L) until papers are verified.";
  // legal
  if (H('rera', 'verify', 'check')) return "Verify on rera.punjab.gov.in: match project name, promoter name, and validity date. No valid RERA = do not pay.";
  if (H('fraud', 'scam', 'cheat', 'red flag', 'risk', 'safe')) return "Red flags: GPA-only sale, price far below market, seller rushing you, pending dues, cash demand. Any one = walk away.";
  if (H('document', 'paper', 'legal', 'title', 'mutation', 'gpa', 'agreement', 'khasra', 'encumbrance', 'ec cert')) return "Must-have papers: 1) sale deed 2) 30-yr title chain + EC 3) RERA cert 4) no-dues NOC 5) approved plan. Never accept GPA alone — only a registered sale deed.";
  if (H('capital gain', 'tax on sale', 'tds')) return "On sale profit: 12.5% tax if held 2+ yrs (with indexation as per current rules). Buyer cuts 1% TDS. Ask a CA before selling.";
  if (H('property tax', 'house tax')) return "Yearly tax paid to the Municipal Corporation. It is small. Always keep receipts — buyers ask for them at resale.";
  if (H('circle rate', 'collector rate', 'govt rate')) return "Circle rate is the minimum legal price for registry. You cannot register below it, even if your deal price is lower.";
  // people
  if (H('dealer', 'broker', 'agent', 'contact', 'phone', 'number', 'list', 'propert', 'for sale', 'available', 'site visit')) return "Top rated on the <b>Dealers</b> page: UT Land Hub 4.9 (Sec 17), Goyal 4.8 (Sec 34), Chawla 4.6 (SCO). Each card has <b>Call + WhatsApp</b>.";
  if (H('how to buy', 'process', 'steps', 'procedure', 'guide me', 'beginner', 'new buyer', 'start')) return "5 steps: 1) fix budget + loan 2) pick 2 sectors (ask me) 3) visit + compare Rs/sq.ft 4) verify papers 5) token with receipt, then deed. Which step are you on?";
  if (H('negotiat', 'bargain', 'discount', 'offer price')) return "Quote recent same-street deals. Offer 5-8% below price with 15-day payment promise. Keep a backup plot. Urgent sellers accept 8-12% less.";
  if (H('nri', 'abroad', 'oci', 'foreign')) return "NRIs can buy homes/shops freely, but not farm land. You need a registered POA. Pay only through your NRO account, never cash.";
  // build / type
  if (H('construct', 'build cost', 'build house', 'material', 'cost to build')) return "Building costs Rs 1,800-2,500/sq.ft today. A 1800 sq.ft house = Rs 35-45L + ~10% approvals. Sec 34/44 allow ground + 2 floors.";
  if (H('sco', 'shop', 'showroom', 'commercial', 'office')) return "Shops/offices (Sec 17/22/34) cost 2-3x homes but earn 5-6% rent vs 2.5% for homes. Specialists: Chawla Estates + UT Land Hub.";
  if (H('flat', 'apartment', 'floor', 'builder')) return "Flats: Zirakpur 3BHK Rs 70-90L (best value). Sec 35/44 floors Rs 1.2-1.8Cr. Check approved plan + occupancy certificate. Avoid GPA-only floors.";
  if (H('resale', 'old house', 'second hand', 'used flat')) return "Resale is cheaper and ready to use. Check pending dues + building age + structure cracks. New costs more but needs no repair.";
  if (H('under-construction', 'under construction', 'possession', 'delay', 'ready to move', 'ready-to-move')) return "Under-construction is cheaper but can delay. Check RERA deadline + builder record. Ready-to-move costs more, zero wait.";
  // units
  if (H('marla', 'kanal', 'sq ft', 'sqft', 'gaj', 'bigha', 'acre', 'convert', 'unit', 'sqyd', 'sq yd')) return "1 sq.yd = 9 sq.ft. 1 marla = 30.25 sq.yd. 1 kanal = 500 sq.yd. 1 acre = 4840 sq.yd. So 1800 sq.ft = 200 sq.yd = 6.6 marla.";
  // areas
  if (H('mohali', 'kharar', 'zirakpur', 'panchkula', 'peer muchalla', 'dhakoli')) return "<b>Zirakpur</b> ~Rs 6,444/sq.ft (11.2% growth), <b>Mohali Rd</b> ~Rs 8,000/sq.ft (10.4%). Lowest entry, fastest growth. Best for 5-10 yr holding.";
  if (H('sector 17', 'sector 9', 'sector 8', 'premium')) return "Premium sectors (8/9/17): Rs 20,000-27,000/sq.ft. Very safe, slow growth 6-8%. Best for living or safe long hold, not quick profit.";
  if (H('possession', 'mutation')) return "After registry, get mutation done in your name at the estate office. Without mutation, records still show the seller. Takes 2-4 weeks.";
  const sug = ['price of Sec 34', 'best sector under 1Cr', 'EMI on 50 lakh', 'legal checklist', 'when to sell'];
  return `I want to answer exactly — try:<br>• ${sug.map(x => `<i>'${x}'</i>`).join('<br>• ')}<br><br>Or send <b>budget + goal</b>, like '80L, growth, 5 years'.`;
}
spaAsk = function (raw) {
  try { return plotAnswer(raw); }
  catch (e) { return "Sorry, I missed that. Try 'price of Sec 34' or 'EMI on 50 lakh'."; }
};
