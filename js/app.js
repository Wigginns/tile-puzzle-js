var moves = 0;
var gametable;
var rows;
var columns;
var textMoves;
var arrayForBoard;


function start()
{
    var button = document.getElementById("newGame");
    button.addEventListener("click", startNewGame, false);
    textMoves = document.getElementById("moves");
    gametable = document.getElementById("gametable");
    rows = 4;
    columns = 4;
    startNewGame();
}

function startNewGame()
{
    var arrayOfNumbers = new Array();
    var arrayToFillFrom;
    var randomNumber = 0;
    var count = 0;
    moves = 0;

    rows = document.getElementById("rows").value;
    columns = document.getElementById("columns").value;

    textMoves.innerHTML = moves;

    //Build 2d array for board
    arrayForBoard = new Array(rows);
    for (var i = 0; i < rows; i++)
    {
        arrayForBoard[i] = new Array(columns);
    }

    //Build and randomize array of all numbers we'll need
    arrayToFillFrom = new Array(rows * columns);
    for (var i = 0; i < arrayToFillFrom.length; i++){
        arrayToFillFrom[i] = i;
    }
    arrayToFillFrom.sort(function(a, b){return 0.5 - Math.random()});

    //pop randomized values from 1 to boardsize-1 into game board array
    for (var i = 0; i < rows; i++)
    {
        for (var j = 0; j < columns; j++){
            arrayForBoard[i][j] = arrayToFillFrom.pop();
        }
    }

    showTable();
}

function showTable()
{
    var outputString = "";
    
    //Loop through rows and columns and build table
    for (var i = 0; i < rows; i++)
    {
        outputString += "<tr>"; //Start row
        for (var j = 0; j < columns; j++){
            //set "0" tile to blank
            if(arrayForBoard[i][j] == 0){
                outputString += "<td class=\"blank\"> </td>";
            }
            else
            {
                outputString += "<td class=\"tile\" onClick=\"moveTile(" + i + ", " + j + ")\">" + arrayForBoard[i][j] + "</td>";
            }
        }
        outputString += "</tr>"; //End Row
    }

    gametable.innerHTML = outputString;

}

function moveTile( tableRow, tableColumn)
{
    if (checkIfMoveable(tableRow, tableColumn, "up") ||
        checkIfMoveable(tableRow, tableColumn, "down") ||
        checkIfMoveable(tableRow, tableColumn, "left") ||
        checkIfMoveable(tableRow, tableColumn, "right") )
    {
     incrementMoves();
    }
    else
    {
        alert("ERROR: Cannot move tile!\nTile must be next to a blank space.");
    }

    if (checkIfWinner())
    {
        alert("Congrats. You solved the puzzle in " + moves + "moves.");
        // startNewGame();
    }
}

function checkIfMoveable(rowCoordinate, columnCoordinate, direction)
{
    rowOffset = 0;
    columnOffset = 0;
    switch(direction) {
        case "up":
            columnOffset = -1;
            break;
        case "right":
            rowOffset = 1;
            break;
        case "left":
            rowOffset = -1;
            break;
        case "down":
            columnOffset = 1;
            break;            
    }

    //Check if the tile can be moved to the spot requested
    //If it can, move it and return true to indicate it's been moved
    if (rowCoordinate + rowOffset >= 0 && columnCoordinate + columnOffset >= 0 &&
        rowCoordinate + rowOffset < rows && columnCoordinate + columnOffset < columns)
    {
        //Check to make sure we're moving into the "blank" tile only
        //If so swap the values
        if( arrayForBoard[rowCoordinate + rowOffset][columnCoordinate + columnOffset] == 0)
        {
            arrayForBoard[rowCoordinate + rowOffset][columnCoordinate + columnOffset] = arrayForBoard[rowCoordinate][columnCoordinate];
            arrayForBoard[rowCoordinate][columnCoordinate] = 0; 
            showTable();
            return true;
        }
    }
    return false;
}

function checkIfWinner()
{
    var count = 1;
    for (var i = 0; i < rows; i++){
        for (var j = 0; j < rows; j++){
            if (arrayForBoard[i][j] != count)
            {
                if( !(count === rows * columns && arrayForBoard[i][j] === 0))
                {
                    return false;
                }
            }
            count++;
        }
    }

    return true;
}

function incrementMoves()
{
    moves++;
    if (textMoves){
        textMoves.innerHTML = moves;
    }
}

window.addEventListener( "load", start, false ); // This event listener makes the function start() execute when the window opens. 