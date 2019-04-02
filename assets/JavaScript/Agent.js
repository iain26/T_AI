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

var pointG = [0, 0, 0, 0, 0, 0, 0 ];
var pointD = [0, 0, 0, 0, 0, 0, 0 ];
var pointH = [0, 0, 0, 0, 0, 0, 0 ];
var pointB = [0, 0, 0, 0, 0, 0, 0 ];

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

var shiftG = [1, 1, 1, 1, 1, 1, 1 ];
var shiftD = [1, 1, 1, 1, 1, 1, 1 ];
var shiftH = [1, 1, 1, 1, 1, 1, 1 ];
var shiftB = [1, 1, 1, 1, 1, 1, 1 ];

function setAgentValues(){

    attributes = getAttributeValue(attributesID, initialAtt);
    iter = getMiscValue(iterID, iter);
    lastClearRate = getMiscValue(clearID, lastClearRate);

    for(var i = 0; i < attributes.length; i++){
        pointG[i] = 0;
        pointD[i] = 0;
        pointH[i] = 0;
        pointB[i] = 0;

        randG[i] = (Math.random() * ((attributes[i].explore) * 2)  + (-attributes[i].explore * shiftG[i])) * 3;
        randD[i] = (Math.random() * ((attributes[i].explore) * 2)  + (-attributes[i].explore * shiftD[i])) * 3;
        randH[i] = (Math.random() * ((attributes[i].explore) * 2)  + (-attributes[i].explore * shiftH[i])) * 3;
        randB[i] = (Math.random() * ((attributes[i].explore) * 2)  + (-attributes[i].explore * shiftB[i])) * 3;
    }

    print(attributes)
    print("Last lines cleared: " + lastClearRate)
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
            newDir = desired.left;
        }
        if(currentX < aimX){
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

    var checkB = [];
    var diffB = [];

    var checkR = [];
    var diffR = [];

    var checkL = [];
    var diffL = [];

    // Gaps
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

    //lines
    var lineCompletion = 0;
    var yLineAmount = [];
    for (var y = 0; y < yGridAmount; y++) {
        var lineAmount = 0;
        for(x = 0; x < xGridAmount; x++){
            if(surfaceBlock[x][y] != null){
                lineAmount++;
            }
        }
        yLineAmount.push(lineAmount);
    }
    for (var i = 0; i < shape.length; i++) {
        lineCompletion += yLineAmount[ghostCurrentY + BlockShapePosY[i] - lowestY];
    }
    reward.DELETE = lineCompletion;

    // aggregate height
    var columnHeight = [];

    for(var x = 0; x < xGridAmount; x++){
        var height = 0;
        for(var y = yGridAmount - 1; y >= 0; y--){
            for (var i = 0; i < shape.length; i++) {
                if(surfaceBlock[x][y] != null || (x == BlockGridPosX[i] && y == ghostCurrentY + BlockShapePosY[i] - lowestY)){
                    height = yGridAmount - y;
                }
            }
        }
        columnHeight.push(height);
    }
    const aggregate = (a, c) => a + c;
    reward.HEIGHT = (columnHeight.reduce(aggregate));

    // bump
    var bump = 0;
    for(var i = 0; i < columnHeight.length; i++){
        if(i < columnHeight.length -1 ){
            bump += Math.abs(columnHeight[i+1] - columnHeight[i]);
        }
    }
    reward.BUMP = bump

    // determine highest reward
    var h = ((attributes[shapeIndex].gap + randG[shapeIndex] ) * reward.GAPS) + 
            ((attributes[shapeIndex].delete + randD[shapeIndex] ) * reward.DELETE) + 
            ((attributes[shapeIndex].height + randH[shapeIndex]) * reward.HEIGHT) + 
            ((attributes[shapeIndex].bump + randB[shapeIndex]) * reward.BUMP);   
            
            // var h = (-1  * reward.GAPS) + 
            // (1 * reward.DELETE) + 
            // (-1 * reward.HEIGHT) + 
            // (-1 * reward.BUMP);


    if(h > highestReward || highestReward == null){
        highestReward =  h;
        rot = passes;

        return currentX;
    }
    return aimX;
}

function evaluation(){
    var below = 0;
    var side = 0;

    var lineDeletion = 0;
    var columnHeight = [];
    var aggHeight = 0;

    for (var i = 0; i < shape.length; i++) {
        if(gridCellOccupied[BlockGridPosX[i]][BlockGridPosY[i] + 1] == false){
            below++;
        }
        if(BlockGridPosX[i] != 0){
            if(gridCellOccupied[BlockGridPosX[i] - 1][BlockGridPosY[i]] == false){
                side++;
            }
        }
        if(BlockGridPosX[i] != xGridAmount - 1){
            if(gridCellOccupied[BlockGridPosX[i] + 1][BlockGridPosY[i]] == false){
                side++;
            }
        }
        
        for (var x = 0; x < xGridAmount; x++) {
            if(gridCellOccupied[x][BlockGridPosY[i]] == true){
                lineDeletion++;
            }
        }
    }

    for(var x = 0; x < xGridAmount; x++){
        var height = 0;
        for(var y = yGridAmount - 1; y >= 0; y--){
            if(surfaceBlock[x][y] != null ){
                height = yGridAmount - y;
            } 
        }
        columnHeight.push(height);
    }
    const aggregate = (a, c) => a + c;
    aggHeight = (columnHeight.reduce(aggregate));
    
    var bump = 0;
    for(var i = 0; i < columnHeight.length; i++){
        if(i < columnHeight.length -1 ){
            bump += Math.abs(columnHeight[i+1] - columnHeight[i]);
        }
    }
    
    evaluateMove("gap", side);
    evaluateMove("gap", below);
    evaluateMove("delete", lineDeletion);
    evaluateMove("height", aggHeight);
    evaluateMove("bump", bump);
}

function evaluateMove(typeOfScoreAdd, value){
    switch(typeOfScoreAdd){
        case "line cleared":
            score += 1;
            break;
        case "gap":
            pointG[shapeIndex] += -1 * value;
            break;
        case "delete":
            pointD[shapeIndex] += 1 * value;
            break;
        case "height":
            pointH[shapeIndex] += -1 * value;
            break;
        case "bump":
            pointB[shapeIndex] += -1 * value;
            break;
    }
}

function utility(){
    iter++;
    localStorage.setItem(iterID, iter);

    for(var i = 0; i < attributes.length; i++){
        // if(attributes[i].explore > 0){
        //     if(score - lastClearRate >= 0){
        //         attributes[i].explore -= (score - lastClearRate) * 0.01;
        //     }
        // }
        // else{
        //     attributes[i].explore = 0;
        // }

        var aggLearn = 0;

        if(pointG[i] < attributes[i].pG){
            aggLearn += attributes[i].pG - pointG[i];
            attributes[i].pG  = pointG[i];
            attributes[i].gap += randG[i];
        }
        else if(pointG[i] > attributes[i].pG){
            shiftG *= -2;
        }

        if(pointD[i] > attributes[i].pD){
            aggLearn += attributes[i].pD - pointD[i];
            attributes[i].pD  = pointD[i];
            attributes[i].delete += randD[i];
        }
        else if(pointD[i] < attributes[i].pD){
            shiftD *= -2;
        }

        if(pointH[i] < attributes[i].pH){
            aggLearn += attributes[i].pH - pointH[i];
            attributes[i].pH  = pointH[i];
            attributes[i].height += randH[i];
        }
        else if(pointH[i] > attributes[i].pH){
            shiftH *= -2;
        }

        if(pointB[i] < attributes[i].pB){
            aggLearn += attributes[i].pB - pointB[i];
            attributes[i].pB  = pointB[i];
            attributes[i].bump += randB[i];
        }
        else if(pointB[i] > attributes[i].pB){
            shiftB *= -2;
        }

        
        if(attributes[i].explore > 0){
            attributes[i].explore -= 0.02 * aggLearn;
        }
        else{
            attributes[i].explore = 0;
        }

        if(score - lastClearRate > 0){
            // attributes[i].gap *= (score - lastClearRate);
            // attributes[i].delete *= (score - lastClearRate);
            // attributes[i].height *= (score - lastClearRate);
            // attributes[i].bump *= (score - lastClearRate);
        }
    }
    localStorage.setItem(clearID, score);

    localStorage.setItem(attributesID, JSON.stringify(attributes));
}