"strict mode";
var gameField = {
    fieldDiv: document.createElement("div"),
    currentPill: new pill(),
    elements: [], // two-dimensional array, stores grid objects
    fallingInterval: null,
    startGame(){
        document.getElementById("main-page").style.display="none";
        document.body.style.backgroundImage="url('gfx/game-pattern.png')";
        this.initiate();
        this.currentPill.generate();
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
        for(let i = 0; i<config.virusAmount; i++){
            let newVirus = new virus();
            newVirus.generate();
        }
    },
    createFallingInterval(time){
        clearInterval(gameField.fallingInterval)
        this.fallingInterval = setInterval(function(){
            gameField.currentPill.fallOnce();  
            if (!gameField.currentPill.isFallible(gameField.currentPill.row[gameField.currentPill.row.length-1], gameField.currentPill.column[0])){
                gameField.elementLanded(0,0,0);
                if (gameField.currentPill.direction=="horizontal") gameField.elementLanded(0,1,1);
                else gameField.elementLanded(1,0,1);
                gameField.currentPill=new pill();
                gameField.currentPill.generate();
            }    
        },time);
    }, 
    changePillElementsColor(pill, defaultColor){
        if(defaultColor){
            var colors=[config.backgroundColor, config.backgroundColor];
        }else{
            var colors = pill.colors
        }
        if(pill.direction=="horizontal"){
            pill.column.forEach((columnIndex, arrayIndex)=>{
                gameField.elements[pill.row[0]][columnIndex].elementDiv.style.backgroundColor = colors[arrayIndex];
            });
        }
        else if(pill.direction=="vertical"){
            pill.row.forEach((rowIndex, arrayIndex)=>{
                gameField.elements[rowIndex][pill.column[0]].elementDiv.style.backgroundColor = colors[arrayIndex];
            });
        }
    },
    breakBlocks(row, column){
        //zbijanie 4 wertykalnie
        var counter = 0
        try{
        
        while(gameField.elements[row][column].color == gameField.elements[row+counter][column].color){
            counter++
        }
        if(counter>=4){
            while(counter>=0){
                gameField.elements[row+counter][column].color = null
                gameField.elements[row+counter][column].empty = true
                gameField.elements[row+counter][column].elementDiv.style.backgroundColor = config.backgroundColor;
                counter--
            }
            
        }}catch (error){
            if(counter>=4){
                while(counter>=0){
                    gameField.elements[row+counter-1][column].color = null
                    gameField.elements[row+counter-1][column].empty = true
                    gameField.elements[row+counter-1][column].elementDiv.style.backgroundColor = config.backgroundColor;
                    counter--
                }
        }
        }
        //zbijanie 4 horyzontalnie
        //ustawic bloki zbite na empty true
        //krzyzowanie
    },
    elementLanded(row,column,color){
        gameField.elements[gameField.currentPill.row[row]][gameField.currentPill.column[column]].empty = false;
        gameField.elements[gameField.currentPill.row[row]][gameField.currentPill.column[column]].color = gameField.currentPill.colors[color];
        gameField.breakBlocks(gameField.currentPill.row[row], gameField.currentPill.column[column])
    },
};