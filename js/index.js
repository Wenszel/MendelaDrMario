"strict mode";
var config = {
    rows: 16,
    columns: 8,
    speed: "low",
    virusLevel: 0,
    music: false,
    colors: ["red","blue","yellow"]
};
var gameField = {
    fieldDiv: document.createElement("div"),
    elements: [], // two-dimensional array, stores grid objects
    startGame(){
        document.getElementById("main-page").style.display="none";
        document.body.style.backgroundImage="url('gfx/game-pattern.png')";
        this.initiate();
        let newPill = new pill();
        newPill.generatePill();
        document.onkeydown = function(event){
            const key = event.key;
            switch(key){
                case "ArrowDown": 
                    newPill.fallOnce();
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
                    elementDiv: document.createElement("div")
                }
                fieldElement.elementDiv.classList.add("playground-element");
                this.fieldDiv.append(fieldElement.elementDiv);
                rowArray.push(fieldElement);
            }
            this.elements.push(rowArray);
        }
        document.body.appendChild(this.fieldDiv);
    },
    changeElementColor(row, column, color){
        this.elements[row][column].elementDiv.style.backgroundColor = color;
    }
}
class pill {
    constructor(){
        this.row = 0;
        // this loop deletes case when column is out of range
        do{
            var randomColumn = Math.floor(Math.random()*config.columns); 
        }while(randomColumn==config.columns-1);
        this.column = [randomColumn, randomColumn+1];
        this.colors = pill.generateColors();
    } 
    generatePill(){
        gameField.changeElementColor(this.row, this.column[0], this.colors[0]);
        gameField.changeElementColor(this.row, this.column[1], this.colors[1]);
    }
    fallOnce(){
        if(this.isFallible(this.row, this.column[0])){
            gameField.changeElementColor(this.row, this.column[0], "#282828");
            gameField.changeElementColor(this.row, this.column[1], "#282828");
            this.row++;
            gameField.changeElementColor(this.row, this.column[0], this.colors[0]);
            gameField.changeElementColor(this.row, this.column[1], this.colors[1]);
        }
    }
    isFallible(row, column){
        //check if fields below pill are empty and in rows scope
        try{
            if(gameField.elements[row+1][column].empty){
                return true;
            }else{
                return false;
            }
        }catch (error){
            return false;
        }
    }
    static generateColors(){
        do{
            var colors = [];
            for(let i = 0; i<2; i++){
                colors.push(config.colors[Math.floor(Math.random()*config.colors.length)]);
            }
        }while(colors[0]==colors[1])
        return colors;
    }
};

