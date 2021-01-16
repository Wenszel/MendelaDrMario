"strict mode";
var gameField = {
    fieldDiv: null,
    currentPill: null,
    waitingPill: null, //preview pill
    pillsOnMap: [], //this propertie helps changing pill into dot
    virusOnMap: [], //stores viruses on map, is used for virus in loupe animations
    elements: [], // two-dimensional array, stores grid objects
    fallingInterval: null,
    level: 1,
    brokenViruses: 0, // count broken viruses in whole game
    startGame(){
        document.getElementById("main-page").style.display="none";
        document.body.style.backgroundImage="url('gfx/gamepatterns/game-pattern-1.png')";
        this.initiate();
        gameInterface.initiate();
        //checks which keys were pressed and changes the position of the pill
        let fired = false; //this variable prevent holding key error
        document.onkeydown = function(event){
            if(!fired){
                fired = true;
                const key = event.key;
                switch(key){
                    case "ArrowDown": 
                    case "s":
                            gameField.currentPill.canMove = false; //if false other moves are blocked
                            gameField.createFallingInterval(25); //fast falling
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
        //when key is up onkeydown can be triggered again
        document.onkeyup = function(){
            fired = false;
        }
    },
    stageCompleted(){
        //adds stage complited info image
        let stageComplitedImage = new Image();
        stageComplitedImage.src="gfx/interface-elements/stagecompleted.png"
        stageComplitedImage.classList.add("gameinfo-image");
        document.body.appendChild(stageComplitedImage);
        //falling stoped
        clearInterval(gameField.fallingInterval);
        //preview pill removed
        document.getElementById("pill").remove();
        //after one second next level is generated
        setTimeout(()=>{
            //deletes stage complited image
            document.body.removeChild(stageComplitedImage);
            //set new pattern on background
            document.body.style.backgroundImage=`url('gfx/gamepatterns/game-pattern-${gameField.level}.png')`;
            //every level there is one more virus on map
            config.virusAmount++;
            //changes virus amount and level on table
            gameInterface.changeVirusAmount();
            gameInterface.changeLevel();
            //empty gameField properties
            gameField.currentPill= null;
            gameField.pillsOnMap= [];
            gameField.virusOnMap= [];
            gameField.elements= [];
            gameField.fallingInterval= null;
            document.getElementById("playground").removeChild(gameField.fieldDiv);
            //next level starts
            gameField.initiate();
        },1000);
    },
    gameOver(){
        //removes preview
        document.getElementById("pill").remove();
        //adds game over info image
        let gameoverImage = new Image();
        gameoverImage.src="gfx/interface-elements/gameover.png"
        gameoverImage.classList.add("gameinfo-image");
        document.body.appendChild(gameoverImage);
        //updates interface with new doctor image
        gameInterface.doctor.style.backgroundImage= 'url("gfx/interface-elements/gameover_doctor.png")';
        //checkes if score is higher than last top score
        gameInterface.changeTopScore();
        localStorage.setItem("points",0);
        clearInterval(gameField.fallingInterval);
    },
    initiate(){ 
        // create game field and fill up elements array
        document.getElementById("playground").style.display="block";
        this.fieldDiv=document.createElement("div")
        this.fieldDiv.id = "playgroundContent";
        for(let i = 0; i<=config.rows; i++){
            let rowArray = [];
            for (let j = 0; j<config.columns; j++){
                let fieldElement = {
                    row: i,
                    column: j,
                    empty: true,
                    color: null,
                    elementDiv: document.createElement("div")
                }
                //bottle neck
                if((j<3||j>4)&&i==0){
                    fieldElement.empty=false;
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
        //creates pill, throw it and change doctor image
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
            let {pillsOnMap, currentPill, virusOnMap} = gameField;
            if(virusOnMap.length==0){ //when there is no more viruses on map
                gameField.stageCompleted();
            }else if (currentPill.isFallible()){ //when pill can fall
                currentPill.fallOnce();     
            }else{ //when pill cant keeps falling
                currentPill.landed(); 
                pillsOnMap.push(currentPill);
                gameField.breakBlocks(currentPill);
                gameField.fallElements();
                if(currentPill.row==1){ //pill on top of the bottle
                    gameField.gameOver();
                }else{
                    clearInterval(gameField.fallingInterval)
                    gameField.currentPill = gameField.waitingPill;
                    gameField.currentPill.throw();
                    gameInterface.doctor.style.backgroundImage="url('gfx/interface-elements/doctor_hand_down.png')";
                    setTimeout(()=>{
                        gameInterface.doctor.style.backgroundImage="url('gfx/interface-elements/doctor_hand_up.png')";
                        gameField.waitingPill = new pill();
                     },time);   
                }    
            }        
        },time);
    }, 
    //changes gamefield elements to pill colors
    changePillElementsColor(pill, empty){  //param empty true if we want to empty gamefield elements
        let {elements} = gameField;
        if(empty){
            var colors= ["","","","",""];
        }else{
            var colors = [
                `url('gfx/game-elements/${pill.colors[0]}_left.png')`,
                `url('gfx/game-elements/${pill.colors[1]}_right.png')`,
                `url('gfx/game-elements/${pill.colors[0]}_down.png')`,
                `url('gfx/game-elements/${pill.colors[1]}_up.png')`,
                `url('gfx/game-elements/${pill.colors[0]}_dot.png')`
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
    //this function finds same color elements in the neighbourhood of fallen pill
    breakBlocks(pill){
        let breakBlocksMethod = function(row, column){
            let {elements, virusOnMap, brokenViruses} = gameField;
            let sameColorElementsHorizontal = [];
            let sameColorElementsVertical = [];
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
            //if there is four the same color in row break elements
            if(sameColorElementsHorizontal.length>=4 || sameColorElementsVertical.length>=4){
                let breakElement = function(cordinates){  
                    //checkes is virus on cords
                    let virus = virusOnMap.find(i=>{
                        if(i.row==cordinates[0] && i.column==cordinates[1]) return true;
                    });
                    //if yes changes element background to broken virus and delete virus from array 
                    if(virus!=undefined){
                        elements[cordinates[0]][cordinates[1]].elementDiv.style.backgroundImage = `url('gfx/game-elements/${elements[cordinates[0]][cordinates[1]].color}_x.png')` 
                        virusOnMap.splice(virusOnMap.indexOf(virus),1);
                        //updates interface
                        document.getElementById("virus-amount").innerText=virusOnMap.length;
                        brokenViruses++;
                        }
                    //else changes element background to broken pill
                    else{
                        elements[cordinates[0]][cordinates[1]].elementDiv.style.backgroundImage = `url('gfx/game-elements/${elements[cordinates[0]][cordinates[1]].color}_o.png')`
                    }
                    elements[cordinates[0]][cordinates[1]].color = null;
                    elements[cordinates[0]][cordinates[1]].empty = true;   
                    //after few seconds element's background empty
                    setTimeout(function(){elements[cordinates[0]][cordinates[1]].elementDiv.style.backgroundImage = null},50);
                    //finds which pill is breaking
                    let breakingPill = gameField.pillsOnMap.find(i => (i.row.includes(cordinates[0])&&i.column.includes(cordinates[1])));
                    if(breakingPill!=undefined){
                        //updates pill properties with new cords, colors and direction 
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
                        if(!(breakingPill.row.length==0 || breakingPill.column.length==0)){//if pill isnt complitly deleted generate it on map
                            gameField.changePillElementsColor(breakingPill, false);
                        }else{
                            gameField.pillsOnMap.splice(gameField.pillsOnMap.indexOf(breakingPill),1); //else delete it from array
                        }
                    }
                }    
                sameColorElementsHorizontal.splice(0,1); //same horizontal and vertical has first cord the same so it deletes first value from array
                sameColorElementsHorizontal.forEach((cordinates) => {breakElement(cordinates)});
                sameColorElementsVertical.forEach((cordinates) => {breakElement(cordinates)});
                gameInterface.changeCurrentScore();
                return true;
                }else{
                    return false;
                }
            }
        if(pill.row.length>pill.column.length){ //if pill horizontally
            pill.row.forEach(item => breakBlocksMethod(item, pill.column[0]));
        }else if(pill.row.length<pill.column.length){ //if pill vertically
            pill.column.forEach(item => breakBlocksMethod(pill.row[0], item)); 
        }else if(pill.row.length==pill.column.length){//if pill is dot
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
            fallingPill.released(); //this method makes field elements empty
            let interval = setInterval(function(){
                if (fallingPill.isFallible()){
                    fallingPill.fallOnce();     
                }else{
                    fallingPill.landed();
                    isBrokenAnyPill = gameField.breakBlocks(fallingPill); 
                    if(isBrokenAnyPill) gameField.fallElements(); //while there is any broken pill on map triggers falling function
                    clearInterval(interval);    
                }        
            },60);  
        });
    }
};