var canvas;
var canvasContext;

const gameStates = {MENU:'menu', INSTRUCTION: 'instruction', GAME:'game', REPLAY:'replay'};

var previousGameState;
var gameState = gameStates.MENU;

var soundMgr;

var currentTouchPoint = null;
//bool
var artAgent = false;

// Run when window loads
function load() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    gameSetup();
}

//image containing positions and image filepath
function image(newX, newY, iSRC) {
    this.zindex = 0;
    this.x = newX;
    this.y = newY;
    this.sImage = new Image();
    this.sImage.src = "Images/" + iSRC;
}

// draw to canvas context
image.prototype.render = function (width, height) {
    canvasContext.drawImage(this.sImage, this.x, this.y, width, height);
}

function gameSetup() {
    if (canvas.getContext)
    {
        //Set Event Listeners for window, mouse and touch

        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);

        canvas.addEventListener("touchstart", touchDown, false);
        canvas.addEventListener("touchmove", touchXY, true);
        canvas.addEventListener("touchend", touchUp, false);

        document.body.addEventListener("touchcancel", touchUp, false);

        resizeCanvas();

        // sound run from iSound.java
        if(soundMgr != null){
            soundMgr.playMusic(0);
        }
        sceneMgr();
    }
}

// debugging lines
function print(message) {
    console.log(message);
}

// set the canvas size to the window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// the scene to apply rules and render
function sceneMgr() {
    if(gameState != previousGameState)
    {
        previousGameState = gameState;
        if(gameState == gameStates.MENU){
            startMenu();
        }
        if(gameState == gameStates.INSTRUCTION){
            startInstruction();
        }
        if(gameState == gameStates.GAME){
            startGame();
        }
        if(gameState == gameStates.REPLAY){
            startReplay();
        }
    }
    requestAnimationFrame(sceneMgr);
}

function toggleBot(){
    artAgent = !artAgent;
    if(artAgent){
        botButton = new image(canvas.width*0.8, canvas.height*0.845, "Bot.jpg", 0, 0);
    }
    else{    
        botButton = new image(canvas.width*0.8, canvas.height*0.845, "Human.jpg", 0, 0);
    }
}

function clearData(){
    ClearAgentData();
}

// functions called from outside this javascript - purpose to change scene
function viewInstructions(){
    gameState = gameStates.INSTRUCTION;
}

function playGame(){
    gameState = gameStates.GAME;
}

function stopGame(){
    gameState = gameStates.REPLAY;
}

// formatting text
function styleText(txtColour, txtFont, txtAlign, txtBaseline) {
    canvasContext.fillStyle = txtColour;
    canvasContext.font = txtFont;
    canvasContext.textAlign = txtAlign;
    canvasContext.textBaseline = txtBaseline;
}

// input variables
var timePressed;
var firstPress = null;
var previousTimeStep;
var point;

function touchUp(evt) {
    evt.preventDefault();
    if(gameState == gameStates.GAME){
        if(!artAgent){
            var elapsed = Date.now() / 1000 - timePressed;
            var swipeDown = currentTouchPoint.y - firstPress.y >= 100;

            // what direction to rotate - decided by what side of screen pressed
            var clockwise;
            if(currentTouchPoint.x > canvas.width/3){
                clockwise = 1;
            }
            else{
                clockwise = -1;
            }

            // swipe down fast on screen then speed up falling shape
            if(swipeDown == true && elapsed < 0.15){
                hardPlacement = true;
                timeStep *= 0.1;
            }

            // tapping the screen rotates the current shape
            if (elapsed < 0.15 && swipeDown == false) {
                rotateShape(clockwise);
            }
        }
    }
    firstPress = null;
    point = null;
    currentTouchPoint = null;
}

function touchDown(evt) {
    timePressed = Date.now() / 1000;
    evt.preventDefault();
    touchXY(evt);
}

function touchXY(evt) {
    evt.preventDefault();
    currentTouchPoint = { x: evt.touches[0].pageX, y: evt.touches[0].pageY };

    switch(gameState){
        // presses buttons in the menu scenes
        case gameStates.MENU:
            if(firstPress == null){
                firstPress = currentTouchPoint;
                playButtonCheck(firstPress);
                botButtonCheck(firstPress);
                clearButtonCheck(firstPress);
            }
        break;
        case gameStates.INSTRUCTION:
            if(firstPress == null){
                firstPress = currentTouchPoint;
                skipButtonCheck(firstPress);
            }
        break;
        case gameStates.REPLAY:
            if(firstPress == null){
                firstPress = currentTouchPoint;
                replayButtonCheck(firstPress);
            }
        break;
        case gameStates.GAME:
            if(!artAgent){
                if(firstPress == null){
                    firstPress = currentTouchPoint;
                    point = currentTouchPoint;
                }

                // holding down longing means that game expects movement input
                var elapsed = Date.now() / 1000 - timePressed;
                if (elapsed >= 0.15) {
                    moveShape(currentTouchPoint);
                }
            }
        break;
    }
}
