let timerInterval;
let seconds = 0;
let minutes = 0;
let maxMinutes = 90;
let isRunning = false;

const teamA = { name: "Team A", score: 0, players: [], goalScorers: [], redCardPlayers: [] };
const teamB = { name: "Team B", score: 0, players: [], goalScorers: [], redCardPlayers: [] };

function updateTimerDisplay() {
    const timer = document.getElementById("timer");
    if (timer) {
        timer.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                seconds = 0;
                minutes++;
            }
            if (minutes >= maxMinutes) {
                clearInterval(timerInterval);
                alert("The match has ended!");
            }
            updateTimerDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    seconds = 0;
    minutes = 0;
    updateTimerDisplay();
}

function toggleDetails(id) {
    let details = document.getElementById(id);
    if (details) {
        details.style.display = details.style.display === "block" ? "none" : "block";
    }
}

function updateStat(teamId, playerIndex, stat) {
    let team = teamId === "teamA-players" ? teamA : teamB;
    let player = team.players[playerIndex - 1];
    if (!player) return;

    if (player.redCards > 0) {
        alert(`${player.name} is sent off and cannot receive any more cards!`);
        return;
    }

    if (stat === "yellowCards") {
        player.yellowCards++;
        document.getElementById(`${teamId}-player${playerIndex}-yellow`).textContent = player.yellowCards;

        if (player.yellowCards === 2) {
            player.redCards++;
            document.getElementById(`${teamId}-player${playerIndex}-red`).textContent = player.redCards;
            team.redCardPlayers.push(`${player.name} 🟥 sent off at ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
            updateRedCardPlayers(team);
        }
    }

    if (stat === "redCards") {
        player.redCards++;
        document.getElementById(`${teamId}-player${playerIndex}-red`).textContent = player.redCards;
        team.redCardPlayers.push(`${player.name} 🟥 sent off at ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        updateRedCardPlayers(team);
    }

    if (stat === "goals") {
        player.goals++;
        team.score++;
        document.getElementById(`${teamId === "teamA-players" ? "teamA-score" : "teamB-score"}`).textContent = team.score;

        let currentTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        team.goalScorers.push(`${player.name} ⚽ at ${currentTime}`);
        updateGoalScorers(team);
    }

    if (stat === "assists") {
        player.assists++;
        document.getElementById(`${teamId}-player${playerIndex}-assists`).textContent = player.assists;
    }
}

function updateGoalScorers(team) {
    let container = document.getElementById(`${team === teamA ? "teamA" : "teamB"}-goalscorers`);
    if (container) {
        container.innerHTML = "";
        team.goalScorers.forEach(goal => {
            let goalDiv = document.createElement("div");
            goalDiv.classList.add("goal-scorer");
            goalDiv.innerHTML = `
                <span class="goal-scorer-name">${goal.split(" at")[0]}</span>
                <span class="goal-scorer-at"> at </span>
                <span class="goal-time">${goal.split("at ")[1]}</span>
            `;
            container.appendChild(goalDiv);
        });
    }
}

function updateRedCardPlayers(team) {
    let container = document.getElementById(`${team === teamA ? "teamA" : "teamB"}-redcards`);
    if (container) {
        container.innerHTML = "";
        team.redCardPlayers.forEach(player => {
            let redCardDiv = document.createElement("div");
            redCardDiv.classList.add("red-card-player");
            redCardDiv.innerHTML = `<span class="red-card-name">${player}</span>`;
            container.appendChild(redCardDiv);
        });
    }
}

function createPlayers(team, teamId, players) {
    let container = document.getElementById(teamId);
    if (!container) return;

    players.forEach((playerName, index) => {
        if (playerName && playerName.trim() !== "") {
            let player = {
                name: playerName,
                goals: 0,
                assists: 0,
                yellowCards: 0,
                redCards: 0
            };
            team.players.push(player);
            let playerDiv = document.createElement("div");
            playerDiv.classList.add("player-card");
            playerDiv.innerHTML = `
                <div class="player-header" onclick="toggleDetails('${teamId}-player${index + 1}-details')">
                    <h3>${player.name}</h3><span class="arrow">⬇</span>
                </div>
                <div class="player-details" id="${teamId}-player${index + 1}-details">
                    <p class="stats">⚽ Goals: <span id="${teamId}-player${index + 1}-goals">0</span></p>
                    <p class="stats">🎯 Assists: <span id="${teamId}-player${index + 1}-assists">0</span></p>
                    <p class="stats">🟨 Yellow Cards: <span id="${teamId}-player${index + 1}-yellow">0</span></p>
                    <p class="stats">🟥 Red Cards: <span id="${teamId}-player${index + 1}-red">0</span></p>
                    <button class="btn" onclick="updateStat('${teamId}', ${index + 1}, 'goals')">+ Goal</button>
                    <button class="btn" onclick="updateStat('${teamId}', ${index + 1}, 'assists')">+ Assist</button>
                    <button class="btn" onclick="updateStat('${teamId}', ${index + 1}, 'yellowCards')">+ Yellow</button>
                    <button class="btn" onclick="updateStat('${teamId}', ${index + 1}, 'redCards')">+ Red</button>
                </div>
            `;
            container.appendChild(playerDiv);
        }
    });
}

const teamAContainer = document.getElementById("teamA-players");
const teamBContainer = document.getElementById("teamB-players");

// === FOOTBALL SCORECARD PAGE ===
if (teamAContainer && teamBContainer) {
    const teamAPlayers = JSON.parse(localStorage.getItem("teamAPlayers") || "[]");
    const teamBPlayers = JSON.parse(localStorage.getItem("teamBPlayers") || "[]");
    const teamAName = localStorage.getItem("teamAName") || "Team A";
    const teamBName = localStorage.getItem("teamBName") || "Team B";

    document.getElementById("teamA-name").textContent = teamAName;
    document.getElementById("teamB-name").textContent = teamBName;

    createPlayers(teamA, "teamA-players", teamAPlayers);
    createPlayers(teamB, "teamB-players", teamBPlayers);
}

// === CREATE PAGE ===
const form = document.getElementById("create-form");
const noPlayerInput = document.getElementById("noOfPlayers");
const teamAInputContainer = document.getElementById("teamA-players-input");
const teamBInputContainer = document.getElementById("teamB-players-input");

if (form && noPlayerInput && teamAInputContainer && teamBInputContainer) {
    window.noPlayerGet = function () {
        const nPlayers = parseInt(noPlayerInput.value);
        if (isNaN(nPlayers) || nPlayers <= 0 || nPlayers % 2 !== 0) {
            alert("Enter a valid even number of players");
            return;
        }

        document.getElementById("noPlayers").style.display = "none";
        form.style.display = "block";

        teamAInputContainer.innerHTML = "";
        teamBInputContainer.innerHTML = "";

        for (let i = 1; i <= nPlayers / 2; i++) {
            teamAInputContainer.innerHTML += `<input type="text" placeholder="Team A Player ${i}" required><br>`;
            teamBInputContainer.innerHTML += `<input type="text" placeholder="Team B Player ${i}" required><br>`;
        }
    };

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const teamAName = document.getElementById("teamA-name").value.trim();
        const teamBName = document.getElementById("teamB-name").value.trim();

        const teamAInputs = teamAInputContainer.querySelectorAll("input");
        const teamBInputs = teamBInputContainer.querySelectorAll("input");

        const teamAPlayers = Array.from(teamAInputs).map(input => input.value.trim());
        const teamBPlayers = Array.from(teamBInputs).map(input => input.value.trim());

        if (teamAPlayers.includes("") || teamBPlayers.includes("")) {
            alert("All player fields must be filled!");
            return;
        }

        localStorage.setItem("teamAName", teamAName);
        localStorage.setItem("teamBName", teamBName);
        localStorage.setItem("teamAPlayers", JSON.stringify(teamAPlayers));
        localStorage.setItem("teamBPlayers", JSON.stringify(teamBPlayers));

        window.location.href = "/footballHome/footballPage"; // ✅ Set your football scorecard route here
    });
}

