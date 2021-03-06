"use strict";
class pill {
    constructor(){
        this.row = [1];
        this.column = [3,4]; //bottle neck cords
        this.colors = pill.generateColors();
        this.direction = "horizontal";
        this.canMove = false;

        //Preview pill generate
        let pillElement = document.createElement("pill");
        pillElement.id="pill"
        pillElement.style.left="22px";
        pillElement.style.top="22px";

        let firstPreviewPillPart = document.createElement("div");
        firstPreviewPillPart.id="first-part";
        firstPreviewPillPart.classList.add("pill-part");
        firstPreviewPillPart.style.backgroundImage=`url('gfx/game-elements/${this.colors[0]}_left.png')`;

        let secondPreviewPillPart = document.createElement("div");
        secondPreviewPillPart.id="second-part";
        secondPreviewPillPart.classList.add("pill-part");
        secondPreviewPillPart.style.backgroundImage=`url('gfx/game-elements/${this.colors[1]}_right.png')`;

        pillElement.appendChild(firstPreviewPillPart);
        pillElement.appendChild(secondPreviewPillPart);
        document.getElementById("doctor").appendChild(pillElement);
    } 
    generate(){
            this.canMove = true;
            gameField.changePillElementsColor(this);
            gameField.createFallingInterval(config.speed, this);
    } 
    throw(){
        let pill = document.getElementById("pill");
        let path =[[-22,22,0],[-22,22,1],[-22,0,1],[-22,0,1],[-22,0,1],[-22,0,1],[-22,0,1],[-22,0,1],[-22,0,1],[-22,0,1],[-22,-22,1],[-22,-22,0],[0,-22,0],[0,-22,0]];
        let deg = [0,90,360,270];
        let counter = 0;
        let throwingInterval = setInterval(()=>{
            let parseTopValue = parseInt(pill.style.top);
            let parseLeftValue = parseInt(pill.style.left);
            pill.style.left = parseLeftValue+path[counter][0]+"px";
            pill.style.top = parseTopValue-path[counter][1]+"px";
            if(path[counter][2]==1){
                pill.style.webkitTransform = 'rotate('+deg[counter%4]+'deg)'; 
                pill.style.mozTransform    = 'rotate('+deg[counter%4]+'deg)'; 
                pill.style.msTransform     = 'rotate('+deg[counter%4]+'deg)'; 
                pill.style.oTransform      = 'rotate('+deg[counter%4]+'deg)'; 
                pill.style.transform       = 'rotate('+deg[counter%4]+'deg)'; 
            }
            counter++;
            if(counter==path.length){
                setTimeout(()=>{
                    gameField.currentPill.generate();
                    document.getElementById("doctor").removeChild(document.getElementById("pill"));
                },120)
                clearInterval(throwingInterval);
            }
        },30);
    }
    fallOnce(){
        gameField.changePillElementsColor(this, true);
        this.row[0]++;
        if(this.direction=="vertical") this.row[1]++
        gameField.changePillElementsColor(this, false);
    }
    moveHorizontal(side){
        if(this.canMove){
            let {elements, currentPill, changePillElementsColor} = gameField;
            changePillElementsColor(this, true);
            if(side == "left" && this.column[0]-1>=0){
                if(this.direction=="horizontal" && elements[currentPill.row][this.column[0]-1].empty){
                    this.column = [this.column[0]-1, this.column[1]-1];
                }else if(this.direction=="vertical" && elements[currentPill.row[0]][this.column[0]-1].empty && elements[currentPill.row[1]][this.column[0]-1].empty){
                    this.column = [this.column[0]-1];
                }
            }
            else if(side == "right" && ((this.direction=="horizontal" && this.column[1]<config.columns-1)||(this.direction=="vertical" && this.column[0]<config.columns-1))){
                if(this.direction=="horizontal" && elements[currentPill.row][this.column[1]+1].empty){
                    this.column = [this.column[0]+1, this.column[1]+1];
                }else if (this.direction=="vertical" && elements[currentPill.row[0]][this.column[0]+1].empty && gameField.elements[gameField.currentPill.row[1]][this.column[0]+1].empty){
                    this.column = [this.column[0]+1];
                }
            }
            changePillElementsColor(this, false);
        }
    }
    rotate(side){
        if(this.canMove){
            if((this.direction=="horizontal" && gameField.elements[this.row[0]-1][this.column[0]].empty)||this.direction=="vertical"){
                if(this.direction=="vertical" && this.column[0]==config.columns-1){
                    if(!gameField.elements[this.row[0]][this.column[0]-1].empty){
                        return false;
                    }
                }
                else if(this.direction=="vertical"){
                    if(!gameField.elements[this.row[0]][this.column[0]+1].empty){
                        return false;
                    }
                }
                gameField.changePillElementsColor(this, true);
                if(this.direction=="horizontal") {
                    this.direction="vertical";
                    this.column = [this.column[0]];
                    this.row = [this.row[0],this.row[0]-1];
                    if(side=="right") this.colors = this.colors.reverse();
                }
                else{
                    if(this.column[0]==config.columns-1){ //situation when pill is horizontal on right side of map
                        this.column = [this.column[0]-1,this.column[0]];
                    }else{
                        this.column = [this.column[0],this.column[0]+1];
                    }
                    this.direction="horizontal";
                    this.row = [this.row[0]];
                    if(side=="left") this.colors = this.colors.reverse();   
                }
                gameField.changePillElementsColor(this, false);
            }
        }
    }
    isFallible(){
        //check if fields below pill are empty and in rows scope
        let row = this.row[this.row.length-1];
        let column = this.column[0];
        try{
            if(this.direction=="horizontal"){
                if(gameField.elements[row+1][column].empty && gameField.elements[row+1][column+1].empty){
                    return true;
                }else{
                    return false;
                }
            }else if(this.direction=="vertical"){
                if(gameField.elements[row+2][column].empty){
                    return true;
                }else{
                    return false;
                }  
            }else{
                if(gameField.elements[row+1][column].empty){
                    return true;
                }else{
                    return false;
                }  
            } 
        }catch (error){ //Type error is coused by trying to access gamefield element that is out of range
            if (error instanceof TypeError){
                return false;
            }   
        }
    }
    //set gamefield elements as taken by pill and checks if blocks can be break
    landed(){
        let changeElementProperties = (row, column, color) => {
            gameField.elements[row][column].empty = false;
            gameField.elements[row][column].color = this.colors[color];
        }
        if(this.row.length>this.column.length){
            this.row.forEach((item, index) => changeElementProperties(item, this.column[0], index));
        }else if(this.row.length<this.column.length){
            this.column.forEach((item, index) => changeElementProperties(this.row[0], item, index));
        }else if(this.row.length==this.column.length){
            changeElementProperties(this.row[0], this.column[0], 0);
        }
    }
    released(){
        let changeElementProperties = (row, column) => {
            gameField.elements[row][column].empty = true;
            gameField.elements[row][column].color = null;
        }
        if(this.row.length>this.column.length){
            this.row.forEach((item) => changeElementProperties(item, this.column[0]));
        }else if(this.row.length<this.column.length){
            this.column.forEach((item) => changeElementProperties(this.row[0], item));
        }else if(this.row.length==this.column.length){
            changeElementProperties(this.row[0], this.column[0]);
        }
    }
    static generateColors(){
        let colors = [];
        for(let i = 0; i<2; i++){
            colors.push(config.colors[Math.floor(Math.random()*config.colors.length)]);
        }
        return colors;
    }
};
