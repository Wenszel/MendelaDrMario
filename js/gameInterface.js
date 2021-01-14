var gameInterface={
    //scoreboard properties
    scoreboard: document.getElementById("scoreboard"),
    topScore: document.getElementById("top-score"),
    //loupe properties
    loupe: document.getElementById("loupe"),
    blueVirus: document.getElementById("blue-loupe"),
    brownVirus: document.getElementById("brown-loupe"),
    yellowVirus: document.getElementById("yellow-loupe"),
    //gameinfo properties
    gameinfo: document.getElementById("game-info"),
    levelinfo: document.getElementById("level"),
    speedinfo: document.getElementById("speed"),
    virusAmount: document.getElementById("virus-amount"),
    //doctor properties
    doctor: document.getElementById("doctor"),
    //initiate interface
    initiate(){
        //delete logo
        document.getElementById("logo").style.display="none";
        //makes interface visable
        this.scoreboard.style.display="block";
        this.loupe.style.display="block";
        //counts virus graphics changes to animate them
        let counter = 0;
        setInterval(()=>{
            counter++
            if(gameField.virusOnMap.find(i => i.color=="blue")){
                //animate virus inside loupe
                this.blueVirus.src="gfx/loupe/bl/"+counter%3+".png"
            }else{
                //if there is no that virus color on map virus disappear
                this.blueVirus.style.display="none";
            }
            if(gameField.virusOnMap.find(i => i.color=="brown")){
                this.brownVirus.src="gfx/loupe/br/"+counter%3+".png"
            }else{
                this.brownVirus.style.display="none";
            }
            if(gameField.virusOnMap.find(i => i.color=="yellow")){
                this.yellowVirus.src="gfx/loupe/yl/"+counter%3+".png"
            }else{
                this.yellowVirus.style.display="none";
            }
        },1000)
        //create game info table
        this.gameinfo.style.display="block";
        this.virusAmount.innerText=gameField.virusOnMap.length;
        this.doctor.style.display="block";
    },changeLevel(){
        gameField.level++;
        this.blueVirus.style.display="block";
        this.brownVirus.style.display="block";
        this.yellowVirus.style.display="block";
        //when level is below 10 adds 0 in front of number
        if(parseInt(this.levelinfo.innerText)>9){
            this.levelinfo.innerText=gameField.level;
        }else{
            this.levelinfo.innerText="0"+gameField.level;
        }
    }
}