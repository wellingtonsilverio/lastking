window.onload = () => {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x1F5A94);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;

    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({ color: 0x01A963 });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    document.body.appendChild(renderer.domElement);

    function animate() {
        requestAnimationFrame(animate);

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        renderer.render(scene, camera);
    }
    animate();
};