// --- Scene Setup ---
const canvas = document.getElementById('gameCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xADD8E6); // Light blue background

// Add OrbitControls for camera interaction (rotate, zoom, pan)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below the "ground"

// Position the camera
camera.position.set(0, 5, 10);
controls.update();

// Add some basic lighting
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // White directional light
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// --- Game Objects (Simple Blocks) ---
const blocks = [];
const originalColors = {}; // To store original colors for reset or state tracking

function createBlock(x, y, z, color, name) {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ color: color }); // Phong material reacts to light
    const block = new THREE.Mesh(geometry, material);
    block.position.set(x, y, z);
    block.name = name; // Assign a name for identification
    block.userData.isRemoved = false; // Custom property to track state
    scene.add(block);
    blocks.push(block);
    originalColors[name] = color; // Store original color
    return block;
}

// Create a few blocks
const block1 = createBlock(0, 0, 0, 0xff0000, 'redBlock'); // Red
const block2 = createBlock(2.1, 0, 0, 0x00ff00, 'greenBlock'); // Green, slightly offset
const block3 = createBlock(0, 2.1, 0, 0x0000ff, 'blueBlock'); // Blue, on top of red

// --- Interaction Logic ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onCanvasClick(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the raycaster
    const intersects = raycaster.intersectObjects(blocks);

    if (intersects.length > 0) {
        const clickedBlock = intersects.object;

        // --- CONCEPTUAL DISASSEMBLY LOGIC ---
        // In a real game, you'd check:
        // 1. Are all "screws" associated with this block unscrewed?
        // 2. Are all "blocking" pieces already removed?
        // 3. Is this block currently "removable" based on the puzzle's dependency graph?

        if (!clickedBlock.userData.isRemoved) {
            console.log(`Clicked block: ${clickedBlock.name}`);
            // Simulate "unscrewing" or "removal" by changing color
            clickedBlock.material.color.set(0x808080); // Change to grey
            clickedBlock.userData.isRemoved = true; // Mark as "removed"

            // In a real game, you'd then:
            // - Play a removal animation (e.g., slide out, fall)
            // - Update the game state (e.g., progress counter)
            // - Potentially enable other blocks/screws to be removed
        } else {
            console.log(`${clickedBlock.name} is already removed.`);
            // Optional: Revert color if clicked again (for demonstration)
            clickedBlock.material.color.set(originalColors[clickedBlock.name]);
            clickedBlock.userData.isRemoved = false;
        }
    }
}

// Add event listener for clicks
window.addEventListener('click', onCanvasClick, false);

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate); // Request the next frame for smooth animation [5]

    controls.update(); // Only required if controls.enableDamping is set to true

    renderer.render(scene, camera);
}

animate(); // Start the animation loop
