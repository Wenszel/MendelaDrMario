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
            playgroundGridElements.push(playgroundElement);
            playgroundElement.appendChild(playgroundGridElement.element);
        }
    }
    document.body.appendChild(playgroundElement)
}
var pill = {
    row: 0,
    column: undefined,
    generatePill: function(){
        this.column = Math.floor(Math.random()*config.columns)
        console.log(pill.column)
    }
};
function startGame(){
    document.getElementById("main-page").style.display="none";
    document.body.style.backgroundImage="url('gfx/game-pattern.png')"
    generatePlayground()
}
//window.addEventListener('DOMContentLoaded',generatePlayground);