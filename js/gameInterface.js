"use strict";
var gameInterface={
    //scoreboard properties
    scoreboard: document.getElementById("scoreboard"),
    topScore: document.getElementById("top-score"),
    currentScore: document.getElementById("current-score"),
    //loupe properties
    loupeVirusesPositions: [{bottom: "100px", left: "90px"},
                            {bottom: "50px", left: "160px"},
                            {bottom: "100px", left: "80px"},
                            {bottom: "110px", left: "220px"},
                            {bottom: "170px", left: "220px"},
                            {bottom: "220px", left: "160px"},
                            {bottom: "220px", left: "170px"},
                            {bottom: "200px", left: "110px"},
                            {bottom: "80px", left: "220px"},
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
                console.log("cokolwiek")
                this.speedinfo.innerText="HIGH";
                break;
            case "500":
                console.log("cokolwiek2")
                this.speedinfo.innerText="MID";
                break;
            case "1000":
                console.log("cokolwiek3")
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
        if(localStorage.getItem("topResult")<localStorage.getItem("points") || localStorage.getItem("topResult")==null){
            localStorage.setItem("topResult",localStorage.getItem("points"));
            //changes top score on interface
            this.topScore.textContent = localStorage.getItem("topResult");
            //fills score with zeros at the beginning
            while(this.topScore.textContent.length<5){
                this.topScore.textContent= "0"+this.topScore.textContent;
            }
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

    //loupe intervals
    startLoupeInterval(brokenColor){
        clearInterval(this.loupeInterval);
        //counts virus graphics changes to animate them
        console.log(brokenColor);
        let counter = 1;
        this.loupeInterval = setInterval(()=>{
            this.blueVirus.style.left = this.loupeVirusesPositions[counter%9].left;
            this.blueVirus.style.bottom = this.loupeVirusesPositions[counter%9].bottom;
            this.yellowVirus.style.left = this.loupeVirusesPositions[(3+counter)%9].left;
            this.yellowVirus.style.bottom = this.loupeVirusesPositions[(3+counter)%9].bottom;
            this.brownVirus.style.left = this.loupeVirusesPositions[(6+counter)%9].left;
            this.brownVirus.style.bottom = this.loupeVirusesPositions[(6+counter)%9].bottom;
            counter++
            if(gameField.virusOnMap.find(i => i.color=="blue")){
                if (brokenColor=="blue") {
                    this.blueVirus.src="gfx/loupe/bl/anim.png";
                    setTimeout(()=>{this.blueVirus.src="gfx/loupe/bl/"+counter%3+".png"},2000);
                }
                else this.blueVirus.src="gfx/loupe/bl/"+counter%3+".png";
            }else if(gameField.virusOnMap.find(i => i.color=="blue")==null && brokenColor=="blue"){
                this.blueVirus.src="gfx/loupe/bl/anim.png";
                setTimeout(()=>{this.blueVirus.style.display="none"},2000)
            }else{
                this.blueVirus.style.display="none";
            }
            if(gameField.virusOnMap.find(i => i.color=="brown")){
                if (brokenColor=="brown") {
                    this.brownVirus.src="gfx/loupe/br/anim.png";
                    setTimeout(()=>{this.brownVirus.src="gfx/loupe/br/"+counter%3+".png"},2000);
                }
                else this.brownVirus.src="gfx/loupe/br/"+counter%3+".png"
            }else if(gameField.virusOnMap.find(i => i.color=="brown")==null && brokenColor=="brown"){
                this.brownVirus.src="gfx/loupe/br/anim.png";
                setTimout(()=>{this.brownVirus.style.display="none"},2000);
            }else{
                this.brownVirus.style.display="none"
            }
            if(gameField.virusOnMap.find(i => i.color=="yellow")){
                if (brokenColor=="yellow"){
                    this.yellowVirus.src="gfx/loupe/yl/anim.png";
                    setTimeout(()=>{this.yellowVirus.src="gfx/loupe/yl/"+counter%3+".png"},2000);          
                }
                else this.yellowVirus.src="gfx/loupe/yl/"+counter%3+".png"
            }else if(gameField.virusOnMap.find(i => i.color=="yellow")==null && brokenColor=="yellow"){
                this.yellowVirus.src="gfx/loupe/yl/anim.png";
                setTimeout(()=>{this.yellowVirus.style.display="none"},2000)
            }else{
                this.yellowVirus.style.display="none";
            }
        },1500)
    },
}