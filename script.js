"use strict"

/************************************
* Out pops a screen with the options
*************************************/
$("#start-game").click(function() {
    $("#choose").css("visibility", "visible");
    $(".pos").addClass("already-played");
});

$("#okay").click(function() {
    $("#choose").css("visibility", "hidden");
    $(".pos").removeClass("already-played");
    $("body").css("background-color", "#F9CBCB");
    $("#board").addClass("boardshadow");
    $("#start-game").addClass("already-played");
    $("#restart").removeClass("already-played");
});

$("#surprise").click(function() {
    $("div").effect("explode");
    $("body").append('<h3 id="nice" class="centered">C\'mon! Follow the rules! Refresh the page and click OK this time.</h3>');
});

/*****************
* Basics
******************/
//store the board as a 2D array
var board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

//keep track of whose turn it is
var myMove = false;

/**************************************
* Check if someone won, and if so, who
***************************************/
//check for winner
function getWinner(board) {
    var vals = [true, false];
    var allNotNull = true;

    for (var k = 0; k < vals.length; k++) {
        var value = vals[k];
        
        //check diagonals
        var diagComplete1 = true;
        var diagComplete2 = true;
        for (var i = 0; i < 3; i++) {
            if (board[i][i] != value) {
                diagComplete1 = false;
            }
            if (board[2 - i][i] != value) {
                diagComplete2 = false;
            }
            
            //check rows and columns
            var rowComplete = true;
            var colComplete = true;
            for (var j = 0; j < 3; j++) {
                if (board[i][j] != value) {
                    rowComplete = false;
                }
                if (board[j][i] != value) {
                    colComplete = false;
                }
                if (board[i][j] == null) {
                    allNotNull = false; //board is full, game is terminal
                }
            }
            
            //if a row or column win occurs, return 1
            if (rowComplete || colComplete) {
                return value ? 1 : 0;
            }
        }
        
        //if a diagonal win occurs, return 1
        if (diagComplete1 || diagComplete2) {
            return value ? 1 : 0;
        }
    }
    
    //draw
    if (allNotNull) {
        return -1;
    }
    
    //game still going on
    return null;
}


/*****************
* Restart game
******************/
function restartGame() {
    board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    
    myMove = false;
    updateMove();
    
    $(".pos").css("background-color", "#fdfdfd");
    $("body").css("background-color", "#fdfdfd");
    $("#board").removeClass("boardshadow");
    $(".pos").addClass('already-played');
    $("#start-game").removeClass("already-played");
    $("#restart").addClass("already-played");
}

/*********************
* Add an X or O
**********************/
function updateButtons() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            $("#c" + i + "" + j).text(board[i][j] == false ? "x" : board[i][j] == true ? "o" : "");
            //disable already clicked cells
            if (board[i][j]) {
            		$("#c" + i + "" + j).addClass("already-played");
            }
        }
    }
}

/***********************
* Declare winner
************************/
function updateMove() {
    updateButtons();
    var winner = getWinner(board);
        if(winner==1 || winner==0 || winner==-1)
           $(".pos").addClass("already-played")
        $("#status").text(winner == 1 ? "Your computer won!" : winner == 0 ? "You won!" : winner == -1 ? "It's a draw!" : "");
}
    
 
/************************************
* Implementing the MiniMax Algorithm
*************************************/
var numNodes = 0;

function recurseMinimax(board, player) {
    numNodes++;
    var winner = getWinner(board);
    
    //if there is a winner
    if (winner != null) {
        switch(winner) {
            case 1: 
                return [1, board] //AI wins
                
            case 0: 
                return [-1, board] //you win
            case -1:
                return [0, board]; //draw
        }
    } else {
        var nextVal = null;
        var nextBoard = null;
        
        //loop through the board
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] == null) { //if the cell is empty
                    board[i][j] = player;
                    var value = recurseMinimax(board, !player)[0];
                    
                    if (player && (nextVal == null || value > nextVal)
                        || (!player && (nextVal == null || value < nextVal))) {
                            nextBoard = board.map(function(arr) {
                                return arr.slice();
                            });
                        nextVal = value;
                    }
                    board[i][j] = null;
                }
            }
        }
        return [nextVal, nextBoard];
    }
}

function makeMove() {
    board = minimaxMove(board);
    console.log(numNodes); 
    myMove = false;
    updateMove();
}
    
function minimaxMove(board) {
    numNodes = 0;
    return recurseMinimax(board, true)[1];
}


/*******************
* Start the game
********************/
if (myMove) {
}

$(document).ready(function() {
    $("#start-game").click(function() {
        
        $(".pos").click(function() {
            //change color of cell user clicks on
            $(this).css("background-color", "#FFEBA5");
            $(this).addClass('already-played');
            var cell = $(this).attr("id");
            var row = parseInt(cell[1]);
            var col = parseInt(cell[2]);

            if (!myMove) {
                board[row][col] = false;
                myMove = true;
                updateMove();
                setTimeout(disableMove, 600);
                setTimeout(makeMove, 500);
            }
        })
    })
    $("#reset").click(restartGame);
});

updateMove();
    

/***********
* Extras
************/
//disable ability for player to make a move while it is the computer's turn
function disableMove() {
    $(".pos").disabled = "disabled";
}

