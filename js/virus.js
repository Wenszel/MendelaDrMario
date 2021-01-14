"strict mode";
class virus {
    constructor(){
        do{
            this.row = Math.floor(Math.random()*(2/3*config.rows)+(config.rows-(2/3*config.rows)));
            this.column = Math.floor(Math.random()*config.columns); 
        }while(!gameField.elements[this.row][this.column].empty)
        this.color = config.colors[Math.floor(Math.random()*config.colors.length)];
        gameField.elements[this.row][this.column].elementDiv.style.backgroundImage = "url('gfx/game-elements/"+this.color+"_virus.png')";
        gameField.elements[this.row][this.column].empty = false;
        gameField.elements[this.row][this.column].color = this.color;
    }
}