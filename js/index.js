"strict mode";
var config = {
    rows: 16,
    columns: 8,
    speed: "low",
    virusLevel: 0,
    music: false,
    colors: ["red","blue","yellow"]
};
var playgroundGridElements = []
function generatePlayground(){
    var playgroundElement = document.createElement("div");
    playgroundElement.id = "playground";
    for(var i = 0; i<config.rows; i++){
        for (var j = 0; j<config.columns; j++){
            var playgroundGridElement = {
                row: i,
                column: j,
                element: document.createElement("div")
            }
            playgroundGridElement.element.classList.add("playground-element");
            playgroundGridElements.push(playgroundGridElement);
            playgroundElement.appendChild(playgroundGridElement.element);
        }
    }
    document.body.appendChild(playgroundElement)
}
class pill {
    row = 0
    column = undefined
    colors = [undefined,undefined]
    generatePill(){
        this.column = Math.floor(Math.random()*config.columns)
        this.colors = this.generateColors()
        playgroundGridElements[this.column].element.style.backgroundColor=this.colors[0]
        playgroundGridElements[this.column-1].element.style.backgroundColor=this.colors[1]
        playgroundGridElements[this.column].element.style.borderTopRightRadius = "50%"
        playgroundGridElements[this.column].element.style.borderBottomRightRadius = "50%"
        playgroundGridElements[this.column-1].element.style.borderTopLeftRadius = "50%"
        playgroundGridElements[this.column-1].element.style.borderBottomLeftRadius = "50%"
    }
    generateColors(){
        var colors = []
        for(var i = 0; i<2; i++){
            colors.push(config.colors[Math.floor(Math.random()*config.colors.length)])
        }
        return colors;
    }
    fallOnce(){
        row += 1
        playgroundGridElements[this.column].element.style.backgroundColor=this.colors[0]
        
        playgroundGridElements[this.column-1].element.style.backgroundColor=this.colors[1]
    }
};
function startGame(){
    document.getElementById("main-page").style.display="none";
    document.body.style.backgroundImage="url('gfx/game-pattern.png')"
    generatePlayground()
    var pill1 = new pill()
    pill1.generatePill()
}