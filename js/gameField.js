"strict mode";
var gameField = {
    fieldDiv: null,
    currentPill: null,
    waitingPill: null,
    pillsOnMap: [],
    virusOnMap: [],
    elements: [], // two-dimensional array, stores grid objects
    fallingInterval: null,
    level: 1,
    brokenViruses: 0,
    startGame(){
        document.getElementById("main-page").style.display="none";
        document.body.style.backgroundImage="url('gfx/gamepatterns/game-pattern-1.png')";
        this.initiate();
        gameInterface.initiate();
        let fired = false;
        //checks which keys were pressed and changes the position of the pill
        document.onkeydown = function(event){
            if(!fired){
                fired = true;
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
            } 
        };
        document.onkeyup = function(){
            fired = false;
        }
    },
    stageCompleted(){
        let stageComplitedImage = new Image();
        stageComplitedImage.src="gfx/interface-elements/stagecompleted.png"
        stageComplitedImage.classList.add("gameinfo-image");
        document.body.appendChild(stageComplitedImage);
        clearInterval(gameField.fallingInterval);
        setTimeout(()=>{
            document.body.removeChild(stageComplitedImage);
            gameInterface.changeLevel();
            document.body.style.backgroundImage="url('gfx/gamepatterns/game-pattern-"+gameField.level+".png')";
            config.virusAmount++;
            gameInterface.changeVirusAmount();
            gameField.currentPill= null;
            gameField.pillsOnMap= [];
            gameField.virusOnMap= [];
            gameField.elements= [];
            gameField.fallingInterval= null;
            document.body.removeChild(gameField.fieldDiv);
            gameField.initiate();
        },1000);
    },
    gameOver(){
        let gameoverImage = new Image();
        gameoverImage.src="gfx/interface-elements/gameover.png"
        gameoverImage.classList.add("gameinfo-image");
        gameInterface.doctor.style.backgroundImage= 'url("gfx/interface-elements/gameover_doctor.png")';
        document.body.appendChild(gameoverImage);
        gameInterface.changeTopScore();
        localStorage.setItem("points",0);
        clearInterval(gameField.fallingInterval);
    },
    initiate(){ // create game field and fill up elements array
        document.getElementById("playground").style.display="block";
        this.fieldDiv=document.createElement("div")
        this.fieldDiv.id = "playgroundContent";
        let rowArray = [];
        //bottle neck
        for(let i=0; i<config.columns; i++){
            let fieldElement = {
                row: 0,
                column: i,
                empty: true,
                color: null,
                elementDiv: document.createElement("div")
            }
            if(i<3||i>4){
                fieldElement.empty=false;
            }
            fieldElement.elementDiv.classList.add("playground-element");
            this.fieldDiv.append(fieldElement.elementDiv);
            rowArray.push(fieldElement);
        }
        this.elements.push(rowArray);
        for(let i = 1; i<=config.rows; i++){
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
        document.getElementById("playground").appendChild(this.fieldDiv);
        //generate viruses based on information in config
        for(let i = 0; i<config.virusAmount; i++){
            let newVirus = new virus(i);
            this.virusOnMap.push(newVirus);
        }
        this.currentPill = new pill();
        this.currentPill.throw();
        gameInterface.doctor.style.backgroundImage="url('gfx/interface-elements/doctor_hand_down.png')";
        setTimeout(()=>{
            gameInterface.doctor.style.backgroundImage="url('gfx/interface-elements/doctor_hand_up.png')";
            this.waitingPill = new pill();
        },750);  
    },
     createFallingInterval(time){
        clearInterval(gameField.fallingInterval)
        this.fallingInterval = setInterval(function(){
            let {pillsOnMap, currentPill, virusOnMap, breakBlocks} = gameField;
            //condition that handle situation when pill cant keep falling
            if(virusOnMap.length==0){
                gameField.stageCompleted();
            }else if (currentPill.isFallible()){
                currentPill.fallOnce();     
            }else{
                currentPill.landed();
                pillsOnMap.push(currentPill);
                breakBlocks(currentPill);
                gameField.fallElements();
                if(currentPill.row==1){
                    gameField.gameOver();
                    document.getElementById("pill").remove();
                }else{
                    gameField.currentPill = gameField.waitingPill;
                    gameField.currentPill.throw();
                    gameInterface.doctor.style.backgroundImage="url('gfx/interface-elements/doctor_hand_down.png')";
                    setTimeout(()=>{
                        gameInterface.doctor.style.backgroundImage="url('gfx/interface-elements/doctor_hand_up.png')";
                        gameField.waitingPill = new pill();
                     },time);
                     clearInterval(gameField.fallingInterval)
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
                "url('gfx/game-elements/"+pill.colors[0]+"_left.png')",
                "url('gfx/game-elements/"+pill.colors[1]+"_right.png')",
                "url('gfx/game-elements/"+pill.colors[0]+"_down.png')",
                "url('gfx/game-elements/"+pill.colors[1]+"_up.png')",
                "url('gfx/game-elements/"+pill.colors[0]+"_dot.png')"
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
        let breakBlocksMethod = function(row, column){
            let sameColorElementsHorizontal = [];
            let sameColorElementsVertical = [];
            let {elements, virusOnMap} = gameField;
            for(let i = 0; i+row<config.rows+1; i++){
                if(elements[row][column].color != elements[row+i][column].color) break;
                sameColorElementsVertical.push([row+i,column]);
            }
            for(let i = -1; row+i>=1; i--){
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
                    let virus = virusOnMap.find(i=>{
                        if(i.row==cordinates[0] && i.column==cordinates[1]) return true;
                    });
                    if(virus!=undefined){
                        elements[cordinates[0]][cordinates[1]].elementDiv.style.backgroundImage = "url('gfx/game-elements/"+elements[cordinates[0]][cordinates[1]].color+"_x.png')" 
                        gameField.virusOnMap.splice(gameField.virusOnMap.indexOf(virus),1);
                        document.getElementById("virus-amount").innerText=gameField.virusOnMap.length;
                        gameField.brokenViruses++;
                        }
                    else{
                        elements[cordinates[0]][cordinates[1]].elementDiv.style.backgroundImage = "url('gfx/game-elements/"+elements[cordinates[0]][cordinates[1]].color+"_o.png')"
                    }
                    elements[cordinates[0]][cordinates[1]].color = null;
                    elements[cordinates[0]][cordinates[1]].empty = true;   
                    setTimeout(function(){elements[cordinates[0]][cordinates[1]].elementDiv.style.backgroundImage = null},50);
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
                sameColorElementsHorizontal.splice(0,1);
                sameColorElementsHorizontal.forEach((cordinates) => {breakElement(cordinates)});
                sameColorElementsVertical.forEach((cordinates) => {breakElement(cordinates)});

                gameInterface.changeCurrentScore();
                return true;
                }else{
                    return false;
                }
            }
        if(pill.row.length>pill.column.length){
            pill.row.forEach(item => breakBlocksMethod(item, pill.column[0]));
        }else if(pill.row.length<pill.column.length){
            pill.column.forEach(item => breakBlocksMethod(pill.row[0], item));
        }else if(pill.row.length==pill.column.length){
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
        gameField.pillsOnMap.forEach(fallingPill=>{
            fallingPill.released();
            let interval = setInterval(function(){
                if (fallingPill.isFallible()){
                    fallingPill.fallOnce();     
                }else{
                    fallingPill.landed();
                    isBrokenAnyPill = gameField.breakBlocks(fallingPill); 
                    if(isBrokenAnyPill)gameField.fallElements();
                    clearInterval(interval);    
                }        
            },60);  
        });
    }
};