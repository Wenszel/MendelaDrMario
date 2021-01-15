var settingsInterface = {
    openSettings(){
        document.getElementById("menu").style.display="none";
        document.getElementById("settings").style.display="block";
        let onEnterClick = function(event) {
            if (event.keyCode === 13){
                settingsInterface.parseData();
                document.getElementById("settings").style.display="none";
                gameField.startGame();
                document.removeEventListener("keyup", onEnterClick);
            }
        }
        document.addEventListener("keyup",onEnterClick); 
    
    },
    openAbout(){
        document.getElementById("menu").style.display="none";
        document.getElementById("about").style.display="flex";
        let onEnterClick = function(event) {
            if (event.keyCode === 13){
                document.getElementById("about").style.display="none";
                document.getElementById("menu").style.display="flex";
                document.removeEventListener("keyup", onEnterClick);
            }
        }
        document.addEventListener("keyup",onEnterClick); 
    },
    parseData(){
        let speed = document.querySelector('input[name="speed"]:checked').value;
        let viruslevel = document.querySelector('input[name="viruslevel"]').value;
        let music = document.querySelector('input[name="music"]:checked').value;
        config.speed=speed;
        config.virusAmount=viruslevel;
        config.music=music;
    }
}