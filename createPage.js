document.getElementById("create-form").style.display = "none";

let nPlayers;

document.querySelector(".noPlayerSubmit").addEventListener("click", function (event) {
    event.preventDefault();

    nPlayers = parseInt(document.getElementById("noOfPlayers").value);
    if (isNaN(nPlayers) || nPlayers % 2 !== 0 || nPlayers <= 0) {
        alert("Please enter a valid even number of players.");
        return;
    }

    document.getElementById("noPlayers").style.display = "none";
    document.getElementById("create-form").style.display = "block";

    const teamAcontainer = document.getElementById("teamA-players-input");
    const teamBcontainer = document.getElementById("teamB-players-input");

    teamAcontainer.innerHTML = ""; // Clear existing inputs
    teamBcontainer.innerHTML = "";

    const playersPerTeam = nPlayers / 2;

    for (let i = 1; i <= playersPerTeam; i++) {
        const inputA = document.createElement("input");
        inputA.type = "text";
        inputA.id = `teamA-player${i}`;
        inputA.placeholder = `Team A - Player ${i}`;
        inputA.required = true;
        teamAcontainer.appendChild(inputA);

        const inputB = document.createElement("input");
        inputB.type = "text";
        inputB.id = `teamB-player${i}`;
        inputB.placeholder = `Team B - Player ${i}`;
        inputB.required = true;
        teamBcontainer.appendChild(inputB);
    }
});

document.getElementById("create-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const teamAName = document.getElementById("teamA-name").value;
    const teamBName = document.getElementById("teamB-name").value;

    const teamAPlayers = [];
    const teamBPlayers = [];

    const playersPerTeam = nPlayers / 2;

    for (let i = 1; i <= playersPerTeam; i++) {
        teamAPlayers.push(document.getElementById(`teamA-player${i}`).value);
        teamBPlayers.push(document.getElementById(`teamB-player${i}`).value);
    }

    localStorage.setItem("teamAName", teamAName);
    localStorage.setItem("teamBName", teamBName);
    localStorage.setItem("teamAPlayers", JSON.stringify(teamAPlayers));
    localStorage.setItem("teamBPlayers", JSON.stringify(teamBPlayers));

    window.location.href = "/footballHome/footballPage";
});
