"strict mode";
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
                    gameField.createFallingInterval(25, gameField.currentPill);
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
        let scoreBoard = document.createElement("div");
        scoreBoard.classList.add("scoreboard");
        document.body.appendChild(scoreBoard)
    },
    createFallingInterval(time, fallingPill){
        clearInterval(gameField.fallingInterval)
        this.fallingInterval = setInterval(function(){
            let {pillsOnMap, currentPill, breakBlocks} = gameField;
            //condition that handle situation when pill cant keep falling
            if (fallingPill.isFallible()){
                fallingPill.fallOnce();     
            }else{
                fallingPill.landed();
                pillsOnMap.push(fallingPill);
                breakBlocks(fallingPill);
                if(currentPill==fallingPill){
                    
                   // gameField.fallElements();
                if(currentPill.row==0){
                    let gameoverImage = new Image();
                    gameoverImage.src="gfx/gameover.png"
                    gameoverImage.classList.add("gameover-image");
                    document.body.appendChild(gameoverImage);
                    clearInterval(gameField.fallingInterval);
                }else{
                    gameField.currentPill=new pill();
                }
                }
            }        
        },time);
    }, 
    changePillElementsColor(pill, defaultColor){
        let {elements} = gameField;
        if(defaultColor){
            var colors= ["","","","",""];
        }else{
            var colors = [
                "url('gfx/"+pill.colors[0]+"_left.png')",
                "url('gfx/"+pill.colors[1]+"_right.png')",
                "url('gfx/"+pill.colors[0]+"_down.png')",
                "url('gfx/"+pill.colors[1]+"_up.png')",
                "url('gfx/"+pill.colors[0]+"_dot.png')"
            ]
        }
        if(pill.direction=="horizontal"){
            elements[pill.row[0]][pill.column[0]].elementDiv.style.backgroundImage = colors[0];
            elements[pill.row[0]][pill.column[1]].elementDiv.style.backgroundImage = colors[1];
        }
        else if(pill.direction=="vertical"){
            elements[pill.row[0]][pill.column[0]].elementDiv.style.backgroundImage = colors[2];
            elements[pill.row[1]][pill.column[0]].elementDiv.style.backgroundImage = colors[3];
        }
        else if(pill.direction=="dot"){
            elements[pill.row[0]][pill.column[0]].elementDiv.style.backgroundImage = colors[4];
        }
    },
    breakBlocks(pill){
        let breakBlocksMethod = (row, column)=>{
            let sameColorElementsHorizontal = [];
            let sameColorElementsVertical = [];
            let {elements, virusOnMap} = gameField;
            for(let i = 0; i+row<config.rows; i++){
                if(elements[row][column].color != elements[row+i][column].color) break;
                sameColorElementsVertical.push([row+i,column]);
            }
            for(let i = -1; row+i>=0; i--){
                if(elements[row][column].color != elements[row+i][column].color) break;
                sameColorElementsVertical.push([row+i,column]);
            }
            for(let i = 0; column+i>=0; i--){
                if(elements[row][column].color != elements[row][column+i].color) break;
                sameColorElementsHorizontal.push([row,column+i]);
            }
            for(let i = 1; i+column<config.columns; i++){
                if(elements[row][column].color != elements[row][column+i].color) break;
                sameColorElementsHorizontal.push([row,column+i]);
            }
            if(sameColorElementsHorizontal.length>=4 || sameColorElementsVertical.length>=4){
                let breakElement = function(cordinates){
                    elements[cordinates[0]][cordinates[1]].color = null;
                    elements[cordinates[0]][cordinates[1]].empty = true;
                    elements[cordinates[0]][cordinates[1]].elementDiv.style.backgroundImage = null;
                    let breakingPill = gameField.pillsOnMap.find(i => (i.row.includes(cordinates[0])&&i.column.includes(cordinates[1])));
                    if(breakingPill!=undefined){
                        if(breakingPill.direction=="vertical"){
                        let index = breakingPill.row.indexOf(cordinates[0])
                        breakingPill.row.splice(index, 1);
                        breakingPill.colors.splice(index, 1);
                        }else{
                        let index = breakingPill.column.indexOf(cordinates[1])
                        breakingPill.column.splice(index, 1);   
                        breakingPill.colors.splice(index, 1);
                        }
                    breakingPill.direction="dot";
                    if(!(breakingPill.row.length==0 || breakingPill.column.length==0)){
                        gameField.changePillElementsColor(breakingPill, false);
                    }else{
                        gameField.pillsOnMap.splice(gameField.pillsOnMap.indexOf(breakingPill),1);
                    }
                    }
                }    
                    sameColorElementsHorizontal.forEach((cordinates) => {breakElement(cordinates)});
                    sameColorElementsVertical.forEach((cordinates) => {breakElement(cordinates)});
           
                localStorage.setItem("points",0);
                virusOnMap.forEach((virus)=>{
                    if(elements[virus.row][virus.column].empty){
                        localStorage.setItem("points",parseInt(localStorage.getItem("points"))+100);
                        
                        document.getElementsByClassName("scoreboard")[0].textContent = localStorage.getItem("points");
                    }
                });    
                }
            }
        if(pill.row.length>pill.column.length){
            pill.row.forEach(item => breakBlocksMethod(item, pill.column[0]));
        }else if(pill.row.length<pill.column.length){
            pill.column.forEach(item => breakBlocksMethod(pill.row[0], item));
        }else if(pill.row.length==this.column.length){
            breakBlocksMethod(pill.row[0], pill.column[0]);
        }
    },
    findPillByCordinates(rows,columns){
        let pill = this.pillsOnMap.find((i)=>{
            i.row=rows;
            i.column=columns;
        });
        return pill;
    },
    fallElements(){
        gameField.pillsOnMap.forEach(pill=>{
            gameField.createFallingInterval(10,pill);
        });
    }
};