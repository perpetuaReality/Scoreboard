var pointsThreshold = 500;

function startGame() {
    //Hide the Lobby and show the Scoreboard. Then, up the Round Number and generate a preliminary Score Bar Chart.
    document.getElementById("lobby").hidden = true;
    document.getElementById("scoreboard").hidden = false;
    roundNumber++;
    generateGraph();
}

//Generate a Score Bar Chart from the Player Data.
function generateGraph() {
    var minWidth = 20;
    var widthMultiplier = 3 / 2;
    var thresholdIndicator = document.getElementById("threshold");

    //Update the Round Number label and remove the previous Graph, if there was any.
    document.getElementById("label:round").innerText = "Round #" + 1;
    document.getElementById("game").innerText = "(First to " + pointsThreshold + " wins!)";
    document.getElementById("graph").querySelectorAll('tr').forEach(function (val) { val.remove(); })

    //If there isn't a Threshold Indicator, create one behind the Chart.
    if (thresholdIndicator == null) {
        thresholdIndicator = document.createElement("div");
        thresholdIndicator.id = "threshold";
        thresholdIndicator.innerText = "🏁" + pointsThreshold;
        document.getElementById("graph").appendChild(thresholdIndicator);
    }

    //Append a Bar to the Chart for each player on game.
    players.forEach(function (player, index) {
        var row = document.createElement("tr");

        //Create the Name Tag for the Bar.
        var nameCell = document.createElement("td");
        nameCell.className = 'name_cell';
        nameCell.innerText = player.position + ") " + player.name;
        nameCell.style.color = player.colour;
        nameCell.style.backgroundColor = player.bg;

        //Create the Score Bar Itself, as wide as the current score of the player (times a certain preset multiplier), and show it to the right of the Name Tag.
        var pointsBar = document.createElement("div");
        pointsBar.className = 'points_bar';
        pointsBar.innerText = player.points;
        pointsBar.style.backgroundColor = player.colour;
        pointsBar.style.color = (player.points < minWidth) ? "black": player.bg;
        pointsBar.style.width = (player.points * widthMultiplier) + 'px';
        var pointsCell = document.createElement("td");
        pointsCell.width = '100%';
        pointsCell.appendChild(pointsBar);

        //Put the Bar together and add it to the Chart.
        row.appendChild(nameCell);
        row.appendChild(pointsCell);
        document.getElementById("graph").appendChild(row);

        if (index == players.length - 1) {
            thresholdIndicator.style.left = (pointsCell.getBoundingClientRect().left + pointsThreshold * widthMultiplier + 2) + "px";
            //Plus two due to the border of the Points Bar's CSS style.
        }
    })

    //Make the Threshold Indicator a little taller than the Chart.
    thresholdIndicator.style.height = (document.getElementById("graph").getBoundingClientRect().height + 20) + "px";
}

//Get the HTML elements of the Tally-Up Window.
var title = document.getElementById("tally_title");
var tallyPanel = document.getElementById('tally_up');
var playerList = document.getElementById("player_list");
var resetWin = document.getElementById('reset_button');
var endRoundBtn = document.getElementById('end_round_button');
var continueBtn = document.getElementById('continue_button');

//Round Variables
var isInputingScores = false;
var roundWinner;
var winnerLoot = 0;
var Win = false;

//Tally-Up logic.
function endRound() {
    //Show the Tally-Up Window and clean it.
    document.getElementById("modal_container").hidden = false;
    tallyPanel.hidden = false;
    playerList.querySelectorAll('button').forEach(function (btn) { btn.remove(); })

    //Generate the Player List and prompt the user to tally-up the points gained on the round.
    title.innerText = 'Who won?';
    generateTallyButton();
    tallyPanel.appendChild(playerList);
}

function generateTallyButton() {
    //Create a Tally Button for each Player.
    players.forEach(function (player) {
        var btn = document.createElement('button');

        //Stylistic choices.
        btn.className = 'player_button';
        btn.innerText = player.name;
        btn.style.color = player.colour;
        btn.style.backgroundColor = player.bg;

        btn.onclick = function () {
            if (isInputingScores) {
                //If a Winner was chosen, the Button should set the amount of points the current Player gives to the Winner
                //TODO: Alert user of bad (non-numerical and/or too large) inputs.
                var penalty = prompt('How many points was ' + player.name + ' caught with?');
                if (penalty == null || penalty == undefined || penalty == '') {
                    penalty = 0;
                }
                player.currentPenalty = parseInt(penalty);
                //Show this Penalty on the Button.
                btn.innerHTML = player.name + ' <span>[+' + player.currentPenalty + '] ✏️</span>';
            } else {
                //If a Winner hasn't been chosen yet, then the Button sets it's associated Player as the Winner, and disables itself as to not accidentally try to set a Penalty to the Winner.
                isInputingScores = true;
                roundWinner = player;
                title.innerText = 'How many points does ' + roundWinner.name + ' get?';
                btn.innerHTML = player.name + ' <span>[WINNER] 🔒</span>';
                resetWin.hidden = false;
                endRoundBtn.hidden = false;
                btn.disabled = true;
            }
        }
        //Append the current Button to the Player List.
        playerList.appendChild(btn);
    })
}

function tallyWinnerReset() {
    //Reset all Penalties for all Players.
    players.forEach(function (player) { player.currentPenalty = 0; })
    //Get rid of all the old Player Tally Buttons and replace them with new, fresh ones.
    playerList.querySelectorAll('button').forEach(function (btn) { btn.remove(); })
    generateTallyButton();
    //Reset all previous variables and redo the Tally Window.
    roundWinner = null;
    isInputingScores = false;
    resetWin.hidden = true;
    endRoundBtn.hidden = true;
    title.innerText = 'Who won?';
}

function tallyFinish() {
    //See how many points the Winner gained, based on the inputs.
    players.forEach(function (player) {
        winnerLoot += player.currentPenalty;
        player.currentPenalty = 0;
    })
    roundWinner.points += winnerLoot;

    //Display a message announcing the Winner and the Loot.
    title.innerText = roundWinner.name + ' won and gets ' + winnerLoot + ' points!';
    //If the Winner passed the Score Threshold, then prepare everything for the celebration.
    if (roundWinner.points >= pointsThreshold) { Win = true; }
    //Get rid of all the Player Tally Buttons and redo the Tally-Up Window.
    playerList.querySelectorAll('button').forEach(function (btn) { btn.remove(); })
    resetWin.hidden = true;
    continueBtn.hidden = false;
    endRoundBtn.hidden = true;
}

function tallyHide() {
    //Reset all previous variables, redo the Tally Window, and hide it.
    isInputingScores = false;
    resetWin.hidden = true;
    continueBtn.hidden = true;
    endRoundBtn.hidden = true;
    tallyPanel.hidden = true;
    document.getElementById("modal_container").hidden = true;
    //Generate the Score Bar Chart.
    sortPlayersByPosition();
    generateGraph();
    //Add the new Score of each Player to their Log.
    players.forEach(function (player) {
        player.scoreLog.push(player.points);
    })

    if (Win) {
        document.getElementById("modal_container").hidden = false;
        document.getElementById("end_card").hidden = false;
        document.getElementById("winner_announcement").innerText = "🎉 " + roundWinner.name + " has won! 🎊";
        document.getElementById("summary").innerText = roundWinner.name + " won after " + roundNumber + " rounds with a total of " + roundWinner.points + " points!";
    }
    roundWinner = null;
    winnerLoot = 0;
    //Up the Round Number and update the Round Label (Unless the game has ended).
    if (!Win) { roundNumber++; }
    document.getElementById("label:round").innerText = "Round #" + roundNumber;
}

function sortPlayersByPosition() {
    //ATTENTION: REALLY FILTHY HACK AHEAD. NOT RECOMMENDED UNDER NORMAL CIRCUMSTANCES.
    //TIME TO BODGE!
    var points = [];
    var sortedPoints = [];
    var highestValue = -1;
    var highestVIndex = -1;

    var isSorted = false;

    //Get a list of every player's score.
    players.forEach(function (player) { points.push(player.points); })
    while (!isSorted) {
        //Stop sorting once the amount of sorted scores reaches the Player Count
        if (sortedPoints.length == playerCount) { isOrdered = true; break; }
        points.forEach(function (p, i) {
            //If the the score that's being evaluated is higher than the former Hiscore, then it becomes the new Hiscore.
            if (p > highestValue) {
                isSorted = false;
                highestValue = p;
                highestVIndex = i;
            }
        })

        //Add the new Hiscore to the list, remove it so that it isn't evaluated again, and carry on.
        sortedPoints.push(highestValue);
        points.splice(highestVIndex, 1);
        highestValue = -1;
        highestVIndex = -1;
    }

    var sortedPlayers = [];

    sortedPoints.forEach(function (p, pos) {
        var done = false;
        players.forEach(function (player, index) {
            //For each Player on the array, if their score matches the current Sorted Score being evaluated, push a new element onto our disposable array of Sorted Players. The Score Evaluation is indifferent to ties.
            if (player.points == p && !done) {
                sortedPlayers.push({
                    num: player.num,
                    name: player.name,
                    colour: player.colour,
                    bg: player.bg,
                    points: p,
                    position: pos + 1, //Remember: pos is 0-based. Position is not.
                    currentPenalty: 0,
                    scoreLog: player.scoreLog
                })
                players.splice(index, 1);
                done = true;
            }
        })
    })

    //Integrate the disposable Sorted Players array into the main, now empty Player array.
    players = sortedPlayers;
}

var ctx = document.getElementById("chart");
var ProgressChart = null;
var isDarkTheme = false;

function showProgressChart() {
    document.getElementById("end_card").hidden = true;
    document.getElementById("end_chart").hidden = false;
    
    var data = [];
    var rounds = [];

    players.forEach(function (player) {
        data.push({
            fill: false,
            label: player.name,
            borderColor: player.colour,
            backgroundColor: player.colour,
            pointBorderColor: player.colour,
            pointBackgroundColor: player.bg,
            data: player.scoreLog,
        });
    })
    for (var i = 0; i < roundNumber + 1; i++) {
        rounds.push(i);
    }
    ProgressChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: rounds,
            datasets: data
        },
        options: {
            elements: {
                line: {
                    tension: 0,
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        max: 5,
                        min: 0,
                        stepSize: 0.5
                    }
                }]
            }
        }
    })
    Chart.defaults.global.defaultFontFamily = "Franklin Gothic Medium";
    Chart.defaults.global.defaultFontSize = 14
}

function changeChartTheme() {
    Chart.plugins.register({
        beforeDraw: function (chartInstance) {
            var ctx = chartInstance.chart.ctx;
            ctx.fillStyle = isDarkTheme ? 'rgb(33, 33, 33)' : 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
        }
    });
    Chart.defaults.global.defaultFontColor = isDarkTheme ? '#666' : '#EEE';
    ProgressChart.update();
    isDarkTheme = !isDarkTheme;
}