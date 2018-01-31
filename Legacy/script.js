var contestants = [];
var rounds = [];
var colours =
    [{ name: 'lime', hex: '#9fff00' },
    { name: 'black', hex: '#000000' },
    { name: 'white', hex: '#ffffff' },
    { name: 'blue', hex: '#0003a0' },
    { name: 'red', hex: '#ff0000' },
    { name: 'yellow', hex: '#ffd800' },
    { name: 'purple', hex: '#6c006c' },
    { name: 'pink', hex: '#ff90f6' },
    { name: 'green', hex: '#11aa11' },
    { name: 'orange', hex: '#ff6a00' }];

var isTestRun = false; //<== TURN INTO FALSE IN PRODUCTION
var TESTNAMES = ['Monikammmmmmmmm', 'Buffsuki', 'Slayori', 'Yuri!!!!!!!!!!!!! On Ice', 'MC-KUN WORST GIRL'];

if (isTestRun) {
    alert("YOU ARE IN TESTING MODE");
}

var nameForm = document.getElementById('names');
for (i = 0; i < 10; i++) {
    var input = document.createElement('input');
    input.className = 'name_input';
    input.width = 40;
    nameForm.appendChild(input);

    if (isTestRun) { input.value = TESTNAMES[i]; }
}
nameForm.appendChild(document.createElement("br"));
var enterNames = document.createElement('button');
enterNames.innerText = 'Aceptar';
nameForm.appendChild(enterNames);

enterNames.onclick = function () {
    var inputs = document.querySelectorAll("input[class='name_input']");
    inputs.forEach(function (input) {
        if (input.value == '') { } else {
            var randomIndex = Math.round(Math.random() * (colours.length - 1));
            var randomColour = colours[randomIndex];
            colours.splice(randomIndex, 1);
            var bgColour;
            if (randomColour.name == 'white' ||
                randomColour.name == 'lime' ||
                randomColour.name == 'yellow' ||
                randomColour.name == 'pink' ||
                randomColour.name == 'orange') {
                bgColour = "black";
            } else {
                bgColour = "white";
            }
            contestants.push({
                name: input.value,
                colour: randomColour,
                bg: bgColour,
                points: 0, //EDIT FOR TESTING
                position: 0,
                currentPenalty: 0
            })
        }
    })
    console.log(contestants);
    document.getElementById('names').hidden = true;
    showContestantsLobby();
};

function showIntro() {
    document.getElementById('intro').style.animationPlayState = 'running';
    document.getElementById('overprint').style.animationPlayState = 'running';
    document.getElementById('overprint').style.zIndex = 1;
}

function prepareChampionship() {
    document.getElementById('logo').style.animationPlayState = 'running';
    document.getElementById('welcome').hidden = true;
    document.getElementById('register').hidden = false;
}

function showContestantsLobby() {
    contestants.forEach(function (contestant) {
        var display = document.createElement('div');
        display.className = 'contestant';
        display.innerText = contestant.name;
        display.style.color = contestant.colour.hex;
        if (contestant.bg != 'white' || contestant.bg != 'black') { }
        display.style.backgroundColor = contestant.bg;
        var editBtn = document.createElement('button');
        editBtn.innerText = '✏️';
        display.appendChild(editBtn);
        editBtn.onclick = function () {
            var newName = prompt('¿A que nombre quieres cambiar, ' + contestant.name + '?');
            if (newName == '' || newName === null || newName === undefined) { return; } 
            contestant.name = newName;
            display.innerText = contestant.name;
            display.appendChild(editBtn);
        }
        document.getElementById('register').appendChild(display);
    })

    var startBtn = document.createElement('button');
    startBtn.innerText = '▶️ Empezar campeonato';
    startBtn.onclick = function () {
        startChampionship();
    }
    document.getElementById('register').appendChild(startBtn);
}

var roundNumber = 0
var scoreboard = document.getElementById('scoreboard');
var graph = document.getElementById('proper_graph');

function startChampionship() {
    document.getElementById('register').hidden = true;
    scoreboard.hidden = false;

    roundNumber++;
    scoreboard.querySelector('h1').innerText = 'Ronda N°1';
    generateGraph();
}

var title = document.getElementById('round_end_title');
var contestantsPanel = document.getElementById('contestants_panel');
var resetWin = document.getElementById('reset_button');
var endRoundBtn = document.getElementById('end_round_button');
var continueBtn = document.getElementById('continue_button');
var isInputingScores = false;
var winner;
var Win = false;

function endRound() {
    var panel = document.getElementById('round_end');

    panel.hidden = false;
    contestantsPanel.querySelectorAll('button').forEach(function (btn) { btn.remove(); })
    title.innerText = '¿Quién ha sido el ganador de la ronda?';
    generateRoundEndButtons();
    panel.appendChild(contestantsPanel);

    resetWin.onclick = function () {
        contestantsPanel.querySelectorAll('button').forEach(function (btn) { btn.remove(); })
        generateRoundEndButtons();
        winner = null;
        isInputingScores = false;
        resetWin.hidden = true;
        endRoundBtn.hidden = true;
        title.innerText = '¿Quién ha sido el ganador de la ronda?';
    }
    endRoundBtn.onclick = function () {
        var winnerLoot = 0;
        contestants.forEach(function (cont) {
            winnerLoot += cont.currentPenalty;
            cont.currentPenalty = 0;
        })
        title.innerText = '¡' + winner.name + ' ha ganado y recibe ' + winnerLoot + ' puntos!';
        addPoints(winner, winnerLoot);
        if (winner.points > 500) { Win = true; }
        sortContestantsByPosition();
        recordRound(winner, winnerLoot);
        contestantsPanel.querySelectorAll('button').forEach(function (btn) { btn.remove(); })
        continueBtn.hidden = false;
        resetWin.hidden = true;
        endRoundBtn.hidden = true;
    }
    continueBtn.onclick = function () {
        continueBtn.hidden = true;
        resetWin = true;
        endRoundBtn.hidden = true;
        panel.hidden = true;
        isInputingScores = false;
        roundNumber++;
        scoreboard.querySelector('h1').innerText = 'Ronda N°' + roundNumber;
        generateGraph();
        if (Win) {
            alert('¡' + winner.name + ' HA GANADO!');
            console.log(rounds);
        }
        winner = null;
    }
}

function recordRound(winner, loot) {
    var newRound = { number: 0, winner: "", contestantsInfo: [] };
    newRound.number = roundNumber;
    newRound.winner = "'" + winner.name + "' ganó con " + loot + " puntos.";
    newRound.contestantsInfo = contestants;

    rounds.push(newRound);
}

function generateRoundEndButtons() {
    contestants.forEach(function (contestant) {
        var btn = document.createElement('button');
        btn.className = 'contestant';
        btn.innerText = contestant.name;
        btn.style.color = contestant.colour.hex;
        btn.style.backgroundColor = contestant.bg;
        btn.style.width = '100%';
        btn.onclick = function () {
            if (isInputingScores) {
                var penalty = prompt('¿Con cuántos puntos fue atrapado ' + contestant.name + '?');
                if (penalty == null || penalty == undefined || penalty == '') {
                    penalty = 0;
                }
                contestant.currentPenalty = parseInt(penalty);
                btn.innerText = contestant.name + ' [+' + contestant.currentPenalty + '] ✏️';
            } else {
                btn.disabled = true;
                btn.innerText = contestant.name + ' [GANADOR] 🔒';
                isInputingScores = true;
                winner = contestant;
                title.innerText = '¿Cuántos puntos para ' + winner.name + '?';
                resetWin.hidden = false;
                endRoundBtn.hidden = false;
            }
        }
        contestantsPanel.appendChild(btn);
    })
}

function addPoints(contestant, loot) {
    contestant.points += loot;
}

function sortContestantsByPosition() {
    //ATTENTION: REALLY FILTHY HACK AHEAD. NOT RECOMMENDED UNDER NORMAL CIRCUMSTANCES.
    //TIME TO BODGE!
    var points = [];
    var orderedPoints = [];
    var highestValue = 0;
    var highestVIndex = -1;

    var isOrdered = false;

    contestants.forEach(function (cont) { points.push(cont.points); })
    while (!isOrdered) {
        if (orderedPoints.length == 10) { isOrdered = true; break; }
        points.forEach(function (p, i) {
            if (p > highestValue) {
                isOrdered = false;
                highestValue = p;
                highestVIndex = i;
            }
        })

        orderedPoints.push(highestValue);
        points.splice(highestVIndex, 1);
        highestValue = 0;
        highestVIndex = -1;
    }

    console.log(orderedPoints);

    var orderedContestants = [];
    var availableContestants = [];
    contestants.forEach(function (val) { availableContestants.push(val); })
    var pos = 1;

    orderedPoints.forEach(function (p) {
        var done = false;
        availableContestants.forEach(function (cont, index) {
            if (cont.points == p && !done) {
                orderedContestants.push({
                    name: cont.name,
                    colour: cont.colour,
                    bg: cont.bg,
                    points: p,
                    position: pos,
                    currentPenalty: 0
                })
                availableContestants.splice(index, 1);
                pos++;
                done = true;
            }
        })
    })

    contestants = orderedContestants;
}

function generateGraph() {
    document.querySelectorAll('tr').forEach(function (val) { val.remove(); })
    contestants.forEach(function (contestant) {
        var row = document.createElement("tr");
        graph.appendChild(row);
        var nameCell = document.createElement("td");
        var pointsCell = document.createElement("td");
        nameCell.className = 'name_cell';
        nameCell.innerText = contestant.name;
        nameCell.style.color = contestant.colour.hex;
        nameCell.style.backgroundColor = contestant.bg;
        var pointsBar = document.createElement("div");
        pointsBar.className = 'points_bar';
        pointsBar.innerText = contestant.points;
        pointsBar.style.backgroundColor = contestant.colour.hex;
        pointsBar.style.color = contestant.bg;
        pointsBar.style.width = (contestant.points * (3/2)) + 'px';
        pointsCell.width = '100%';
        pointsCell.appendChild(pointsBar);
        row.appendChild(nameCell);
        row.appendChild(pointsCell);
        graph.appendChild(row);
    })
}