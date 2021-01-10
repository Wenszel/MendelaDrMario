"strict mode";
//TODO: one color error
var gameField = {
    fieldDiv: document.createElement("div"),
    currentPill: null,
    pillsOnMap: [],
    virusOnMap: [],
    elements: [], // two-dimensional array, stores grid objects
    fallingInterval: null,
    startGame(){
        document.getElementById("main-page").style.display="none";
        document.body.style.backgroundImage="url('gfx/game-pattern.png')";
        this.initiate();
        this.currentPill = new pill();
        //checks which keys were pressed and changes the position of the pill
        document.onkeydown = function(event){
            const key = event.key;
            switch(key){
                case "ArrowDown": 
                case "s":
                    gameField.currentPill.canMove = false;
                    gameField.createFallingInterval(25);
                    break;
                case "ArrowLeft":
                case "a":
                    gameField.currentPill.moveHorizontal("left");
                    break;
                case "ArrowRight":
                case "d":
                    gameField.currentPill.moveHorizontal("right");
                    break;
                case "ArrowUp":
                case "w":
                    gameField.currentPill.rotate("left");
                    break;
                case "Shift":
                    gameField.currentPill.rotate("right");
                    break;
            }  
        };
    },
    initiate(){ // create game field and fill up elements array
        this.fieldDiv.id = "playground";
        for(let i = 0; i<config.rows; i++){
            let rowArray = [];
            for (let j = 0; j<config.columns; j++){
                let fieldElement = {
                    row: i,
                    column: j,
                    empty: true,
                    color: null,
                    elementDiv: document.createElement("div")
                }
                fieldElement.elementDiv.classList.add("playground-element");
                this.fieldDiv.append(fieldElement.elementDiv);
                rowArray.push(fieldElement);
            }
            this.elements.push(rowArray);
        }
        document.body.appendChild(this.fieldDiv);
        //generate viruses based on information in config
        for(let i = 0; i<config.virusAmount; i++){
            let newVirus = new virus();
            this.virusOnMap.push(newVirus);
        }
    },
    createFallingInterval(time){
        clearInterval(gameField.fallingInterval)
        this.fallingInterval = setInterval(function(){
            //condition that handle situation when pill cant keep falling
            if (gameField.currentPill.isFallible(gameField.currentPill.row[gameField.currentPill.row.length-1], gameField.currentPill.column[0])){
                gameField.currentPill.fallOnce();     
            }else{
                gameField.elementLanded(0,0,0);
                if (gameField.currentPill.direction=="horizontal") {
                    gameField.elementLanded(0,1,1);
                    gameField.breakBlocks(gameField.currentPill.row[0], gameField.currentPill.column[1]);
                }
                else {
                    gameField.elementLanded(1,0,1);
                    gameField.breakBlocks(gameField.currentPill.row[1], gameField.currentPill.column[0]);
                }
                gameField.breakBlocks(gameField.currentPill.row[0], gameField.currentPill.column[0]);
                gameField.pillsOnMap.push(gameField.currentPill);
                gameField.fallElements();
                if(gameField.currentPill.row==0){
                    let gameoverImage = new Image();
                    gameoverImage.src="gfx/gameover.png"
                    gameoverImage.classList.add("gameover-image");
                    document.body.appendChild(gameoverImage);
                    clearInterval(gameField.fallingInterval);
                }else{
                    gameField.currentPill=new pill();
                }
            }        
        },time);
    }, 
    changePillElementsColor(pill, defaultColor){
        if(defaultColor){
            var colors= ["","","",""];
        }else{
            var colors = [
                "url('gfx/"+pill.colors[0]+"_left.png')",
                "url('gfx/"+pill.colors[1]+"_right.png')",
                "url('gfx/"+pill.colors[0]+"_down.png')",
                "url('gfx/"+pill.colors[1]+"_up.png')"
            ]
        }
        if(pill.direction=="horizontal"){
            gameField.elements[pill.row[0]][pill.column[0]].elementDiv.style.backgroundImage = colors[0];
            gameField.elements[pill.row[0]][pill.column[1]].elementDiv.style.backgroundImage = colors[1];
        }
        else if(pill.direction=="vertical"){
            gameField.elements[pill.row[0]][pill.column[0]].elementDiv.style.backgroundImage = colors[2];
            gameField.elements[pill.row[1]][pill.column[0]].elementDiv.style.backgroundImage = colors[3];
        }
    },
    breakBlocks(row, column){
        let sameColorElementsHorizontal = [];
        let sameColorElementsVertical = [];
        for(let i = 0; i+row<config.rows; i++){
            if(gameField.elements[row][column].color != gameField.elements[row+i][column].color) break;
            sameColorElementsVertical.push([row+i,column]);
        }
        for(let i = -1; row+i>=0; i--){
            if(gameField.elements[row][column].color != gameField.elements[row+i][column].color) break;
            sameColorElementsVertical.push([row+i,column]);
        }
        for(let i = 0; column+i>=0; i--){
            if(gameField.elements[row][column].color != gameField.elements[row][column+i].color) break;
            sameColorElementsHorizontal.push([row,column+i]);
        }
        for(let i = 1; i+column<config.columns; i++){
            if(gameField.elements[row][column].color != gameField.elements[row][column+i].color) break;
             sameColorElementsHorizontal.push([row,column+i]);
        }
        if(sameColorElementsHorizontal.length>=4 || sameColorElementsVertical.length>=4){
            let breakElement = function(cordinates){
                gameField.elements[cordinates[0]][cordinates[1]].color = null;
                gameField.elements[cordinates[0]][cordinates[1]].empty = true;
                gameField.elements[cordinates[0]][cordinates[1]].elementDiv.style.backgroundImage = null;
            }
            localStorage.setItem("points",0);
            gameField.virusOnMap.forEach((virus)=>{
                if(gameField.elements[virus.row][virus.column].empty){
                    localStorage.setItem("points",parseInt(localStorage.getItem("points"))+100);
                }
            });
            sameColorElementsHorizontal.forEach((cordinates) => {breakElement(cordinates)});
            sameColorElementsVertical.forEach((cordinates) => {breakElement(cordinates)});
        }
    },
    //set gamefield elements as taken by pill and checks if blocks can be break
    elementLanded(row,column,color){
        gameField.elements[gameField.currentPill.row[row]][gameField.currentPill.column[column]].empty = false;
        gameField.elements[gameField.currentPill.row[row]][gameField.currentPill.column[column]].color = gameField.currentPill.colors[color];
        
    },
    findPillByCordinates(rows,columns){
        let pill = this.pillsOnMap.find((i)=>{
            i.row=rows;
            i.column=columns;
        })
        return pill;
    },
    fallElements(){

    }
};