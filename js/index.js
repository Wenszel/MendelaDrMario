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
        document.body.style.backgroundImage="url('gfx/game-pattern.png')"
        this.initiate()
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
            this.elements.push(rowArray)
        }
        document.body.appendChild(this.fieldDiv)
    }
}
class pill {
    constructor(){
        this.row = 0
        this.column = Math.floor(Math.random()*config.columns)
        this.colors = pill.generateColors()
    } 
    generatePill(){
    }
    fallOnce(){
    }
    isFallible(){
    }
    static generateColors(){
        var colors = []
        for(var i = 0; i<2; i++){
            colors.push(config.colors[Math.floor(Math.random()*config.colors.length)])
        }
        return colors;
    }
};

