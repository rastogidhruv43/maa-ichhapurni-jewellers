// Step 1 wala Cloudflare Worker URL yahan paste karein
const WORKER_URL = 'https://gold-api-proxy.rastogidhruv43.workers.dev';

async function fetchRates() {
    try {
        const res = await fetch(WORKER_URL);
        const data = await res.json();

        if (data.gold24k && data.silver999) {
            const timeStr = "Today at " + new Date(data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const gold24El = document.getElementById('gold24-rate');
            const gold22El = document.getElementById('gold22-rate');
            const gold18El = document.getElementById('gold18-rate');
            const silverEl = document.getElementById('silver-rate');
            const timeEl = document.getElementById('last-updated');

            if (gold24El) gold24El.innerText = `₹ ${data.gold24k.toLocaleString('en-IN')} / 10g`;
            if (gold22El) gold22El.innerText = `₹ ${data.gold22k.toLocaleString('en-IN')} / 10g`;
            if (gold18El) gold18El.innerText = `₹ ${data.gold18k.toLocaleString('en-IN')} / 10g`;
            if (silverEl) silverEl.innerText = `₹ ${data.silver999.toLocaleString('en-IN')} / 1kg`;
            if (timeEl) timeEl.innerText = `Rates Updated ${timeStr}`;
        }
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

document.addEventListener("DOMContentLoaded", fetchRates);
