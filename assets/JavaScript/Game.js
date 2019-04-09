var xGridAmount = 10;
var yGridAmount = 26;

var spawnPos = 0;

var playing = true;

//time in seconds between updates
var timeStep;
var originalTimeStep;
var previousTime = 0;
var time = 0;
var incrementing = false;

var hardPlacement = false;

var level = 1;
var score = 0;

var gridCellX = [];
var gridCellY = [];
var gridCellOccupied = [];

var shape = [];
var ghostShape = [];

var nextShape;

var BlockShapePosX = [];
var BlockShapePosY = [];

var lowestX = 0;
var highestX = 0;
var lowestY = 0;
var highestY = 0;

var BlockGridPosX = [];
var BlockGridPosY = [];

var surfaceBlock = [];

var lineCounter = 0;

var currentX = 0;
var currentY = -2;

var currentChangeX = 0;

var ghostCurrentY = yGridAmount - 1;

var particleG = 0.05;


// first function to run
function startGame(){
    initialiseGame();
}

// performs reset of game
// sets the grid values
// creates new shape and starts game loop
function initialiseGame() {
    reset();

    if(artAgent){
        setAgentValues();
    }
    
    if (canvas.getContext)
    {
        if(artAgent == true){
            timeStep = 0.000000000000000005;
        }
        else{
            timeStep = 0.3;
        }
        originalTimeStep = timeStep;

        spawnPos = Math.floor(xGridAmount/2) - 2;
        currentX = spawnPos;

        var gridYCentre = getGridHeight() / 2;

        for (var x = 0; x < xGridAmount; x++) {
            gridCellX.push(((getGridWidth() * x)));
        }
        for (var y = 0; y < yGridAmount; y++) {
            gridCellY.push(((getGridHeight() * y)));
        }

        for (var x = 0; x < xGridAmount; x++) {
            gridCellOccupied[x] = new Array(yGridAmount);
            surfaceBlock[x] = new Array(yGridAmount);
            for (var y = 0; y < yGridAmount; y++) {
                gridCellOccupied[x][y] = false;
                surfaceBlock[x][y] = null;
            }
        }

        backgroundImage = new image(0, 0, "grey-background.jpg", 0, 0);
        headerImage = new image(0, 0, "Header.png", 0, 0);
        styleText('white', '40px Courier New', 'left', 'middle');

        createNewShape();
        gameLoop();
    }
}

// the float values of width and height of a single grid position
function getGridWidth(){
    return canvas.width/xGridAmount;
}
function getGridHeight(){
    return canvas.height/yGridAmount;
}

// sets time intervals between updating the y position of the shape
function timeStepUpdate() {
    if (incrementing == false) {
        incrementing = true;
        setTimeout(function () {
            time += 1;
            incrementing = false;
            }, timeStep * 1000);
    }
}

// loop that holds main mechanics run each animation frame until end condition met
function gameLoop() {
    timeStepUpdate();
    placementCheck();
    checkLine();
    update();
    ghost();
    renderGame();
    if(playing == true){
        requestAnimationFrame(gameLoop);
    }
    else{
        if(artAgent == true){
            initialiseGame();
        }
        else{
            stopGame();
        }
    }
}

// reseting the game to values on first loadup - useful for replaying
function reset(){
    xGridAmount = 10;
    yGridAmount = 26;
    spawnPos = 0;

    playing = true;

    if(artAgent == false){
        timeStep = 0.3;
    }
    else{
        timeStep = 0.005;
    }
    previousTime = 0;
    time = 0;
    incrementing = false;

    hardPlacement = false;

    level = 1;
    score = 0;
    lineCounter = 0;

    gridCellX.length = 0;
    gridCellY.length = 0;

    gridCellOccupied.length = 0;
    shape.length = 0;
    ghostShape.length = 0;
    nextShape = null;
    BlockShapePosX.length = 0;
    BlockShapePosY.length = 0;
    lowestX = 0;
    highestX = 0;
    lowestY = 0;
    highestY = 0;

    BlockGridPosX.length = 0;
    BlockGridPosY.length = 0;
    surfaceBlock.length = 0;

    currentX = 0;
    currentY = -2;
    currentChangeX = 0;
    ghostCurrentY = yGridAmount - 1;

    particles.length = 0;
}

var runGhost = true;
// The outlined object below the shape
function ghost(){
    if(runGhost == true){
        runGhost = false;
        var surfaceX = [];
        var surfaceY = [];

        var updateAgent = false;

        // searches every surface block below the shape
        for (var x = (lowestX + currentX); x <= (highestX + currentX); x++) {
            for (var y = (highestY + currentY); y < yGridAmount; y++) {
                if(surfaceBlock[x][y] != null ){
                    surfaceX.push(x);
                    surfaceY.push(y);
                }
            }
        }

        // sets ghost shapes y position equal to the lowest point
        if(surfaceY.length == 0){
            ghostCurrentY = yGridAmount - 1;
            updateAgent = true;
        }
        else{
            updateAgent = false;
            ghostCurrentY = Math.min(...surfaceY);
            // an offset to apply to L and J shape when vertical as the shape seemingly floats otherwise
            var counter = 0;
            for (var i = 0; i < shape.length; i++) {
                if(BlockShapePosY[i] == 0 && lowestY - highestY > 1){
                    counter++;
                }
            }
            if(counter == 2 && ghostCurrentY != yGridAmount - 1){
                ghostCurrentY++;
            }
            // if ghost shape inside a surface block displace up
            for (var i = 0; i < shape.length; i++) {
                for (var s = 0; s < surfaceX.length; s++) {
                    var ghostX = BlockShapePosX[i] + currentX;
                    var ghostY = ghostCurrentY + BlockShapePosY[i]- lowestY;
                    if(ghostX == surfaceX[s] && surfaceY[s] == ghostY){
                        ghostCurrentY--;
                        // search for every individual block and surface value again if ghost shape displaced
                        i = -1;
                        s = -1;
                    }
                }
            }
            updateAgent = true;
        }
        
        if(artAgent == true && updateAgent == true){
            agentAlgorithm(updateAgent);
        }
        runGhost = true;
    }
}


function renderGame() {
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    backgroundImage.render(canvas.width, canvas.height);
    // render each block seperately
    for (var i = 0; i < shape.length; i++) {
        // if(artAgent == false)
        {
            ghostShape[i].render(getGridWidth(), getGridHeight());
        }
        shape[i].render(getGridWidth(), getGridHeight());
    }
    // render every surface block
    for (var x = 0; x < xGridAmount; x++) {
        for (var y = 0; y < yGridAmount; y++) {
            if (surfaceBlock[x][y] != null) {
                surfaceBlock[x][y].render(getGridWidth(), getGridHeight());
            }
        }
    }

    // if particle exists draw them
    if(particles.length > 0)
    {
        renderParticles(canvasContext);
    }

    //UI Elements
    headerImage.render(canvas.width, getGridHeight() * 2);

    nextShape.x = canvas.width * 0.65;
    nextShape.y = getGridHeight()/6;
    nextShape.render(canvas.width*0.33, getGridHeight()*1.65);

    canvasContext.fillText("Lines: " + score, canvas.width * 0.05, getGridHeight()*0.5);
    if(artAgent == false){
        canvasContext.fillText("Level: " + level, canvas.width * 0.05, getGridHeight()*1.5);
    }
    else{
        canvasContext.fillText("Iteration: " + iter, canvas.width * 0.05, getGridHeight()*1.5);
    }
}

function update() {
    // check for change in time and if so update the current shape down
    if (time != previousTime) {
        currentY += time - previousTime;
        previousTime = time;
    }
    lowestY = Math.max(...BlockShapePosY);
    // set positions for shape and ghost shape
    for (var i = 0; i < shape.length; i++) {
        BlockGridPosX[i] = BlockShapePosX[i] + currentX;
        BlockGridPosY[i] = BlockShapePosY[i] + currentY;

        shape[i].x = gridCellX[BlockGridPosX[i]];
        shape[i].y = gridCellY[BlockGridPosY[i]];

        var ghostY = ghostCurrentY + BlockShapePosY[i]- lowestY;
        ghostShape[i].x = gridCellX[BlockGridPosX[i]];
        ghostShape[i].y = gridCellY[ghostY];
    }
    if(particles.length > 0)
    {
        for (var i = 0; i < particles.length; i++){
            // only have 12 or less particles on screen at once
            if(particles.length > 12 && i < particles.length - 12){
                particles[i] = null;
            }
            // if the particle exists apply gravity and check for collision with surface
            if(particles[i]!=null){
                particles[i].vy += particleG;
                particleCollision(particles[i]);
            }
        }
    }

    // the extreme shape values in each axis
    lowestX = Math.min(...BlockShapePosX);
    highestX = Math.max(...BlockShapePosX);

    lowestY = Math.max(...BlockShapePosY);
    highestY = Math.min(...BlockShapePosY);
}

function particleCollision(particle){
    // touch bottom of screen bounce up by lesser amount
    if(particle.y >= canvas.height*0.995){
        if(particle.vy > 0)
            particle.vy *= -0.5;
    }
    // touch sides of screen bounce towards the centre with slightly less amount
    if(particle.x <= 0 + canvas.width*0.005 || particle.x >= canvas.width*0.995){
        particle.vx *= -0.95;
    }
    // for every surface block that exists
    for (var x = 0; x < xGridAmount; x++) {
        for (var y = yGridAmount; y > 0; y--) {
            if(surfaceBlock[x][y] != null ){
                var a = {x: particle.x, y: particle.y};
                var b = {x: gridCellX[x], y: gridCellY[y]};
                var d = distance(a, b);
                if(d < getGridWidth()*2){
                    // only run if close enough
                    if(!(particle.x > b.x + getGridWidth() || particle.x < b.x)){
                        if(!(particle.y < b.y || particle.y > b.y + getGridHeight())){
                            // if collided change surface colour
                            changeSurfaceColor(x, y, particle.color);
                        }
                    }
                }
            }
        }
    }
}

// depending on RGB color input will load a image of same color
function changeSurfaceColor(x, y, pColor){
    switch(pColor){
        case "rgba(255, 0, 0, 0.5)":
            surfaceBlock[x][y] = new image(gridCellX[x], gridCellY[y], "RedBlock.jpg", 0, 0);
            break;
        case "rgba(0, 255, 0, 0.5)":
            surfaceBlock[x][y] = new image(gridCellX[x], gridCellY[y], "GreenBlock.jpg", 0, 0);
            break;
        case "rgba(0, 0, 255, 0.5)":
            surfaceBlock[x][y] = new image(gridCellX[x], gridCellY[y], "BlueBlock.jpg", 0, 0);
            break;
    }
}

// pythagoras distance between two points
function distance(a, b){
    return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
}

function placementCheck() {
    // check that shape has reached ground or the space below is occupied
    var placed = false;
    for (var i = 0; i < shape.length; i++) {
        if (BlockGridPosY[i] == yGridAmount - 1
            || gridCellOccupied[BlockGridPosX[i]][BlockGridPosY[i] + 1] == true) {
            placed = true;
            if (BlockGridPosY[i] <= 2) {
                // end gameplay
                print("Game Over");
                if(artAgent){
                    utility();
                }
                playing = false;
                return;
            }
        }
    }
    if (placed == true) {
        timeStep=0;
        placement();
    }
}

// create new surface blocks, play sound, generate particles and create new shape
function placement(){
    for (var i = 0; i < shape.length; i++) {
        surfaceBlock[BlockGridPosX[i]][BlockGridPosY[i]] =
        new image(shape[i].x, shape[i].y, "GreenBlock.jpg", 0, 0);

        gridCellOccupied[BlockGridPosX[i]][BlockGridPosY[i]] = true;
    }

    evaluation();

     
    if(soundMgr != null){
        soundMgr.playSound(0);
    }

    if(artAgent == false){
        createParticles(canvas.width, 0);
    }

    createNewShape();
}

function emptyShapeElements() {
    currentY = -2;
    currentX = spawnPos;
    shape.length = 0;
    ghostShape.length = 0;
    BlockShapePosX.length = 0;
    BlockShapePosY.length = 0;
    BlockGridPosX.length = 0;
    BlockGridPosY.length = 0;
    if(hardPlacement == true){
        hardPlacement = false;
        timeStep = originalTimeStep;
    }
}

var agentNewShape = false;

// clear old shape then load a new one from Shape.js
function createNewShape() {
    agentNewShape = true;
    emptyShapeElements();
    shape = CreateShape();
    nextShape = nextShapeDisplay();
    ghostShape = createGhostShape();
    sortShapePos(shape);
    timeStep = originalTimeStep;
}

// give the individual positonal data relative to other and position on the grid
function sortShapePos(newShape) {
    for (var i = 0; i < newShape.length; i++) {
        BlockShapePosX.push(newShape[i].x);
        BlockShapePosY.push(newShape[i].y);

        BlockGridPosX.push(BlockShapePosX[i] + currentX);
        BlockGridPosY.push(BlockShapePosY[i] + currentY);

        newShape[i].x = gridCellX[BlockGridPosX[i]];
        newShape[i].y = gridCellY[BlockGridPosY[i]];
    }
}

// run through ever row counting the columns that are occupied
// if columns occupied equal the total number of columns then delete that row
function checkLine() {
    for (var y = yGridAmount - 1; y > 0; y--) {
        var rowCheck = [];
        for (var x = 0; x < xGridAmount; x++) {
            if (gridCellOccupied[x][y] == true) {
                rowCheck.push(x);
            }
        }
        if (rowCheck.length == xGridAmount) {
            lineDeletion(y);
            lineCounter++;
            if(artAgent == false){
                LevelSystem();
            }
        }
    }
}

// start from first row to delete up and replace the grid values with ones from 1 grid space up
function lineDeletion(yStart) {
    
    addToPoints("line cleared", null);

    for (var yG = yStart; yG > 0; yG--) {
        for (var x = 0; x < xGridAmount; x++) {
            gridCellOccupied[x][yG] = gridCellOccupied[x][yG - 1];
            if (surfaceBlock[x][yG - 1] != null) {
                surfaceBlock[x][yG] =
                new image(gridCellX[x], gridCellY[yG], "GreenBlock.jpg", 0, 0);
            }
            else {
                surfaceBlock[x][yG] = null;
            }
        }
    }
}


// level starts at 1, increment level when player deletes 5 lines
// player gains more score the higher their level, as well as time step decreasing
function LevelSystem(){
    level = Math.floor(lineCounter/ 5) + 1;
    originalTimeStep = 0.3 - ((level -1) * 0.05);
}

// Retrieve play data - Used in Replay.js
function getLevelValues(){
    return {Score: score, Level: level};
}

// call from Main.js - touch events
function moveShape(scrollPoint) {
    
    var left = false;
    var right = false;

    var leftmost = BlockShapePosX[0];
    var rightmost = BlockShapePosX[0];

    var leftmostIndex = 0;
    var rightmostIndex = 0;

    for (var i = 0; i < shape.length; i++) {
        if (BlockShapePosX[i] < leftmost) {
            leftmostIndex = i;
            leftmost = BlockShapePosX[i];
        }
        if (BlockShapePosX[i] > rightmost) {
            rightmostIndex = i;
            rightmost = BlockShapePosX[i];
        }
    }

    // if touch x position less than leftmost block in shape then move left
    if (scrollPoint.x < (gridCellX[BlockGridPosX[leftmostIndex]])) {
        if ((leftmost + currentX) > 0) {
            left = true;
        }
        else {
            left = false;
        }
    }
    else {
        left = false;
    }
    // if touch x position greater than rightmost block in shape then move right
    if (scrollPoint.x > (gridCellX[BlockGridPosX[rightmostIndex]] + (canvas.width/ xGridAmount))) {
        if ((rightmost + currentX) < xGridAmount - 1) {
            right = true;
        }
        else {
            right = false;
        }
    }
    else {
        right = false;
    }

    // conditions stop player going out of bounds or into another shape
    for (var i = 0; i < shape.length; i++) {
        if (BlockGridPosX[i] - 1 > 0) {
            if (gridCellOccupied[BlockGridPosX[i] - 1][BlockGridPosY[i]] == true) {
                left = false;
            }
        }

        if (BlockGridPosX[i] + 1 < xGridAmount - 1) {
            if (gridCellOccupied[BlockGridPosX[i] + 1][BlockGridPosY[i]] == true) {
                right = false;
            }
        }
    }

    // applying change to x, reseting wallkick value if moved
    if (left == true) {
        currentX--;
        currentChangeX = 0;
    }
    if (right == true) {
        currentX++;
        currentChangeX = 0;
    }
}

// checks if new shape rotation
function isRotatable(x, y,tempCurrentX){
    var result = true;
    for(var xI = 0; xI < x.length; xI++){
        if(((y[xI] + currentY)) < (yGridAmount -1)){
            if(gridCellOccupied[(x[xI] + tempCurrentX)][(y[xI] + currentY)] == true
            && (y[xI] + currentY) < yGridAmount - 1){
                print("Cannot rotate: shape");
                result = false;
                break;
            }
        }
        else{
            print("Cannot rotate: ground");
            result = false;
            break;
        }
    }
    return result;
}

function rotateShape(clockwise) {

    var oldX = [];
    var oldY = [];

    var checkX = [];
    var checkY = [];

    // offset for wall kick change back
    var tempCurrentX = currentX;
    tempCurrentX -= currentChangeX;
    currentChangeX = 0;
    //store old values
    for (var i = 0; i < shape.length; i++) {
        oldX.push(BlockShapePosX[i]);
        oldY.push(BlockShapePosY[i]);
    }

    //use height and length to detect which shapes are being rotated
    var height = (lowestY - highestY) + 1;
    var length = (highestX - lowestX) + 1;

    for (var i = 0; i < shape.length; i++) {
        if(height == 3 || length == 3){
            //making centre of shape the rotation point
            oldX[i] -= 1;
            oldY[i] -= 1;
        }
        else if(height == 4 || length == 4){
            if(length == 4){
                oldX[i] = i;
                oldY[i] = 2;
            }
            if(height == 4){
                oldX[i] = 2;
                oldY[i] = i;
            }
        }
    }

    for (var i = 0; i < shape.length; i++) {
        //90 degree rotation matrix - simplified
        checkX.push(oldY[i] * (-1 * clockwise));
        checkY.push(oldX[i] * (1 * clockwise));
    }

    for (var i = 0; i < shape.length; i++) {
        if(height == 3 || length == 3){
            // returning shape to its original position
            checkX[i] += 1;
            checkY[i] += 1;
        }
        else if(height == 4 || length == 4){
            // setting the position for I shape
            if(length == 4){
                checkX[i] = oldY[i];
                checkY[i] = oldX[i];
            }
            if(height == 4){
                checkX[i] = oldY[i];
                checkY[i] = oldX[i];
            }
        }
        // O shape doesnt rotate
        else if(height == 2 || length == 2){
            checkX[i] = BlockShapePosX[i];
            checkY[i] = BlockShapePosY[i];
        }
    }

    //wall kicks - if shape rotation moves shape out of bounds then displace it back onto grid
    if((Math.min(...checkX) + tempCurrentX) < 0){
        while((Math.min(...checkX) + tempCurrentX) < 0){
            tempCurrentX++;
            currentChangeX++;
        }
    }
    if((Math.max(...checkX) + tempCurrentX) > xGridAmount - 1){
        while((Math.max(...checkX) + tempCurrentX) > xGridAmount - 1){
            tempCurrentX--;
            currentChangeX--;
        }
    }

    if(isRotatable(checkX, checkY, tempCurrentX))
    {
        // if shape rotation has no conflicts then apply it
        BlockShapePosX.length = 0;
        BlockShapePosY.length = 0;

        BlockShapePosX = checkX;
        BlockShapePosY = checkY;

        currentX = tempCurrentX;
    }
}