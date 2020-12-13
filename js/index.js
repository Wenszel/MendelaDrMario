var config = {
    rows: 16,
    columns: 8
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
window.addEventListener('DOMContentLoaded',generatePlayground);