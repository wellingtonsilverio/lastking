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
        this.camera.position.set( 0, 600, 0 );

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
            obj.position.x = 0;
            obj.position.y = 0;
            this.scene.add(obj);
        });

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        document.body.appendChild(this.renderer.domElement);

        var controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        controls.target.set( 0, 300, 0 );
        controls.update();

        // stats
        // var stats = new Stats();
        // container.appendChild( stats.dom );

        window.addEventListener( 'resize', this.onWindowResize);

        var animate = () => {
            requestAnimationFrame(animate);

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