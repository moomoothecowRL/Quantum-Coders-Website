const TEAM = 32001;
const SEASON = 2025;

function safeGet(id) {
    const el = document.getElementById(id);
    if (!el) console.error(`❌ Missing DOM element: #${id}`);
    return el;
}

async function fetchJSON(url) {
    console.log("🔵 FETCH:", url);

    let res;
    try {
        res = await fetch(url);
    } catch (err) {
        console.error("❌ NETWORK ERROR:", err);
        return { error: "network" };
    }

    console.log("🟡 STATUS:", res.status, res.statusText);

    if (!res.ok) {
        console.warn("⚠️ Non-OK response, returning null");
        return { error: res.status };
    }

    try {
        const data = await res.json();
        console.log("🟢 JSON RESULT:", data);
        return data;
    } catch (err) {
        console.error("❌ JSON PARSE ERROR:", err);
        return { error: "json" };
    }
}

async function loadDashboard() {
    console.log("===== 🚀 DASHBOARD LOAD START =====");

    // -------------------------
    // TEAM INFO
    // -------------------------
    console.log("\n=== TEAM INFO ===");
    const team = await fetchJSON(`https://api.ftcscout.org/rest/v1/teams/${TEAM}`);

    if (team.error) {
        console.error("❌ TEAM FETCH FAILED:", team.error);
    } else {
        console.log("Team object:", team);

        safeGet("team-name").textContent = `${team.number} — ${team.name}`;
        safeGet("team-location").textContent =
            `${team.city}, ${team.state}, ${team.country}`;
        safeGet("team-school").textContent = `School: ${team.schoolName}`;
        safeGet("team-rookie").textContent = `Rookie Year: ${team.rookieYear}`;
    }

    // -------------------------
    // QUICK STATS
    // -------------------------
    console.log("\n=== QUICK STATS ===");
    const qs = await fetchJSON(
        `https://api.ftcscout.org/rest/v1/teams/${TEAM}/quick-stats?season=${SEASON}`
    );

    if (qs.error) {
        console.warn("⚠️ No quick stats available:", qs.error);
        safeGet("opr").textContent = "—";
        safeGet("dpr").textContent = "—";
        safeGet("ccwm").textContent = "—";
        safeGet("rank").textContent = "No data";
    } else {
        console.log("Quick stats object:", qs);
        safeGet("opr").textContent = qs.tot?.value?.toFixed(2) ?? "—";
        safeGet("dpr").textContent = qs.dc?.value?.toFixed(2) ?? "—";
        safeGet("ccwm").textContent = qs.eg?.value?.toFixed(2) ?? "—";
        safeGet("rank").textContent = qs.tot?.rank ?? "—";
    }

    // -------------------------
    // EVENTS (FIXED)
    // -------------------------
    console.log("\n=== EVENTS ===");
    const events = await fetchJSON(
        `https://api.ftcscout.org/rest/v1/teams/${TEAM}/events/${SEASON}`
    );

    console.log("Events raw:", events);

    const eventsList = safeGet("events-list");
    eventsList.innerHTML = "";

    if (!events || events.error || events.length === 0) {
        console.warn("⚠️ No events found");
        eventsList.innerHTML = "<div>No events found.</div>";
    } else {
        for (const ev of events) {
            console.log("Fetching event details for:", ev.eventCode);

            const eventDetails = await fetchJSON(
                `https://api.ftcscout.org/rest/v1/events/${SEASON}/${ev.eventCode}`
            );

            console.log("Event details:", eventDetails);

            const name = eventDetails?.name ?? "Unknown Event";
            const start = eventDetails?.startDate ?? "Unknown";
            const end = eventDetails?.endDate ?? "Unknown";

            eventsList.innerHTML += `
                <div class="event-item">
                    <strong>${name}</strong><br>
                    ${ev.eventCode} — ${start} → ${end}
                </div>
            `;
        }
    }

    // -------------------------
    // AWARDS
    // -------------------------
    console.log("\n=== AWARDS ===");
    const awards = await fetchJSON(
        `https://api.ftcscout.org/rest/v1/teams/${TEAM}/awards?season=${SEASON}`
    );

    console.log("Awards raw:", awards);

    const awardsList = safeGet("awards-list");
    awardsList.innerHTML = "";

    if (!awards || awards.error || awards.length === 0) {
        console.warn("⚠️ No awards found");
        awardsList.innerHTML = "No awards yet.";
    } else {
        awards.forEach(a => {
            console.log("Award item:", a);
            awardsList.innerHTML += `
                <div class="award-item">
                    <strong>${a.type}</strong> — ${a.eventCode}
                </div>
            `;
        });
    }

    console.log("===== ✅ DASHBOARD LOAD COMPLETE =====");
}

loadDashboard();
