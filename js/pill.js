"strict mode";
class pill {
    constructor(){
        this.row = [0];
        // this loop deletes case when column is out of range
        do{
            var randomColumn = Math.floor(Math.random()*config.columns); 
        }while(randomColumn==config.columns-1);
        this.column = [randomColumn, randomColumn+1];
        this.colors = pill.generateColors();
        this.direction = "horizontal";
        this.canMove = true;
    } 
    generatePill(){
        gameField.changePillElementsColor(this);
        gameField.createFallingInterval(config.speed);
    }
    fallOnce(){
        gameField.changePillElementsColor(this, true);
        this.row[0]++;
        if(this.direction=="vertical") this.row[1]++
        gameField.changePillElementsColor(this, false);
    }
    moveHorizontal(side){
        if(this.canMove){
            //TODO: tutaj musi byc jeszcze warunek odnosnie zajetego
            gameField.changePillElementsColor(this, true);
            if(side == "left" && this.column[0]-1>=0){
                if(this.direction=="horizontal"){
                    this.column = [this.column[0]-1, this.column[1]-1];
                }else{
                    this.column = [this.column[0]-1];
                }
                
            }
            else if(side == "right" && ((this.direction=="horizontal" && this.column[1]<config.columns-1)||(this.direction=="vertical" && this.column[0]<config.columns-1))){
                if(this.direction=="horizontal"){
                    this.column = [this.column[0]+1, this.column[1]+1];
                }else{
                    this.column = [this.column[0]+1];
                }

            }
            gameField.changePillElementsColor(this, false);
        }
    }
    rotate(side){
        gameField.changePillElementsColor(this, true);
        if(this.direction=="horizontal") {
            this.direction="vertical";
            this.column = [this.column[0]];
            this.row = [this.row[0],this.row[0]-1];
            if(side=="right") this.colors = this.colors.reverse();
        }
        else{
            this.direction="horizontal";
            this.column = [this.column[0],this.column[0]+1];
            this.row = [this.row[0]];
            if(side=="left") this.colors = this.colors.reverse();   
        }
        gameField.changePillElementsColor(this, false);
    }
    isFallible(row, column){
        //check if fields below pill are empty and in rows scope
        try{
            if(gameField.elements[row+1][column].empty && gameField.elements[row+1][column+1].empty){
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
