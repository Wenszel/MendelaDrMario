"use strict";
var gameInterface={
    //scoreboard properties
    scoreboard: document.getElementById("scoreboard"),
    topScore: document.getElementById("top-score"),
    currentScore: document.getElementById("current-score"),
    //loupe properties
    loupeVirusesPositions: [{bottom: "100px", left: "60px"},//
                            {bottom: "70px", left: "100px"},
                            {bottom: "70px", left: "180px"},
                            {bottom: "100px", left: "220px"},//
                            {bottom: "220px", left: "220px"},
                            {bottom: "220px", left: "200px"},
                            {bottom: "220px", left: "140px"},//
                            {bottom: "200px", left: "80px"},
                            {bottom: "170px", left: "80px"},
                            ],
    loupe: document.getElementById("loupe"),
    loupeInterval: null,
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
        //set top score on table
        if(localStorage.getItem("topResult")!=null){
            this.topScore.textContent = localStorage.getItem("topResult");
        }
        while(this.topScore.textContent.length<5){
            this.topScore.textContent= "0"+this.topScore.textContent;
        }
        //sets speed info 
        switch(config.speed){
            case "250":
                this.speedinfo.innerText="HIGH";
                break;
            case "500":
                this.speedinfo.innerText="MID";
                break;
            case "1000":
                this.speedinfo.innerText="LOW";
                break;
        }
        //create loupe interval
        this.startLoupeInterval(null);
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
    },changeVirusAmount(){
        this.virusAmount.innerText=config.virusAmount
        if(parseInt(this.virusAmount.innerText)>9){
            this.virusAmount.innerText=config.virusAmount;
        }else{
            this.virusAmount.innerText="0"+config.virusAmount;
        }
    }
    ,changeTopScore(){
        //if there were more points in last game then ever changes local storage top results
        if(parseInt(localStorage.getItem("topResult"))<parseInt(localStorage.getItem("points")) || localStorage.getItem("topResult")==null){
            let points = localStorage.getItem("points");
            localStorage.setItem("topResult",points);
            //changes top score on interface
            this.topScore.textContent = localStorage.getItem("topResult");
            //fills score with zeros at the beginning
            while(this.topScore.textContent.length<5){
                this.topScore.textContent= "0"+this.topScore.textContent;
            }
            localStorage.setItem("points",0);
        }
    },changeCurrentScore(){
        //changes points based on broken viruses
        localStorage.setItem("points", gameField.brokenViruses*100);
        this.currentScore.innerText = localStorage.getItem("points");
        //fills score with zeros at the beginning
        while(this.currentScore.innerText.length<5){
            this.currentScore.innerText = "0"+this.currentScore.innerText;
        }
    },
    loupeClock: 0,
    animateYellowVirus(){
        if(gameField.virusOnMap.find(i => i.color=="yellow")){
            this.yellowVirus.style.left = this.loupeVirusesPositions[(3+Math.floor(this.loupeClock))%9].left;
            this.yellowVirus.style.bottom = this.loupeVirusesPositions[(3+Math.floor(this.loupeClock))%9].bottom;
            this.yellowVirus.src="gfx/loupe/yl/"+Math.ceil(this.loupeClock)%2+".png"
        }else{
            this.yellowVirus.style.display="none";
        }     
    },
    animateBlueVirus(){
        if(gameField.virusOnMap.find(i => i.color=="blue")){
            this.blueVirus.style.left = this.loupeVirusesPositions[(Math.floor(this.loupeClock))%9].left;
            this.blueVirus.style.bottom = this.loupeVirusesPositions[(Math.floor(this.loupeClock))%9].bottom;
            this.blueVirus.src="gfx/loupe/bl/"+Math.ceil(this.loupeClock)%2+".png"
        }else{
            this.blueVirus.style.display="none";
        }     
    },
    animateBrownVirus(){
        if(gameField.virusOnMap.find(i => i.color=="brown")){
            this.brownVirus.style.left = this.loupeVirusesPositions[(6+Math.floor(this.loupeClock))%9].left;
            this.brownVirus.style.bottom = this.loupeVirusesPositions[(6+Math.floor(this.loupeClock))%9].bottom;
            this.brownVirus.src="gfx/loupe/br/"+Math.ceil(this.loupeClock)%2+".png"
        }else{
            this.brownVirus.style.display="none";
        }     
    },
    startLoupeInterval(){
        clearInterval(this.loupeInterval);
        this.loupeInterval = setInterval(()=>{
            this.loupeClock+=0.5;
            this.animateBlueVirus();
            this.animateBrownVirus();
            this.animateYellowVirus();
        },1000)
    },
    startGameOverLoupeInterval(){
        clearInterval(this.loupeInterval);
        let counter = 0
        this.loupeInterval = setInterval(()=>{
            counter++
            gameField.virusOnMap.find(i => i.color=="blue") ? this.blueVirus.src=`gfx/loupe/bl/go${counter%2}.png`:null;
            gameField.virusOnMap.find(i => i.color=="brown") ? this.brownVirus.src=`gfx/loupe/br/go${counter%2}.png`:null;
            gameField.virusOnMap.find(i => i.color=="yellow") ? this.yellowVirus.src=`gfx/loupe/yl/go${counter%2}.png`:null;
        },500)
    }
}