var instruction = true;
var instructBackground;
var skipButton;
var instructImage;
var tapCount = 0;

// first function run
function startInstruction(){
    initialiseInstruct();
}

// sets the values and starts loop
function initialiseInstruct(){
    instruction = true;
    instructBackground = new image(0, 0, "grey-background.jpg", 0, 0);
    skipButton = new image(canvas.width*0.25, canvas.height*0.007, "SkipButton.jpg", 0, 0);
    styleText('black', '20px Courier New', 'left', 'middle');
    instuctionLoop();
}

// Draws instruction menu until scene is quit
function instuctionLoop(){
    cycleThroughTut();
    renderInstruct();
    if(instruction == true){
        requestAnimationFrame(instuctionLoop);
    }
}

function renderInstruct(){
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    instructBackground.render(canvas.width, canvas.height);
    skipButton.render(canvas.width*0.4, canvas.height*0.1);
    instructImage.render(canvas.width * 0.8, canvas.height * 0.7);
    canvasContext.fillText("Tap Anywwhere to continue!!!", canvas.width * 0.005, canvas.height * 0.25);
}

function cycleThroughTut(){
    switch(tapCount){
        case 0:
            instructImage = new image(canvas.width * 0.1, canvas.height*0.3, "unmoved.png", 0, 0);
        break;
        case 1:
            instructImage = new image(canvas.width * 0.1, canvas.height*0.3, "moved.png", 0, 0);
        break;
        case 2:
            instructImage = new image(canvas.width * 0.1, canvas.height*0.3, "original.png", 0, 0);
        break;
        case 3:
            instructImage = new image(canvas.width * 0.1, canvas.height*0.3, "clock.png", 0, 0);
        break;
        case 4:
            instructImage = new image(canvas.width * 0.1, canvas.height*0.3, "anti.png", 0, 0);
        break;
        case 5:
            instructImage = new image(canvas.width * 0.1, canvas.height*0.3, "before.png", 0, 0);
        break;
        case 6:
            instructImage = new image(canvas.width * 0.1, canvas.height*0.3, "after.png", 0, 0);
        break;
        case 7:
            playGame();
            instruction = false;
        break;
    }
}

// touch input detected and checking if touch is over the button 
// plays sound and transistions the scene
function skipButtonCheck(press){
    if(press.x > skipButton.x && press.x < skipButton.x + canvas.width*0.4){
        if(press.y > skipButton.y && press.y < skipButton.y + canvas.height*0.1){
            if(soundMgr != null){
                soundMgr.playSound(1);
            }
            playGame();
            instruction = false;
        }
    }
    tapCount++;
}