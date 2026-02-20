const TEAM = 32001;
const SEASON = 2025;

async function fetchJSON(url) {
    const res = await fetch(url);
    return res.json();
}

async function loadDashboard() {

    // ============================
    // TEAM INFO
    // ============================
    const team = await fetchJSON(`https://api.ftcscout.org/rest/v1/teams/${TEAM}`);

    document.getElementById("team-name").textContent = `${team.number} — ${team.name}`;
    document.getElementById("team-location").textContent =
        `${team.location.city}, ${team.location.state}, ${team.location.country}`;
    document.getElementById("team-school").textContent = `School: ${team.schoolName}`;
    document.getElementById("team-rookie").textContent = `Rookie Year: ${team.rookieYear}`;


    // ============================
    // EVENTS (CORRECT ENDPOINT)
    // ============================
    const events = await fetchJSON(
        `https://api.ftcscout.org/rest/v1/teams/${TEAM}/events?season=${SEASON}`
    );

    const eventsList = document.getElementById("events-list");
    eventsList.innerHTML = "";

    events.forEach(ev => {
        eventsList.innerHTML += `
            <div class="event-item">
                <strong>${ev.eventCode}</strong><br>
                Rank: ${ev.stats?.rank ?? "N/A"}  
            </div>
        `;
    });


    // ============================
    // POWER METRICS (OPR, DPR, HIGH SCORE)
    // ============================
    if (events.length > 0 && events[0].stats) {
        const stats = events[0].stats;

        // OPR
        const opr = stats.opr?.totalPoints ?? null;

        // DPR = totalPoints - totalPointsNp
        const dpr = (stats.opr?.totalPoints ?? 0) - (stats.opr?.totalPointsNp ?? 0);

        // High Score
        const high = stats.max?.totalPoints ?? null;

        document.getElementById("power-opr").textContent = opr ? opr.toFixed(2) : "--";
        document.getElementById("power-dpr").textContent = dpr ? dpr.toFixed(2) : "--";
        document.getElementById("power-high").textContent = high ?? "--";
    }


    // ============================
    // MATCHES
    // ============================
    const matches = await fetchJSON(
        `https://api.ftcscout.org/rest/v1/teams/${TEAM}/matches?season=${SEASON}`
    );

    const matchesList = document.getElementById("matches-list");
    matchesList.innerHTML = "";

    if (matches.length === 0) {
        matchesList.innerHTML = "No matches found.";
    } else {
        matches.forEach(m => {
            matchesList.innerHTML += `
                <div class="match-item">
                    <strong>${m.matchKey}</strong> — Score: ${m.score}
                </div>
            `;
        });
    }


    // ============================
    // AWARDS
    // ============================
    const awards = await fetchJSON(
        `https://api.ftcscout.org/rest/v1/teams/${TEAM}/awards?season=${SEASON}`
    );

    const awardsList = document.getElementById("awards-list");
    awardsList.innerHTML = "";

    if (awards.length === 0) {
        awardsList.innerHTML = "No awards yet.";
    } else {
        awards.forEach(a => {
            awardsList.innerHTML += `
                <div class="award-item">
                    <strong>${a.awardType}</strong> — ${a.eventCode}
                </div>
            `;
        });
    }
}

loadDashboard();
