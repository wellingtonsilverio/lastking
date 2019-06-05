class Debug {
    constructor(debug) {
        document.addEventListener("DOMContentLoaded", function(){
            const game = new Game();
            if (debug) window.game = game;
        });
        window.onError = function(error){
			if (debug) console.error(JSON.stringify(error));
        }
    }
}