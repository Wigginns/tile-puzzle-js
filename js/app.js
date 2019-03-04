var moves = 0;
var table;
var rows;
var columns;
var textMoves;
var arrayForBoard;


function start()
{
    var button = document.getElementById("newGame");
    button.addEventListener("click", startNewGame, false);
    textMoves = document.getElementById("moves");
    table = document.getElementById("table");
    rows = 4;
    columns = 4;
    startNewGame();
}

function startNewGame()
{
    
}