var moves = 0;
var arraycount = 0;
var gametable;
var rows;
var columns;
var textMoves;
var textArraycount;
var arrayForBoard;
const DEBUG = true;
const EASY = false;


function start()
{
    var button = document.getElementById("newGame");
    button.addEventListener("click", startNewGame, false);
    textMoves = document.getElementById("moves");
    gametable = document.getElementById("gametable");
    textArraycount = document.getElementById("arraycount");
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
    arraycount = 1;

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

    if (!EASY) arrayToFillFrom.sort(function(a, b){return 0.5 - Math.random()});
    
    while(!solvable(arrayToFillFrom))
    {
        arraycount++;
        if (textArraycount){
            textArraycount.innerHTML = arraycount;
        }
        arrayToFillFrom.sort(function(a, b){return 0.5 - Math.random()});
    }

    //pop randomized values from 1 to boardsize-1 into game board array
    // var test = rows*columns-1;
    var first = true;
    for (var i = 0; i < rows; i++)
    {
        for (var j = 0; j < columns; j++){     
            if(first && EASY){
                arrayForBoard[i][j] = 0;
                first = false;
            }
            else{
                arrayForBoard[i][j] = arrayToFillFrom.pop();
            }
        }
    }

    showTable();
}

function showTable()
{
    var outputString = "";
    
    //Loop through rows and columns and build table
    //Loop through in reverse so that the table generated matches the intuitive array indices
    for (var i = rows-1; i >= 0; i--)
    {
        outputString += "<tr>"; //Start row
        for (var j = columns - 1; j >= 0; j--){
            //set "0" tile to blank
            if(arrayForBoard[i][j] == 0){
                outputString += "<td class=\"blank\"> </td>";
            }
            else
            {
                outputString += "<td class=\"tile\" onClick=\"moveTile(" + i + ", " + j + ", this" + ")\">" + arrayForBoard[i][j] + "</td>";
            }
        }
        outputString += "</tr>"; //End Row
    }

    gametable.innerHTML = outputString;

}

function moveTile( tableRow, tableColumn, id)
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
        id.classList.toggle('tile');
        id.classList.toggle('tileInvalid');
        
        setTimeout(function(){
            id.classList.toggle('tile');
            id.classList.toggle('tileInvalid');
        }, 500);

    }

    if (checkIfWinner())
    {
        alert("Congrats. You solved the puzzle in " + moves + " moves.");
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
    for (var i = rows-1; i >= 0; i--){
        for (var j = columns-1; j >= 0; j--){
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

 /*****************************************
  * 
  * Formula for determining solvability:
  * http://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html
  * First calculate the number of inversions, when a tile a comes before tile b and is larger, this is an inversion
  * Based on whether the grid is even or odd, the number of inversions and the location of the blank we can use a formula to show solvability
  * a. If the grid width is odd, then the number of inversions in a solvable situation is even.
  * b. If the grid width is even, and the blank is on an even row counting from the bottom (second-last, fourth-last etc), then the number of inversions in a solvable situation is odd.
  * c. If the grid width is even, and the blank is on an odd row counting from the bottom (last, third-last, fifth-last etc) then the number of inversions in a solvable situation is even.
  * ( (grid width odd) && (#inversions even) )  ||  ( (grid width even) && ((blank on odd row from bottom) == (#inversions even)) )
  * 
 ******************************************/
function solvable(arrayToFillFrom)
{
    var inversions = 0;
    var blank;
    var blankRow;
    var solvable = false;

    for(var i = 0; i < arrayToFillFrom.length; i++)
    {
        if (DEBUG) console.log("array[" + i +"] == " + arrayToFillFrom[i]);
        if(arrayToFillFrom[i] == 0)
        {
            blank = i;
            if (DEBUG) console.log("blank at " + i);
        }
        else
        {
            for(var j = i+1; j < arrayToFillFrom.length; j++)
            {
                if (arrayToFillFrom[j] == 0)
                {
                    continue;
                }
                if (arrayToFillFrom[i] > arrayToFillFrom[j]) { inversions++; }
                if (DEBUG) console.log({i, j, inversions});
            }
        }
    }

    blankRow = findRow(blank);

    if(     (!isEven(columns) && (isEven(inversions)))
        ||  ((isEven(columns)) && (isEven(findRow(blank))) && !(isEven(inversions))) 
        ||  ((isEven(columns)) && (!isEven(findRow(blank))) && (isEven(inversions))) 
        ||  inversions == 0)
    {
        solvable = true;
    }

    console.log({inversions, blank, blankRow, solvable});
    return solvable;
}

function findRow(index){
   return Math.floor(index/columns);
}

function isEven(num) { return (num % 2) == 0; }


window.addEventListener( "load", start, false ); // This event listener makes the function start() execute when the window opens. 