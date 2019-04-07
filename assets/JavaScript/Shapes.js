var numShapes = 7;
// var rand = Math.floor((Math.random() * numShapes) + 1);
var rand = 1;
var shapeIndex = rand - 1;

// UI Image to show at top of the screen 
function nextShapeDisplay(){
    switch(rand){
        case 1:
            // J Shape
            return new image(0, 0,"J.jpg", 0, 0);
            break;
        case 2:
            // L Shape
            return new image(0, 0,"L.jpg", 0, 0);
            break;
        case 3:
            // Z Shape
            return new image(0, 0,"Z.jpg", 0, 0);
            break;
        case 4:
            // S Shape
            return new image(0, 0,"S.jpg", 0, 0);
            break;
        case 5:
            // O Shape
            return new image(0, 0,"O.jpg", 0, 0);
            break;
        case 6:
            // I Shape
            return new image(0, 0,"I.jpg", 0, 0);
            break;
        case 7:
            // T Shape
            return new image(0, 0,"T.jpg", 0, 0);
            break;
    }
}

// new shape before returning new array sets rand to 
//random value to be read by nextShapeDisplay
function CreateShape(){
    shapeIndex = rand - 1;
    var blocks = [];
    switch(rand){
        case 1:
            // J Shape
            blocks.push(new image(0, 0,"BlueBlock.jpg"));
            blocks.push(new image(0, 1,"BlueBlock.jpg"));
            blocks.push(new image(1, 1,"BlueBlock.jpg"));
            blocks.push(new image(2, 1,"BlueBlock.jpg"));
            break;
        case 2:
            // L Shape
            blocks.push(new image(0, 1,"OrangeBlock.jpg", 0, 0));
            blocks.push(new image(1, 1,"OrangeBlock.jpg", 0, 0));
            blocks.push(new image(2, 1,"OrangeBlock.jpg", 0, 0));
            blocks.push(new image(2, 0,"OrangeBlock.jpg", 0, 0));
            break;
        case 3:
            // Z Shape
            blocks.push(new image(0, 0,"RedBlock.jpg", 0, 0));
            blocks.push(new image(1, 0,"RedBlock.jpg", 0, 0));
            blocks.push(new image(1, 1,"RedBlock.jpg", 0, 0));
            blocks.push(new image(2, 1,"RedBlock.jpg", 0, 0));
            break;
        case 4:
            // S Shape
            blocks.push(new image(0, 1,"BrownBlock.jpg", 0, 0));
            blocks.push(new image(1, 1,"BrownBlock.jpg", 0, 0));
            blocks.push(new image(1, 0,"BrownBlock.jpg", 0, 0));
            blocks.push(new image(2, 0,"BrownBlock.jpg", 0, 0));
            break;
        case 5:
            // O Shape
            blocks.push(new image(0, 0,"YellowBlock.jpg", 0, 0));
            blocks.push(new image(0, 1,"YellowBlock.jpg", 0, 0));
            blocks.push(new image(1, 1,"YellowBlock.jpg", 0, 0));
            blocks.push(new image(1, 0,"YellowBlock.jpg", 0, 0));
            break;
        case 6:
            // I Shape
            blocks.push(new image(0, 0,"CyanBlock.jpg", 0, 0));
            blocks.push(new image(1, 0,"CyanBlock.jpg", 0, 0));
            blocks.push(new image(2, 0,"CyanBlock.jpg", 0, 0));
            blocks.push(new image(3, 0,"CyanBlock.jpg", 0, 0));
            break;
        case 7:
            // T Shape
            blocks.push(new image(0, 1,"MagentaBlock.jpg", 0, 0));
            blocks.push(new image(1, 1,"MagentaBlock.jpg", 0, 0));
            blocks.push(new image(1, 0,"MagentaBlock.jpg", 0, 0));
            blocks.push(new image(2, 1,"MagentaBlock.jpg", 0, 0));
            break;
        }
        // rand = Math.floor((Math.random() * numShapes) + 1);
        rand ++;
        if(rand > 7){
            rand = 1;
        }
        return blocks;
}

// return outline blocks
function createGhostShape(){
    var ghostBlocks = [];
    ghostBlocks.push(new image(0, 0,"GreyBlock.png"));
    ghostBlocks.push(new image(0, 0,"GreyBlock.png"));
    ghostBlocks.push(new image(0, 0,"GreyBlock.png"));
    ghostBlocks.push(new image(0, 0,"GreyBlock.png"));
    return ghostBlocks;
}