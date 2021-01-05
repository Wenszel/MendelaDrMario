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
    } 
    generatePill(){
        gameField.changePillElementsColor(this);
        gameField.createFallingInterval(1000);
    }
    fallOnce(){
        gameField.changePillElementsColor(this, true);
        this.row[0]++;
        gameField.changePillElementsColor(this, false);
    }
    moveHorizontal(side){
        gameField.changePillElementsColor(this, true);
        if(side == "left") this.column = [this.column[0]-1,this.column[1]-1]
        if(side == "right") this.column = [this.column[0]+1,this.column[1]+1]
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
