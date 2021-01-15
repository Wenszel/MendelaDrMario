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
        gameField.changePillElementsColor(this);
        gameField.createFallingInterval(config.speed, this);
    } 
    fallOnce(){
        gameField.changePillElementsColor(this, true);
        this.row[0]++;
        if(this.direction=="vertical") this.row[1]++
        gameField.changePillElementsColor(this, false);
    }
    moveHorizontal(side){
        if(this.canMove){
            let {elements, currentPill, changePillElementsColor} = gameField;
            changePillElementsColor(this, true);
            if(side == "left" && this.column[0]-1>=0){
                if(this.direction=="horizontal" && elements[currentPill.row][this.column[0]-1].empty){
                    this.column = [this.column[0]-1, this.column[1]-1];
                }else if(this.direction=="vertical" && elements[currentPill.row[0]][this.column[0]-1].empty && elements[currentPill.row[1]][this.column[0]-1].empty){
                    this.column = [this.column[0]-1];
                }
            }
            else if(side == "right" && ((this.direction=="horizontal" && this.column[1]<config.columns-1)||(this.direction=="vertical" && this.column[0]<config.columns-1))){
                if(this.direction=="horizontal" && elements[currentPill.row][this.column[1]+1].empty){
                    this.column = [this.column[0]+1, this.column[1]+1];
                }else if (this.direction=="vertical" && elements[currentPill.row[0]][this.column[0]+1].empty && gameField.elements[gameField.currentPill.row[1]][this.column[0]+1].empty){
                    this.column = [this.column[0]+1];
                }

            }
            changePillElementsColor(this, false);
        }
    }
    rotate(side){
        if(this.canMove){
        if((this.direction=="horizontal" && gameField.elements[this.row[0]-1][this.column[0]].empty)||
            (this.direction=="vertical" && gameField.elements[this.row[0]][this.column[0]-1].empty && this.column[0]==config.columns-1)||
            (this.direction=="vertical" && gameField.elements[this.row[0]][this.column[0]+1].empty)
            ){
            gameField.changePillElementsColor(this, true);
            if(this.direction=="horizontal") {
                this.direction="vertical";
                this.column = [this.column[0]];
                this.row = [this.row[0],this.row[0]-1];
                if(side=="right") this.colors = this.colors.reverse();
            }
            else{
                if(this.column[0]==config.columns-1){
                    this.column = [this.column[0]-1,this.column[0]];
                }else{
                    this.column = [this.column[0],this.column[0]+1];
                }
                this.direction="horizontal";
                this.row = [this.row[0]];
                if(side=="left") this.colors = this.colors.reverse();   
            }
            gameField.changePillElementsColor(this, false);
        }
    }
    }
    isFallible(){
        //check if fields below pill are empty and in rows scope
        let row = this.row[this.row.length-1];
        let column = this.column[0];
        try{
            if(this.direction=="horizontal"){
                if(gameField.elements[row+1][column].empty && gameField.elements[row+1][column+1].empty){
                    return true;
                }else{
                    return false;
                }
            }else if(this.direction=="vertical"){
                if(gameField.elements[row+2][column].empty){
                    return true;
                }else{
                    return false;
                }  
            }else{
                if(gameField.elements[row+1][column].empty){
                    return true;
                }else{
                    return false;
                }  
            } 
        }catch (error){
            if (error instanceof TypeError){
                return false;
            }   
        }
    }
    //set gamefield elements as taken by pill and checks if blocks can be break
    landed(){
        let changeElementProperties = (row, column, color) => {
            gameField.elements[row][column].empty = false;
            gameField.elements[row][column].color = this.colors[color];
        }
        if(this.row.length>this.column.length){
            this.row.forEach((item, index) => changeElementProperties(item, this.column[0], index));
        }else if(this.row.length<this.column.length){
            this.column.forEach((item, index) => changeElementProperties(this.row[0], item, index));
        }else if(this.row.length==this.column.length){
            changeElementProperties(this.row[0], this.column[0], 0);
        }
    }
    released(){
        let changeElementProperties = (row, column) => {
            gameField.elements[row][column].empty = true;
            gameField.elements[row][column].color = null;
        }
        if(this.row.length>this.column.length){
            this.row.forEach((item) => changeElementProperties(item, this.column[0]));
        }else if(this.row.length<this.column.length){
            this.column.forEach((item) => changeElementProperties(this.row[0], item));
        }else if(this.row.length==this.column.length){
            changeElementProperties(this.row[0], this.column[0]);
        }
    }
    static generateColors(){
        let colors = [];
        for(let i = 0; i<2; i++){
            colors.push(config.colors[Math.floor(Math.random()*config.colors.length)]);
        }
        return colors;
    }
};
