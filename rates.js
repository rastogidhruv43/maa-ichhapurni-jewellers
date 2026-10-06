const WORKER_URL = 'https://gold-api-proxy.rastogidhruv43.workers.dev';

async function fetchRates() {
    try {
        const res = await fetch(WORKER_URL);
        const data = await res.json();

        if (data.gold24k && data.silver999) {
            const timeStr = "Today at " + new Date(data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Purane HTML Input boxes aur Naye Spans dono ki IDs target kar rahe hain
            const gold24El = document.getElementById('gold-rate') || document.getElementById('gold24-rate') || document.getElementById('gold-24k');
            const gold22El = document.getElementById('gold22-rate') || document.getElementById('gold-22k');
            const gold18El = document.getElementById('gold18-rate') || document.getElementById('gold-18k');
            const silverEl = document.getElementById('silver-rate') || document.getElementById('silver-999');
            
            const timeEl = document.getElementById('gold-time') || document.getElementById('rates-last-updated') || document.getElementById('last-updated');
            const silverTimeEl = document.getElementById('silver-time');

            // Values Update Logic (Input box ho ya normal Text element, dono handle honge)
            if (gold24El) {
                const val = `₹ ${data.gold24k.toLocaleString('en-IN')} / 10g`;
                if ('value' in gold24El) gold24El.value = val;
                else gold24El.innerText = val;
            }

            if (gold22El) {
                const val = `₹ ${data.gold22k.toLocaleString('en-IN')} / 10g`;
                if ('value' in gold22El) gold22El.value = val;
                else gold22El.innerText = val;
            }

            if (gold18El) {
                const val = `₹ ${data.gold18k.toLocaleString('en-IN')} / 10g`;
                if ('value' in gold18El) gold18El.value = val;
                else gold18El.innerText = val;
            }

            if (silverEl) {
                const val = `₹ ${data.silver999.toLocaleString('en-IN')} / 1kg`;
                if ('value' in silverEl) silverEl.value = val;
                else silverEl.innerText = val;
            }

            if (timeEl) {
                const text = `Rates Updated ${timeStr}`;
                if ('textContent' in timeEl) timeEl.textContent = text;
                else timeEl.innerText = text;
            }

            if (silverTimeEl) {
                silverTimeEl.textContent = `Rates Updated ${timeStr}`;
            }
        }
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

document.addEventListener("DOMContentLoaded", fetchRates);
fetchRates();
