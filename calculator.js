'use strict';
function calculateFund(target, saved, count) {
  function cents(value) {
    const text = String(value).trim();
    if (!/^\d+(\.\d{1,2})?$/.test(text)) throw new Error('Enter non-negative amounts with up to two decimal places.');
    const n = Math.round(Number(text) * 100);
    if (!Number.isSafeInteger(n) || n > 100000000) throw new Error('Use amounts up to $1,000,000.');
    return n;
  }
  const goal = cents(target), already = cents(saved);
  const n = Number(count);
  if (!Number.isInteger(n) || n < 1 || n > 1000) throw new Error('Enter 1 to 1,000 contributions.');
  const gap = Math.max(0, goal - already), regular = Math.ceil(gap / n);
  let remaining = gap;
  const schedule = Array.from({length:n}, () => { const amount = Math.min(regular, remaining); remaining -= amount; return amount; });
  return {gap, regular, schedule};
}
if (typeof document !== 'undefined') {
  const form = document.getElementById('fund-form');
  const output = document.getElementById('fund-result');
  const money = n => (n / 100).toLocaleString('en-US', {style:'currency', currency:'USD'});
  const update = () => {
    try {
      const r = calculateFund(form.elements.target.value, form.elements.saved.value, form.elements.contributions.value);
      output.replaceChildren();
      const headline = document.createElement('strong');
      headline.className = 'result-amount';
      headline.textContent = r.gap ? money(r.regular) + ' per contribution' : 'Your entered target is covered';
      const detail = document.createElement('p');
      const positive = r.schedule.filter(n => n > 0);
      detail.textContent = r.gap ? money(r.gap) + ' left to plan across ' + r.schedule.length + ' contributions. The final non-zero contribution is ' + money(positive.at(-1)) + (positive.length < r.schedule.length ? '; later contributions are $0.00.' : '.') : 'No additional contribution is needed for these figures.';
      output.append(headline, detail);
      const rows = document.getElementById('schedule-rows'); rows.replaceChildren();
      r.schedule.forEach((amount, i) => { const tr=document.createElement('tr'); for (const text of [String(i+1),money(amount)]) { const td=document.createElement('td'); td.textContent=text; tr.append(td); } rows.append(tr); });
      document.getElementById('schedule').hidden = false;
    } catch (e) {
      output.textContent=e.message;
      document.getElementById('schedule').hidden = true;
    }
  };
  form.addEventListener('submit', e => { e.preventDefault(); update(); });
  form.addEventListener('input', () => { output.textContent='Amounts changed. Select Calculate to update your plan.'; document.getElementById('schedule').hidden=true; });
  update();
}
