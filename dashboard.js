const TEAM = 32001;
const SEASON = 2025;

async function fetchJSON(url) {
    const res = await fetch(url);
    return res.json();
}

async function loadDashboard() {

    // TEAM INFO
    const team = await fetchJSON(`https://api.ftcscout.org/rest/v1/teams/${TEAM}`);
    document.getElementById("team-name").textContent = `${team.number} — ${team.name}`;
    document.getElementById("team-location").textContent = `${team.location.city}, ${team.location.state}, ${team.location.country}`;
    document.getElementById("team-school").textContent = `School: ${team.schoolName}`;
    document.getElementById("team-rookie").textContent = `Rookie Year: ${team.rookieYear}`;

    // QUICK STATS
    const qs = await fetchJSON(`https://api.ftcscout.org/rest/v1/teams/${TEAM}/quick-stats?season=${SEASON}`);
    document.getElementById("opr").textContent = qs.opr.toFixed(2);
    document.getElementById("dpr").textContent = qs.dpr.toFixed(2);
    document.getElementById("ccwm").textContent = qs.ccwm.toFixed(2);
    document.getElementById("rank").textContent = qs.rank;

    // EVENTS
    const events = await fetchJSON(`https://api.ftcscout.org/rest/v1/teams/${TEAM}/events/${SEASON}`);
    const eventsList = document.getElementById("events-list");
    eventsList.innerHTML = "";
    events.forEach(ev => {
        eventsList.innerHTML += `
            <div class="event-item">
                <strong>${ev.eventName}</strong><br>
                ${ev.eventCode} — ${ev.startDate} → ${ev.endDate}
            </div>
        `;
    });

    // MATCHES
    const matches = await fetchJSON(`https://api.ftcscout.org/rest/v1/teams/${TEAM}/matches?season=${SEASON}`);
    const matchesList = document.getElementById("matches-list");
    matchesList.innerHTML = "";
    matches.forEach(m => {
        matchesList.innerHTML += `
            <div class="match-item">
                <strong>${m.matchKey}</strong> — Score: ${m.score}
            </div>
        `;
    });

    // AWARDS
    const awards = await fetchJSON(`https://api.ftcscout.org/rest/v1/teams/${TEAM}/awards?season=${SEASON}`);
    const awardsList = document.getElementById("awards-list");
    awardsList.innerHTML = awards.length === 0 ? "No awards yet." : "";
    awards.forEach(a => {
        awardsList.innerHTML += `
            <div class="award-item">
                <strong>${a.awardType}</strong> — ${a.eventCode}
            </div>
        `;
    });
}

loadDashboard();
