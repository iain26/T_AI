var desired = {left: -1, right: 1, NA: 0};
var newDir;
var aimX = 0;
var completeRun = false;
var changeX = -1;

var initialAtt = [
    {"name": "j","explore": 1, "runs": 0, 
    "pG" : 0, "pD" : 0, "pH" : 0, "pB" : 0,
    "gap": 0,"delete": 0,"height": 0,"bump": 0},
    {"name": "l","explore": 1, "runs": 0,
    "pG" : 0, "pD" : 0, "pH" : 0, "pB" : 0,
    "gap": 0,"delete": 0,"height": 0,"bump": 0},
    {"name": "z","explore": 1, "runs": 0,
    "pG" : 0, "pD" : 0, "pH" : 0, "pB" : 0,
    "gap": 0,"delete": 0,"height": 0,"bump": 0},
    {"name": "s","explore": 1, "runs": 0,
    "pG" : 0, "pD" : 0, "pH" : 0, "pB" : 0,
    "gap": 0,"delete": 0,"height": 0,"bump": 0},
    {"name": "o","explore": 1, "runs": 0,
    "pG" : 0, "pD" : 0, "pH" : 0, "pB" : 0,
    "gap": 0,"delete": 0,"height": 0,"bump": 0},
    {"name": "i","explore": 1, "runs": 0,
    "pG" : 0, "pD" : 0, "pH" : 0, "pB" : 0,
    "gap": 0,"delete": 0,"height": 0,"bump": 0},
    {"name": "t","explore": 1, "runs": 0,
    "pG" : 0, "pD" : 0, "pH" : 0, "pB" : 0,
    "gap": 0,"delete": 0,"height": 0,"bump": 0}];

var currentG = [0, 0, 0, 0, 0, 0, 0 ];
var currentD = [0, 0, 0, 0, 0, 0, 0 ];
var currentH = [0, 0, 0, 0, 0, 0, 0 ];
var currentB = [0, 0, 0, 0, 0, 0, 0 ];

var  attributesID = "attributes";
var  iterID = "iteration";
var  clearID = "clear";

var attributes;
var iter = 1;
var lastClearRate = 0;

var passes = 0;
var rot = 0;
var endCheck = 0;

var randG = [0, 0, 0, 0, 0, 0, 0 ];
var randD = [0, 0, 0, 0, 0, 0, 0 ];
var randH = [0, 0, 0, 0, 0, 0, 0 ];
var randB = [0, 0, 0, 0, 0, 0, 0 ];
function setAgentValues(){

    attributes = getAttributeValue(attributesID, initialAtt);
    iter = getMiscValue(iterID, iter);
    lastClearRate = getMiscValue(clearID, lastClearRate);

    for(var i = 0; i < attributes.length; i++){
        currentG[i] = 0;
        currentD[i] = 0;
        currentH[i] = 0;
        currentB[i] = 0;

        
        attributes[i].runs = 0;

        randG[i] = (Math.random() * ((attributes[i].explore) * 4) + (-attributes[i].explore * 4));
        randD[i] = (Math.random() * ((attributes[i].explore) * 4));
        randH[i] = (Math.random() * ((attributes[i].explore) * 4) + (-attributes[i].explore * 4));
        randB[i] = (Math.random() * ((attributes[i].explore) * 4) + (-attributes[i].explore * 4));
    }

    
    if(localStorage.getItem(iterID) != 1 ){
        print("Last lines cleared: " + lastClearRate)
        print(attributes)
    }
}

function ClearAgentData(){
    print("Cleared Local Storage")
    localStorage.clear();
}

function getAttributeValue(id, vari){
    if(localStorage.getItem(id) != null){
         return JSON.parse(localStorage.getItem(id));
    }
    else{
        localStorage.setItem(id, JSON.stringify(vari));
        return JSON.parse(localStorage.getItem(id));
    }
}

function getMiscValue(id, vari){
    if(localStorage.getItem(id) != null){
        return localStorage.getItem(id);
    }
    else{
        localStorage.setItem(id, vari);
        return localStorage.getItem(id);
    }
}

function renAlgo() {

    if(agentNewShape == true){
        attributes[shapeIndex].runs++;
        highestReward =null;
        completeRun = false;
        passes = 0;
        endCheck = xGridAmount - (highestX - lowestX + 1);
        changeX = -1;
    }
    
    if(completeRun == false){
        currentY = -4;
        if(agentNewShape == true){
            agentNewShape = false;
        }
        var move = true;
        for (var i = 0; i < shape.length; i++) {
            var tempX = BlockGridPosX[i] + changeX;
            if(changeX < 0){
                if(BlockGridPosX[i] <= 0){
                    changeX = 1;
                } 

            }
            if(changeX > 0){
                if(BlockGridPosX[i] >= xGridAmount - 1){
                    changeX = -1;
                    if(passes >= 4){
                        completeRun = true;
                    }
                    else{
                        rotateShape(1);
                        passes++;
                    }
                }
            }
            if(tempX < 0 || tempX >= xGridAmount){
                move = false;
            }
        }
        if(move == true)
        {
            aimX = reward()
            if(changeX > 0){
                newDir = desired.right;
            }
            else if(changeX < 0){
                newDir = desired.left;
            }
        }
    }

    if(completeRun == true){
        for(var r = 0; r < rot; r++){
            rotateShape(1);
        }
        rot = 0;

        if(currentX > aimX){
            currentY = -4;
            newDir = desired.left;
        }
        if(currentX < aimX){
            currentY = -4;
            newDir = desired.right;
        }
        if(currentX == aimX){
            newDir = desired.NA;
        }
    }
    conInput(newDir);
}

var move = {x: 0, y: 0};

function conInput(dir){
    move = {x: gridCellX[BlockGridPosX[0]]  + (canvas.width * dir), y:0};
    moveShape(move);
    move = {x: 0, y: 0};
}

var highestReward = null;

function reward(){

    var reward = {GAPS: 0, DELETE: 0, HEIGHT: 0, BUMP: 0};

    // Gaps

    var checkB = [];
    var diffB = [];

    var checkR = [];
    var diffR = [];

    var checkL = [];
    var diffL = [];
    for (var i = 0; i < shape.length; i++) {

        var right = (BlockGridPosX[i]) + 1;
        var left = (BlockGridPosX[i]) - 1;

        if(ghostCurrentY + BlockShapePosY[i] - lowestY != yGridAmount -1){

            for (var j = 0; j < shape.length; j++) {
                if(i == j){
                    continue;
                }
                if((BlockGridPosX[i] == BlockGridPosX[j]) &&
                 ((ghostCurrentY + BlockShapePosY[i] - lowestY + 1) == (ghostCurrentY + BlockShapePosY[j] - lowestY)))
                {
                    if(!diffB.includes(i)){
                        diffB.push(i);
                    }
                    continue;
                }
                else{
                    if(surfaceBlock[(BlockGridPosX[i])][ghostCurrentY + BlockShapePosY[i] - lowestY + 1] == null){
                        if(!checkB.includes(i)){
                            checkB.push(i);
                        }
                    }
                }
            }
        }

        if(right < xGridAmount){
            for (var j = 0; j < shape.length; j++) {
                if(i == j){
                    continue;
                }
                if(right == BlockGridPosX[j] &&
                    ((ghostCurrentY + BlockShapePosY[i] - lowestY) == (ghostCurrentY + BlockShapePosY[j] - lowestY))){
                    if(!diffR.includes(i)){
                        diffR.push(i);
                    }
                    continue;
                }
                else{
                    if(surfaceBlock[right][ghostCurrentY + BlockShapePosY[i] - lowestY] == null){
                        if(!checkR.includes(i)){
                            checkR.push(i);
                        }
                    }
                }
            }
        }

        if(left >= 0){
            for (var j = 0; j < shape.length; j++) {
                if(i == j){
                    continue;
                }
                if(left == BlockGridPosX[j] &&
                    ((ghostCurrentY + BlockShapePosY[i] - lowestY) == (ghostCurrentY + BlockShapePosY[j] - lowestY))){
                    if(!diffL.includes(i)){
                        diffL.push(i);
                    }
                    continue;
                }
                else{
                    if(surfaceBlock[left][ghostCurrentY + BlockShapePosY[i] - lowestY] == null){
                        if(!checkL.includes(i)){
                            checkL.push(i);
                        }
                    }
                }
            }
        }
    }

    for (var i = 0; i < shape.length; i++) {
        if(checkB.includes(diffB[i])){
            checkB.splice(checkB.indexOf(diffB[i]), 1);
        }
        if(checkR.includes(diffR[i])){
            checkR.splice(checkR.indexOf(diffR[i]), 1);
        }
        if(checkL.includes(diffL[i])){
            checkL.splice(checkL.indexOf(diffL[i]), 1);
        }
    }
    reward.GAPS = (checkB.length) + (checkR.length) + (checkL.length);

    const aggregate = (a, c) => a + c;
    //lines
    var yLineAmount = [];
    var blockPresent = false;
    var yToAdd = [];
    for (var y = yGridAmount - 1; y >= 0; y--) {
        var lineAmount = 0;
        for(x = 0; x < xGridAmount; x++){
            for (var i = 0; i < shape.length; i++) {
                if(surfaceBlock[x][y] != null || (x == BlockGridPosX[i] && y == ghostCurrentY + BlockShapePosY[i] - lowestY)){
                    blockPresent = true;
                }
                if(x == BlockGridPosX[i] && y == ghostCurrentY + BlockShapePosY[i] - lowestY){
                    yToAdd.push(y);
                }
            }
            if(blockPresent == true){
                blockPresent = false;
                lineAmount++;
            }
        }
        if(yToAdd.includes(y)){
            yLineAmount.push(lineAmount);
        }
    }
    if(yLineAmount.length != 0){ reward.DELETE = yLineAmount.reduce(aggregate); }
    else{ reward.DELETE = 0; }

    // aggregate height
    var columnHeight = [];
    var xToAdd = [];
    var xHeight = [];

    var xBump = [];
    var countCheck = [];

    for(var x = 0; x < xGridAmount; x++){
        var height = 0;
        for(var y = yGridAmount - 1; y >= 0; y--){
            for (var i = 0; i < shape.length; i++) {
                if(surfaceBlock[x][y] != null || (x == BlockGridPosX[i] && y == ghostCurrentY + BlockShapePosY[i] - lowestY)){
                    height = yGridAmount - y;
                }
                if((x == BlockGridPosX[i] && y == ghostCurrentY + BlockShapePosY[i] - lowestY)){
                    xToAdd.push(x);
                }
            }
        }
        columnHeight.push(height);
    }

    for(var count = 0; count < xToAdd.length; count++){
        if(countCheck.includes(xToAdd[count])){
            continue;
        }
        countCheck.push(xToAdd[count]);

        if(count == 0){
            if(xToAdd[count] > 0){
                xBump.push(columnHeight[xToAdd[count] - 1]);
            }
        }

        xHeight.push(columnHeight[xToAdd[count]]);
        xBump.push(columnHeight[xToAdd[count]]);

        if(xToAdd[count] == xToAdd[xToAdd.length - 1]){
            if(xToAdd[count] < xGridAmount - 1){
                xBump.push(columnHeight[xToAdd[count] + 1]);
            }
        }
    }
    if(xHeight.length != 0){ reward.HEIGHT = xHeight.reduce(aggregate); }
    else{ reward.HEIGHT = 0; }

    // bump
    var bump = 0;
    for(var i = 0; i < xBump.length; i++){
        if(i < xBump.length -1 ){
            bump += Math.abs(xBump[i+1] - xBump[i]);
        }
    }
    reward.BUMP = bump

    // determine reward
    var h = ((attributes[shapeIndex].gap + randG[shapeIndex] ) * reward.GAPS) + 
            ((attributes[shapeIndex].delete + randD[shapeIndex] ) * reward.DELETE) + 
            ((attributes[shapeIndex].height + randH[shapeIndex]) * reward.HEIGHT) + 
            ((attributes[shapeIndex].bump + randB[shapeIndex]) * reward.BUMP);   
            
    // var h = (-1  * reward.GAPS) + 
    // (1 * reward.DELETE) + 
    // (-1 * reward.HEIGHT) + 
    // (-1 * reward.BUMP);            

    //determine highest reward
    if(h > highestReward || highestReward == null){
        highestReward =  h;
        rot = passes;
        return currentX;
    }
    //else return current target
    return aimX;
}

var lastBelow = [0, 0, 0, 0, 0, 0, 0 ];
var lastNumBlocks = [0, 0, 0, 0, 0, 0, 0 ];
var lastAggHeight = [0, 0, 0, 0, 0, 0, 0 ];
var lastBumpSurface = [0, 0, 0, 0, 0, 0, 0 ];

function evaluation(){

    var currentBelow = 0;
    var currentNumBlocks = 0;
    var currentAggHeight = 0;
    var currentBumpSurface = 0;

    for(var y = yGridAmount - 1; y >= 0; y--){
        var amount = 0;
        for(var x = 0; x < xGridAmount; x++){
            if(surfaceBlock[x][y] != null){
                amount++;
                currentNumBlocks++;
            }
        }
        if(amount == 10){
            currentNumBlocks -= amount;
        }
    }
    
    var columnHeight = [];
    for(var x = 0; x < xGridAmount; x++){
        var height = 0;
        for(var y = yGridAmount - 1; y >= 0; y--){
            if(surfaceBlock[x][y] != null ){
                height = yGridAmount - y;
            } 
            if(surfaceBlock[x][y] == null && (y != 0 && surfaceBlock[x][y-1] != null)){
                currentBelow++;
                if(y != yGridAmount - 1){
                    if(surfaceBlock[x][y+1] == null){
                        currentBelow++;
                    }
                }
            } 
        }
        columnHeight.push(height);
    }
    const aggregate = (a, c) => a + c;
    if(columnHeight.length != 0){ currentAggHeight = columnHeight.reduce(aggregate); }
    else{ currentAggHeight = 0; }
    
    for(var i = 0; i < columnHeight.length; i++){
        if(i < columnHeight.length -1 ){
            currentBumpSurface += Math.abs(columnHeight[i+1] - columnHeight[i]);
        }
    }

    // currentBelow = lastBelow[shapeIndex] - currentBelow;
    // currentNumBlocks = lastNumBlocks[shapeIndex] - currentNumBlocks;
    // currentAggHeight = lastAggHeight[shapeIndex] - currentAggHeight;
    // currentBumpSurface = lastBumpSurface[shapeIndex] - currentBumpSurface;
    
    // evaluateMove("gap", side);
    evaluateMove("gap", currentBelow);
    evaluateMove("delete", currentNumBlocks);
    evaluateMove("height", currentAggHeight);
    evaluateMove("bump", currentBumpSurface);

    lastBelow[shapeIndex] = currentBelow;
    lastNumBlocks[shapeIndex] = currentNumBlocks;
    lastAggHeight[shapeIndex] = currentAggHeight;
    lastBumpSurface[shapeIndex] = currentBumpSurface;
}

function evaluateMove(typeOfScoreAdd, value){
    switch(typeOfScoreAdd){
        case "line cleared":
            score += 1;
            break;
        case "gap":
            currentG[shapeIndex] += value;
            break;
        case "delete":
            currentD[shapeIndex] += value;
            break;
        case "height":
            currentH[shapeIndex] += value;
            break;
        case "bump":
            currentB[shapeIndex] += value;
            break;
    }
}

function utility(){

    if(attributes[0].explore > 0){
        iter++;
        localStorage.setItem(iterID, iter);
    }

    for(var i = 0; i < attributes.length; i++){
        if(attributes[i].explore > 0){
            if(score - lastClearRate >= 0){
                attributes[i].explore -= (score - lastClearRate) * 0.01;
            }
        }
        if(attributes[i].explore <= 0){
            attributes[i].explore = 0;
        }

        currentG[i] = currentG[i] / attributes[i].runs;
        currentD[i] = currentD[i] / attributes[i].runs;
        currentH[i] = currentH[i] / attributes[i].runs;
        currentB[i] = currentB[i] / attributes[i].runs;

        if(currentG[i] > attributes[i].pG){
            attributes[i].gap += randG[i];
            attributes[i].pG  = currentG[i];
        }

        if(currentD[i] > attributes[i].pD){
            attributes[i].delete += randD[i];
            attributes[i].pD  = currentD[i];
        }

        if(currentH[i] > attributes[i].pH){
            attributes[i].height += randH[i];
            attributes[i].pH  = currentH[i];
        }

        if(currentB[i] > attributes[i].pB){
            attributes[i].bump += randB[i];
            attributes[i].pB  = currentB[i];
        }
    }

    localStorage.setItem(clearID, score);
    localStorage.setItem(attributesID, JSON.stringify(attributes));
}