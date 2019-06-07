class Game {
    constructor() {
        this.setupGame();
        this.openLogin();
    }

    setupGame() {
        this.objects = [];
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canJump = false;
        this.prevTime = performance.now();
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.vertex = new THREE.Vector3();
        this.color = new THREE.Color();
        
        this.init();
        this.animate();
    }

    startGame() {
        this.controls.lock();
    }

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
    }

    openGame() {
        this._user = localStorage.getItem("_user");

        if (this._user) {
            for (let element of document.getElementsByClassName('game-login')) {
                if (!element.classList.contains("hidden")) element.classList.add("hidden");
            }
            for (let element of document.getElementsByClassName('game-menu')) {
                if (!element.classList.contains("hidden")) element.classList.add("hidden");
            }
            
            this.startGame();
        } else {
            this.openLogin();
        }
    }

    openLogin() {
        this._user = localStorage.getItem("_user");

        if (!this._user) {
            for (let element of document.getElementsByClassName('game-login')) {
                element.classList.remove("hidden");
            }
        } else {
            this.openGame();
        }
    }

    openMenu() {
        this._user = localStorage.getItem("_user");

        if (this._user) {
            for (let element of document.getElementsByClassName('game-menu')) {
                element.classList.remove("hidden");
            }
        } else {
            this.openLogin();
        }
    }


    init = () => {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        this.scene.fog = new THREE.Fog(0xcccccc, 0, 750);
        var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
        light.position.set(0.5, 1, 0.75);
        this.scene.add(light);
        this.controls = new THREE.PointerLockControls(this.camera);

        this.scene.add(this.controls.getObject());

        this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
        // floor
        var floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100);
        floorGeometry.rotateX(- Math.PI / 2);
        // vertex displacement
        var position = floorGeometry.attributes.position;
        for (var i = 0, l = position.count; i < l; i++) {
            this.vertex.fromBufferAttribute(position, i);
            this.vertex.x += Math.random() * 20 - 10;
            this.vertex.y += Math.random() * 2;
            this.vertex.z += Math.random() * 20 - 10;
            position.setXYZ(i, this.vertex.x, this.vertex.y, this.vertex.z);
        }
        floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices
        position = floorGeometry.attributes.position;
        var colors = [];
        for (var i = 0, l = position.count; i < l; i++) {
            this.color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            colors.push(this.color.r, this.color.g, this.color.b);
        }
        floorGeometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        var floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.scene.add(floor);
        // objects
        var boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20);
        boxGeometry = boxGeometry.toNonIndexed(); // ensure each face has unique vertices
        position = boxGeometry.attributes.position;
        colors = [];
        for (var i = 0, l = position.count; i < l; i++) {
            this.color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            colors.push(this.color.r, this.color.g, this.color.b);
        }
        boxGeometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        for (var i = 0; i < 500; i++) {
            var boxMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors });
            boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            var box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
            box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
            box.position.z = Math.floor(Math.random() * 20 - 10) * 20;
            this.scene.add(box);
            this.objects.push(box);
        }
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        window.addEventListener('resize', this.onWindowResize, false);
        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);
        this.menuOpened = false;
        document.addEventListener('pointerlockchange', () => {
            if (!this.controls.isLocked) this.openMenu();
        }, false);
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        if (this.controls.isLocked === true) {
            this.raycaster.ray.origin.copy(this.controls.getObject().position);
            this.raycaster.ray.origin.y -= 10;
            var intersections = this.raycaster.intersectObjects(this.objects);
            var onObject = intersections.length > 0;
            var time = performance.now();
            var delta = (time - this.prevTime) / 1000;
            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;
            this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
            this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
            this.direction.x = Number(this.moveLeft) - Number(this.moveRight);
            this.direction.normalize(); // this ensures consistent movements in all directions
            if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 400.0 * delta;
            if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 400.0 * delta;
            if (onObject === true) {
                this.velocity.y = Math.max(0, this.velocity.y);
                this.canJump = true;
            }
            this.controls.getObject().translateX(this.velocity.x * delta);
            this.controls.getObject().position.y += (this.velocity.y * delta); // new behavior
            this.controls.getObject().translateZ(this.velocity.z * delta);
            if (this.controls.getObject().position.y < 10) {
                this.velocity.y = 0;
                this.controls.getObject().position.y = 10;
                this.canJump = true;
            }
            this.prevTime = time;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    onKeyUp = (event) => {
        // event.preventDefault();
        
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                this.moveForward = false;
                break;
            case 37: // left
            case 65: // a
                this.moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                this.moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                this.moveRight = false;
                break;
        }
    };

    onKeyDown = (event) => {
        // event.preventDefault();

        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                this.moveForward = true;
                break;
            case 37: // left
            case 65: // a
                this.moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                this.moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                this.moveRight = true;
                break;
            case 32: // space
                if (this.canJump === true) this.velocity.y += 350;
                this.canJump = false;
                break;
            // case 27:
            //     this.openMenu();
            //     break;
        }
    };
}