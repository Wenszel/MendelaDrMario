"strict mode";
class virus {
    constructor(){
        do{
            this.row = Math.floor(Math.random()*config.rows);
            this.column = Math.floor(Math.random()*config.columns); 
        }while(!gameField.elements[this.row][this.column].empty)
        this.color = config.colors[Math.floor(Math.random()*config.colors.length)];
    }
    generate(){
        gameField.elements[this.row][this.column].elementDiv.style.backgroundColor = this.color;
        gameField.elements[this.row][this.column].empty = false;
    }
}