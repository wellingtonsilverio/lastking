class Game {
    constructor() { }

    logInGame() {
        var user = "";
        var pass = "";

        for (let element of document.getElementsByName('user')) {
            user = element.value
        }
        for (let element of document.getElementsByName('password')) {
            pass = element.value
        }
        
        // var myRequest = new Request("https://pokeapi.co/api/v2/ability/4/");
        // fetch(myRequest)
        //     .then(response => response.json().then((json) => {
        //         console.log(json)
        //     }))

        localStorage.setItem("_user", "o465token21873198que182vem129309218na12req");

        this.openGame();
        setTimeout(() => this.openMenu(), 3000);
    }

    openGame() {
        if (this._user) {
            for (let element of document.getElementsByClassName('game-login')) {
                if (!element.classList.contains("hidden")) element.classList.add("hidden");
            }
            for (let element of document.getElementsByClassName('game-menu')) {
                if (!element.classList.contains("hidden")) element.classList.add("hidden");
            }
        } else {
            this._user = localStorage.getItem("_user");
            this.openGame();
        }
    }

    openMenu() {
        if (this._user) {
            for (let element of document.getElementsByClassName('game-menu')) {
                element.classList.remove("hidden");
            }
        } else {
            this._user = localStorage.getItem("_user");
            this.openMenu();
        }
    }
}