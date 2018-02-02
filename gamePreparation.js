var defaultPlayerCount = 10;
function basePoints() {
    if (isTestRun && isRandomPointFloor) {
        return Math.round(Math.random() * 500 + 54);
    } else {
        return 0;
    }
}

var colours = ["black", "white", "lime", "green", "yellow", "orange", "red", "blue", "cyan", "purple", "hotpink", "navy", "chocolate", "olive", "tan", "silver", "salmon", "violet", "teal", "aquamarine", "brown", "crimson", "bisque", "gold", "beige", "burlywood", "indigo", "khaki", "lightgreen", "blueviolet"];
var lightColours = ["white", "lime", "yellow", "orange", "cyan", "hotpink", "tan", "silver", "salmon", "violet", "aquamarine", "bisque", "gold", "beige", "burlywood", "khaki", "lightgreen"];

// TESTING APPARATUSES //
var isTestRun = false; //<== TURN INTO FALSE IN PRODUCTION
var isMassive = false;
var isRandomPointFloor = false;
//Pardon the developer, but he's a dweeb.
var TESTNAMES = ['Monikammmmmmmmm', 'Buffsuki', 'Slayori', 'Yuri!!!!!!!!!!!!! On Ice', 'MC-KUN WORST GIRL'];

if (isTestRun) {
    alert("YOU ARE IN TESTING MODE");
    if (isMassive) {
        defaultPlayerCount = 30;
    }
}
// TESTING APPARATUSES //

window.onload = function () {
    generateNameInput();
}

var playerCount = defaultPlayerCount;
var players = [];
var roundNumber = 0;

function generateNameInput() {
    var nameForm = document.getElementById("names");
    var inputWidth = 50;

    for (i = 0; i < defaultPlayerCount; i++) {
        var input = document.createElement("input");
        input.className = "name_input";
        input.width = inputWidth;
        nameForm.appendChild(input);

        if (isTestRun) { try { input.value = TESTNAMES[i]; } catch (e) { } }
    }

    document.getElementById("add_player").onclick = function () {
        var maxPlayerCount = 30;
        if (playerCount < maxPlayerCount) {
            var input = document.createElement("input");
            input.className = "name_input";
            input.width = inputWidth;
            nameForm.appendChild(input);

            playerCount++;
        }
    }

    document.getElementById("enter_names").onclick = function () {
        document.getElementById("register").hidden = true;
        document.getElementById("lobby").hidden = false;
        registerPlayers();
    }
}

function registerPlayers() {
    //TODO: Validate inputs to only admit alphanumeric characters, underscores and hyphens (maybe exclamation points and question marks too?)
    var inputs = document.querySelectorAll("input[class='name_input']");
    var index = 0;
    inputs.forEach(function (input) {
        if (input.value == "") { } else {
            var randomIndex = Math.round(Math.random() * (colours.length - 1));
            var randomColour = colours[randomIndex];
            colours.splice(randomIndex, 1);
            var bgColour;
            //Search for the Foreground Colour on the Light Colour array. If it finds it, put a black background behind it. But if it doesn't find it, then it's a Dark Colour with a white background behind.
            if (lightColours.find(function (colour) { return (colour == randomColour) }) === undefined) {
                bgColour = "white";
            } else {
                bgColour = "black";
            }

            players.push({
                num: index,
                name: input.value,
                colour: randomColour,
                bg: bgColour,
                points: basePoints(),
                position: 0,
                currentPenalty: 0,
                scoreLog: [0]
            })
            index++;
        }
    })
    showLobby();
}

function showLobby() {
    players.forEach(function (player) {
        var display = document.createElement('div');
        display.className = 'player_name';
        display.innerText = player.name + " ";
        display.style.color = player.colour;
        display.style.backgroundColor = player.bg;
        var editBtn = document.createElement('button');
        editBtn.innerText = '✏️';
        display.appendChild(editBtn);
        editBtn.onclick = function () {
            //TODO: Sanitize input.
            var newName = prompt("What would you like your new name to be, " + player.name + "?");
            if (newName == "" || newName === null || newName === undefined) { return; }
            player.name = newName;
            display.innerText = player.name;
            display.appendChild(editBtn);
        }
        document.getElementById("name_list").appendChild(display);
    })

    document.getElementById("edit_names").onclick = function () {
        colours = ["black", "white", "lime", "green", "yellow", "orange", "red", "blue", "cyan", "purple", "hotpink", "navy", "chocolate", "olive", "tan", "silver", "salmon", "violet", "teal", "aquamarine", "brown", "crimson", "bisque", "gold", "beige", "burlywood", "indigo", "khaki", "lightgreen"];
        players = [];
        document.getElementById("register").hidden = false;
        document.getElementById("lobby").hidden = true;
        document.getElementById("name_list").querySelectorAll("div").forEach(function (val) { val.remove(); })
        document.getElementById("player_delete_hint").hidden = false;
    }
}
