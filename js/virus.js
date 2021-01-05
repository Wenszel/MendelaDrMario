"strict mode";
class pill {
    constructor(){
        this.row = Math.floor(Math.random()*config.rows);
        this.column = Math.floor(Math.random()*config.columns); 
    }
}