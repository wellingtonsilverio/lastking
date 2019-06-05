class Game {
    constructor() {
        this.init();
    }

    init = () => {
        this.assetsPath = 'assets/';

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
        // this.camera.position.z = 3;
        // this.camera.position.y = 2;
        // this.camera.rotation.x = -(Math.PI / 60);
        this.camera.position.set( 0, 800, 250 );

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xa0a0a0 );
        this.scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

        var light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        light.position.set( 0, 200, 0 );
        this.scene.add( light );

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0, 200, 100 );
        light.castShadow = true;
        light.shadow.camera.top = 180;
        light.shadow.camera.bottom = - 100;
        light.shadow.camera.left = - 120;
        light.shadow.camera.right = 120;
        this.scene.add( light );

        this.controls = new THREE.PointerLockControls( this.camera );
        this.scene.add( this.controls.getObject() );

        // ground
        var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        this.scene.add( mesh );
        var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
        grid.material.opacity = 0.6;
        grid.material.transparent = true;
        this.scene.add( grid );

        // this.renderBox(this.scene);
        // this.renderFloor(this.scene);
        // this.renderPlayer(this.scene);

        // model
        var objLoader = new THREE.OBJLoader();
        objLoader.setPath('src/assets/objs/');
        objLoader.load('sylvanas_obj.obj', (obj) => {
            this.character = obj;
            // this.character.move = {};
            this.character.position.x = 0;
            this.character.position.y = 0;
            this.scene.add(this.character);
            this.controls.lock();
        });

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        document.body.appendChild(this.renderer.domElement);

        var onKeyDown = function ( event ) {
            switch ( event.keyCode ) {
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
                    if ( this.canJump === true ) this.velocity.y += 350;
                    this.canJump = false;
                    break;
            }
        };

        var onKeyUp = function ( event ) {
            switch ( event.keyCode ) {
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

        document.addEventListener( 'keydown', onKeyDown, false );
        document.addEventListener( 'keyup', onKeyUp, false );
        
        this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

        // stats
        var stats = new Stats();
        document.body.appendChild( stats.dom );

        window.addEventListener( 'resize', this.onWindowResize);

        var animate = () => {
            stats.update();
            
            requestAnimationFrame(animate);

            if ( this.controls.isLocked === true ) {
                this.raycaster.ray.origin.copy( this.controls.getObject().position );
                this.raycaster.ray.origin.y -= 10;
                var intersections = this.raycaster.intersectObjects( objects );
                var onObject = intersections.length > 0;
                var time = performance.now();
                var delta = ( time - prevTime ) / 1000;
                this.velocity.x -= this.velocity.x * 10.0 * delta;
                this.velocity.z -= this.velocity.z * 10.0 * delta;
                this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
                direction.z = Number( this.moveForward ) - Number( this.moveBackward );
                direction.x = Number( this.moveLeft ) - Number( this.moveRight );
                direction.normalize(); // this ensures consistent movements in all directions
                if ( this.moveForward || this.moveBackward ) this.velocity.z -= direction.z * 400.0 * delta;
                if ( this.moveLeft || this.moveRight ) this.velocity.x -= direction.x * 400.0 * delta;
                if ( onObject === true ) {
                    this.velocity.y = Math.max( 0, this.velocity.y );
                    canJump = true;
                }
                this.controls.getObject().translateX( this.velocity.x * delta );
                this.controls.getObject().position.y += ( this.velocity.y * delta ); // new behavior
                this.controls.getObject().translateZ( this.velocity.z * delta );
                if ( this.controls.getObject().position.y < 10 ) {
                    this.velocity.y = 0;
                    this.controls.getObject().position.y = 10;
                    this.canJump = true;
                }
                prevTime = time;
            }

            this.renderer.render(this.scene, this.camera);
        }
        animate();
    }

    renderBox = (scene) => {
        var geometry = new THREE.BoxGeometry(10, 10);
        var material = new THREE.MeshBasicMaterial({ color: 0x01A963 });

        var mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);

        var animate = () => {
            requestAnimationFrame(animate);

            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.02;
        }
        animate();
    }

    renderFloor = (scene) => {
        var geometry = new THREE.BoxGeometry(10000, 10000, 0.001);
        var material = new THREE.MeshBasicMaterial({ color: 0x01A963 });

        // material.wireframe = true;
        
        var mesh = new THREE.Mesh(geometry, material);

        mesh.rotation.x += Math.PI / 2;

        scene.add(mesh);
    }

    renderPlayer = (scene) => {
        
    }

    onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}