const WORKER_URL = 'https://gold-api-proxy.rastogidhruv43.workers.dev';
const REFRESH_MS = 30 * 60 * 1000;
const MAX_AGE_MS = 25 * 60 * 60 * 1000;

const fmt = n => '₹ ' + Math.round(n).toLocaleString('en-IN');

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function fresh(d) {
  const t = new Date(d && d.updatedAt).getTime();
  return Number.isFinite(t) && (Date.now() - t) < MAX_AGE_MS &&
    ['gold24k', 'gold22k', 'gold18k', 'silver999'].every(k => Number.isFinite(Number(d[k])));
}

function fmtTime(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
  });
}

function render(d) {
  setText('gold-24k', fmt(d.gold24k) + ' / 10g');
  setText('gold-22k', fmt(d.gold22k) + ' / 10g');
  setText('gold-18k', fmt(d.gold18k) + ' / 10g');
  setText('silver-999', fmt(d.silver999) + ' / 1kg');
  setText('rates-last-updated', 'Last updated: ' + fmtTime(d.updatedAt) + '. Indicative rates, please call to confirm.');
}

function showCall() {
  ['gold-24k', 'gold-22k', 'gold-18k', 'silver-999'].forEach(id => setText(id, 'Call for rate'));
  setText('rates-last-updated', "Today's rates are not updated yet. Please call 9415107000.");
}

async function fetchRates() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(WORKER_URL, { signal: ctrl.signal });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const d = await res.json();
    if (fresh(d)) render(d); else showCall();
  } catch (err) {
    console.error('Rates error:', err);
    showCall();
  } finally {
    clearTimeout(timer);
  }
}

fetchRates();
setInterval(fetchRates, REFRESH_MS);
