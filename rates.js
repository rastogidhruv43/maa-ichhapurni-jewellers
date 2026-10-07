const WORKER_URL = 'https://gold-api-proxy.rastogidhruv43.workers.dev';
const REFRESH_MS = 30 * 60 * 1000;
const OLD_AFTER_MS = 25 * 60 * 60 * 1000;
const CACHE_KEY = 'ratesCache';
const FIELDS = ['gold24k', 'gold22k', 'gold18k', 'silver999'];

const fmt = n => '₹ ' + Math.round(n).toLocaleString('en-IN');

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function valid(d) {
  return d && Number.isFinite(new Date(d.updatedAt).getTime()) &&
    FIELDS.every(k => Number.isFinite(Number(d[k])));
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

  const old = Date.now() - new Date(d.updatedAt).getTime() > OLD_AFTER_MS;
  setText('rates-last-updated', old
    ? 'Last saved rates from ' + fmtTime(d.updatedAt) + '. May be outdated, please call to confirm.'
    : 'Last updated: ' + fmtTime(d.updatedAt) + '. Indicative rates, please call to confirm.');
}

function showCall() {
  ['gold-24k', 'gold-22k', 'gold-18k', 'silver-999'].forEach(id => setText(id, 'Call for rate'));
  setText('rates-last-updated', 'Rates not available right now. Please message 9839056606.');
}

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)); } catch (e) { return null; }
}

// Site khulte hi aakhri saved rate turant dikhao
const saved = loadSaved();
if (valid(saved)) render(saved);

async function fetchRates() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(WORKER_URL, { signal: ctrl.signal });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const d = await res.json();
    if (!valid(d)) throw new Error('Incomplete rate data');
    render(d);
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch (e) {}
  } catch (err) {
    console.error('Rates error:', err);
    if (!valid(loadSaved())) showCall();   // saved rate hai to wahi dikhta rahega
  } finally {
    clearTimeout(timer);
  }
}

fetchRates();
setInterval(fetchRates, REFRESH_MS);
