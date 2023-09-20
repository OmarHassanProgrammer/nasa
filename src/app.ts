import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, SceneLoader, Texture, StandardMaterial } from "@babylonjs/core";

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(2, 0, 0), scene);
        
        const angularVelocity = Math.PI / 5;
        const relativeRotationalSpeeds = {
            'mercury': 59.164,
            'venus': 243.676,
            'earth': 1,
            'mars': 1.032,
            'jupiter': 0.414,
            'saturn': 0.44,
            'uranus': 0.72,
            'neptune': 0.672
        };

        let sun : Mesh;
        let mercury : Mesh;
        let venus : Mesh;
        let earth : Mesh;
        let mars : Mesh;
        let jupiter : Mesh;
        let saturn : Mesh;
        let saturnRings : Mesh;
        let saturnRingsDown : Mesh;
        let uranus : Mesh;
        let neptune : Mesh;

        SceneLoader.ImportMeshAsync("", "assets/", "sun.glb", scene).then((result) => {
            result.meshes[1].position.x = -2.2;
            result.meshes[1].scaling.x = 2;
            result.meshes[1].scaling.y = 2;
            result.meshes[1].scaling.z = 2;    
            if(result.meshes[1] instanceof Mesh)        
                sun = result.meshes[1];
        });
        SceneLoader.ImportMeshAsync("", "assets/", "mercury.glb", scene).then((result) => {
            result.meshes[1].position.x = -1.1;
            result.meshes[1].scaling.x = 0.0001;
            result.meshes[1].scaling.y = 0.0001;
            result.meshes[1].scaling.z = 0.0001;  
            if(result.meshes[1] instanceof Mesh)        
                mercury = result.meshes[1];
        });
        SceneLoader.ImportMeshAsync("", "assets/", "venus.glb", scene).then((result) => {
            result.meshes[1].position.x = -0.91;
            result.meshes[1].scaling.x = 0.0002;
            result.meshes[1].scaling.y = 0.0002;
            result.meshes[1].scaling.z = 0.0002;
            if(result.meshes[1] instanceof Mesh)   
                venus = result.meshes[1];
        });
        SceneLoader.ImportMeshAsync("", "assets/", "earth.glb", scene).then((result) => {
            result.meshes[1].position.x = -0.65;
            result.meshes[1].scaling.x = 0.00025;
            result.meshes[1].scaling.y = 0.00025;
            result.meshes[1].scaling.z = 0.00025;
            if(result.meshes[1] instanceof Mesh)   
                earth = result.meshes[1];
        });
        SceneLoader.ImportMeshAsync("", "assets/", "mars.glb", scene).then((result) => {
            result.meshes[1].position.x = -0.42;
            result.meshes[1].scaling.x = 0.00015;
            result.meshes[1].scaling.y = 0.00015;
            result.meshes[1].scaling.z = 0.00015;
            if(result.meshes[1] instanceof Mesh)   
                mars = result.meshes[1];
        });
        SceneLoader.ImportMeshAsync("", "assets/", "jupiter.glb", scene).then((result) => {
            result.meshes[1].position.x = -0.1;
            result.meshes[1].scaling.x = 0.0004;
            result.meshes[1].scaling.y = 0.0004;
            result.meshes[1].scaling.z = 0.0004;
            if(result.meshes[1] instanceof Mesh)   
                jupiter = result.meshes[1];            
        });
        SceneLoader.ImportMeshAsync("", "assets/", "saturn.glb", scene).then((result) => {
            result.meshes[1].position.x = 0.51;
            result.meshes[2].position.x = 0.51;
            result.meshes[3].position.x = 0.51;
            result.meshes[1].scaling.x = 0.0003;
            result.meshes[1].scaling.y = 0.0003;
            result.meshes[1].scaling.z = 0.0003;
            result.meshes[2].scaling.x = 0.0003;
            result.meshes[2].scaling.y = 0.0003;
            result.meshes[2].scaling.z = 0.0003;
            result.meshes[3].scaling.x = 0.0003;
            result.meshes[3].scaling.y = 0.0003;
            result.meshes[3].scaling.z = 0.0003;
            if(result.meshes[1] instanceof Mesh)   
                saturn = result.meshes[1];
            if(result.meshes[2] instanceof Mesh)   
                saturnRings = result.meshes[2];
            if(result.meshes[3] instanceof Mesh)   
                saturnRingsDown = result.meshes[3];
        });
        SceneLoader.ImportMeshAsync("", "assets/", "uranus.glb", scene).then((result) => {
            result.meshes[1].position.x = 1.1;
            result.meshes[1].scaling.x = 0.00028;
            result.meshes[1].scaling.y = 0.00028;
            result.meshes[1].scaling.z = 0.00028;
            if(result.meshes[1] instanceof Mesh)   
                uranus = result.meshes[1];
        });
        SceneLoader.ImportMeshAsync("", "assets/", "neptune.glb", scene).then((result) => {
            result.meshes[1].position.x = 1.5;
            result.meshes[1].scaling.x = 0.00026;
            result.meshes[1].scaling.y = 0.00026;
            result.meshes[1].scaling.z = 0.00026;
            if(result.meshes[1] instanceof Mesh)   
                neptune = result.meshes[1];
        });

        
        var skybox = Mesh.CreateBox("skyBox", 10000.0, scene);
        var skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new Texture("/assets/space.jpg", scene, true);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.FIXED_EQUIRECTANGULAR_MODE;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        let lastTimestamp = performance.now();
        engine.runRenderLoop(() => {
            var currentTimestamp = performance.now();
            var deltaTime = (currentTimestamp - lastTimestamp) / 1000; 
            if(mercury) {
                mercury.rotate(new Vector3(0.999, 0.00059, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['mercury']);
            }
            if(venus) {
                venus.rotate(new Vector3(-0.9989, 0.04536, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['venus']);
            }
            if(earth) {
                earth.rotate(new Vector3(0.9174, 0.3979, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['earth']);
            }
            if(mars) {
                mars.rotate(new Vector3(0.9048, 0.42577, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['mars']);
            }
            if(jupiter) {
                jupiter.rotate(new Vector3(0.9985, 0.05407, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['jupiter']);
            }
            if(saturn && saturnRings && saturnRingsDown) {
                saturn.rotate(new Vector3(0.89337, 0.4493, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['saturn']);
                saturnRings.rotate(new Vector3(0.89337, 0.4493, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['saturn']);
                saturnRingsDown.rotate(new Vector3(0.89337, 0.4493, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['saturn']);
            }
            if(uranus) {
                uranus.rotate(new Vector3(-0.1357, 0.9907, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['uranus']);
            }
            if(neptune) {
                neptune.rotate(new Vector3(0.88, 0.474, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['neptune']);
            }
            scene.render();
            lastTimestamp = currentTimestamp;
        });
    }
}
new App();