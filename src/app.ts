import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, 
    Scene, 
    ArcRotateCamera, 
    Vector3, 
    Vector2, 
    HemisphericLight, 
    Mesh, 
    MeshBuilder, 
    SceneLoader, 
    Texture, 
    StandardMaterial, 
    PickingInfo,
    IPointerEvent,
    Animation,
    Color3,
    Material,
    AnimationGroup,
    Sound } from "@babylonjs/core";

enum MODE {
    Solar = 1,
    Planet = 2,
}
let mode : MODE = MODE.Solar;
let scene : Scene;
let planets : { [key: string]: Mesh } = {};
let activePlanet : string;
let camera: ArcRotateCamera;

class App {

    constructor() {
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        scene = new Scene(engine);

        camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.wheelPrecision = 100;
        camera.panningSensibility = 1;
        camera.lowerRadiusLimit = 2; 
        camera.upperRadiusLimit = 10;
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(2, 0, 0), scene);
        
        var backgroundMusic = new Sound("backgroundMusic", "assets/bgMusic.mp3", scene, null, {
            loop: true,
            autoplay: true
        });

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

        SceneLoader.ImportMeshAsync("", "assets/", "sun.glb", scene).then((result) => {
            result.meshes[1].position.x = -2.2;
            result.meshes[1].scaling.x = 2;
            result.meshes[1].scaling.y = 2;
            result.meshes[1].scaling.z = 2;
            result.meshes[1].name = "sun";
            if(result.meshes[1] instanceof Mesh)        
                planets['sun'] = result.meshes[1];
        });
        SceneLoader.ImportMeshAsync("", "assets/", "mercury.glb", scene).then((result) => {
            result.meshes[1].position.x = -1.1;
            result.meshes[1].scaling.x = 0.0001;
            result.meshes[1].scaling.y = 0.0001;
            result.meshes[1].scaling.z = 0.0001;
            result.meshes[1].name = "mercury";
            if(result.meshes[1] instanceof Mesh)        
                planets['mercury'] = result.meshes[1];
        });
        SceneLoader.ImportMeshAsync("", "assets/", "venus.glb", scene).then((result) => {
            result.meshes[1].position.x = -0.91;
            result.meshes[1].scaling.x = 0.0002;
            result.meshes[1].scaling.y = 0.0002;
            result.meshes[1].scaling.z = 0.0002;
            result.meshes[1].name = "venus";
            if(result.meshes[1] instanceof Mesh)   
                planets['venus'] = result.meshes[1];
        });
        SceneLoader.ImportMeshAsync("", "assets/", "earth.glb", scene).then((result) => {
            result.meshes[1].position.x = -0.65;
            result.meshes[1].scaling.x = 0.00025;
            result.meshes[1].scaling.y = 0.00025;
            result.meshes[1].scaling.z = 0.00025;
            result.meshes[1].name = "earth";
            if(result.meshes[1] instanceof Mesh)   
                planets['earth'] = result.meshes[1];
        });
        SceneLoader.ImportMeshAsync("", "assets/", "mars.glb", scene).then((result) => {
            result.meshes[1].position.x = -0.42;
            result.meshes[1].scaling.x = 0.00015;
            result.meshes[1].scaling.y = 0.00015;
            result.meshes[1].scaling.z = 0.00015;
            result.meshes[1].name = "mars";
            if(result.meshes[1] instanceof Mesh)   
                planets['mars'] = result.meshes[1];
        });
        SceneLoader.ImportMeshAsync("", "assets/", "jupiter.glb", scene).then((result) => {
            result.meshes[1].position.x = -0.1;
            result.meshes[1].scaling.x = 0.0004;
            result.meshes[1].scaling.y = 0.0004;
            result.meshes[1].scaling.z = 0.0004;
            result.meshes[1].name = "jupiter";
            if(result.meshes[1] instanceof Mesh)   
                planets['jupiter'] = result.meshes[1];
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
            result.meshes[1].name = "saturn";
            result.meshes[2].name = "saturn";
            result.meshes[3].name = "saturn";
            if(result.meshes[1] instanceof Mesh)   
                planets['saturn'] = result.meshes[1];
            if(result.meshes[2] instanceof Mesh)   
                planets['saturnRings'] = result.meshes[2];
            if(result.meshes[3] instanceof Mesh)   
                planets['saturnRingsDown'] = result.meshes[3];
        });
        SceneLoader.ImportMeshAsync("", "assets/", "uranus.glb", scene).then((result) => {
            result.meshes[1].position.x = 1.1;
            result.meshes[1].scaling.x = 0.00028;
            result.meshes[1].scaling.y = 0.00028;
            result.meshes[1].scaling.z = 0.00028;
            result.meshes[1].name = "uranus";
            if(result.meshes[1] instanceof Mesh)   
                planets['uranus'] = result.meshes[1];
        });
        SceneLoader.ImportMeshAsync("", "assets/", "neptune.glb", scene).then((result) => {
            result.meshes[1].position.x = 1.5;
            result.meshes[1].scaling.x = 0.00026;
            result.meshes[1].scaling.y = 0.00026;
            result.meshes[1].scaling.z = 0.00026;
            result.meshes[1].name = "neptune";
            if(result.meshes[1] instanceof Mesh)   
                planets['neptune'] = result.meshes[1];
        });
        
        var skybox = Mesh.CreateBox("skyBox", 10000.0, scene);
        var skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new Texture("/assets/space4.jpg", scene, true);
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

        scene.onPointerDown = this.ClickEvent;

        let lastTimestamp = performance.now();
        engine.runRenderLoop(() => {
            var currentTimestamp = performance.now();
            var deltaTime = (currentTimestamp - lastTimestamp) / 1000; 
            if(planets['mercury']) {
                planets['mercury'].rotate(new Vector3(0.999, 0.00059, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['mercury']);
            }
            if(planets['venus']) {
                planets['venus'].rotate(new Vector3(-0.9989, 0.04536, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['venus']);
            }
            if(planets['earth']) {
                planets['earth'].rotate(new Vector3(0.9174, 0.3979, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['earth']);
            }
            if(planets['mars']) {
                planets['mars'].rotate(new Vector3(0.9048, 0.42577, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['mars']);
            }
            if(planets['jupiter']) {
                planets['jupiter'].rotate(new Vector3(0.9985, 0.05407, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['jupiter']);
            }
            if(planets['saturn'] && planets['saturnRings'] && planets['saturnRingsDown']) {
                planets['saturn'].rotate(new Vector3(0.89337, 0.4493, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['saturn']);
                planets['saturnRings'].rotate(new Vector3(0.89337, 0.4493, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['saturn']);
                planets['saturnRingsDown'].rotate(new Vector3(0.89337, 0.4493, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['saturn']);
            }
            if(planets['uranus']) {
                planets['uranus'].rotate(new Vector3(-0.1357, 0.9907, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['uranus']);
            }
            if(planets['neptune']) {
                planets['neptune'].rotate(new Vector3(0.88, 0.474, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['neptune']);
            }
            scene.render();
            lastTimestamp = currentTimestamp;
        });

    }

    ClickEvent(event : IPointerEvent, pickResult : PickingInfo) : void {
        if (pickResult.hit) {
            if(mode == MODE.Solar) {
                var clickedMesh = pickResult.pickedMesh;
                if(clickedMesh && ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"].includes(clickedMesh.name)) {
                    mode = MODE.Planet;
                    var title = document.getElementById("text");
                    var div = document.getElementById("data");
                    if(div) {
                        div.style.height = "500px";
                        div.style.opacity = "1";
                    }
                    if(clickedMesh.name && title)
                        title.textContent = clickedMesh.name;
                    activePlanet = clickedMesh.name;
                    var initialPosition = clickedMesh.position.clone();
                    var initialScaling = clickedMesh.scaling.clone();
                    var animationFramesPos;
                    var animationFramesScale;

                    if(clickedMesh.name == "saturn") {
                        animationFramesPos = [
                            {
                                frame: 0,
                                value: initialPosition
                            },
                            {
                                frame: 30,
                                value:  new Vector3(-0.6, 0, 0)
                            }
                        ];
                        animationFramesScale = [
                            {
                                frame: 0,
                                value: initialScaling
                            },
                            {
                                frame: 30,
                                value: new Vector3(0.0007, 0.0007, 0.0007)
                            }
                        ];
                    } else {
                        animationFramesPos = [
                            {
                                frame: 0,
                                value: initialPosition
                            },
                            {
                                frame: 30,
                                value:  new Vector3(-0.6, 0, 0)
                            }
                        ];
                        animationFramesScale = [
                            {
                                frame: 0,
                                value: initialScaling
                            },
                            {
                                frame: 30,
                                value: new Vector3(0.0013, 0.0013, 0.0013)
                            }
                        ];
                    }
                    
                    var animationPos = new Animation(
                        "openPlanet",
                        "position",
                        30,
                        Animation.ANIMATIONTYPE_VECTOR3,
                        Animation.ANIMATIONLOOPMODE_CONSTANT 
                    );
                    var animationScale = new Animation(
                        "openPlanet",
                        "scaling",
                        30,
                        Animation.ANIMATIONTYPE_VECTOR3,
                        Animation.ANIMATIONLOOPMODE_CONSTANT 
                    );
                    
                    animationPos.setKeys(animationFramesPos);
                    animationScale.setKeys(animationFramesScale);
                    if(clickedMesh.name == "saturn") {
                        planets['saturn'].animations = [animationPos, animationScale];
                        scene.beginAnimation(planets['saturn'], 0, 60, false);
                        planets['saturnRings'].animations = [animationPos, animationScale];
                        scene.beginAnimation(planets['saturnRings'], 0, 60, false);
                        planets['saturnRingsDown'].animations = [animationPos, animationScale];
                        scene.beginAnimation(planets['saturnRingsDown'], 0, 60, false);
                    } else {
                        clickedMesh.animations = [animationPos, animationScale];
                        scene.beginAnimation(clickedMesh, 0, 60, false);
                    }

                    for (const key in planets) {
                        if (Object.prototype.hasOwnProperty.call(planets, key)) {
                            const mesh = planets[key];
                            var fadeAnimationFrames = [
                                {
                                    frame: 0,
                                    value: mesh.position.y
                                },
                                {
                                    frame: 30,
                                    value:  2
                                }
                            ];
                            var fadeAnimation = new Animation(
                                "fadePlanet",
                                "position.y",
                                30,
                                Animation.ANIMATIONTYPE_FLOAT,
                                Animation.ANIMATIONLOOPMODE_CONSTANT 
                            );
                            fadeAnimation.setKeys(fadeAnimationFrames);
                            if(mesh.name != clickedMesh.name) {
                                mesh.animations = [fadeAnimation];
                                scene.beginAnimation(mesh, 0, 60, false);
                            }
                        }
                    }

                    var cameraPositionAnimation = new Animation(
                        "positionAnimation",
                        "position",
                        30,
                        Animation.ANIMATIONTYPE_VECTOR3,
                        Animation.ANIMATIONLOOPMODE_CONSTANT
                    );
                    var cameraPositionKeyframes = [];
                    cameraPositionKeyframes.push({
                        frame: 0,
                        value: camera.position.clone() // Start with the current camera position
                    });
                    cameraPositionKeyframes.push({
                        frame: 30, // Animation duration in frames
                        value: new Vector3(0, 0, 2) // End with a new position
                    });
                    var cameraRotationAnimation = new Animation(
                        "rotationAnimation",
                        "rotation",
                        30,
                        Animation.ANIMATIONTYPE_VECTOR3,
                        Animation.ANIMATIONLOOPMODE_CONSTANT
                    );
                    var cameraRotationKeyframes = [];
                    cameraRotationKeyframes.push({
                        frame: 0,
                        value: camera.rotation.clone() // Start with the current camera position
                    });
                    cameraRotationKeyframes.push({
                        frame: 30, // Animation duration in frames
                        value: new Vector3(Math.PI / 2, Math.PI / 2, 0) // End with a new position
                    });
                    cameraPositionAnimation.setKeys(cameraPositionKeyframes);
                    cameraRotationAnimation.setKeys(cameraRotationKeyframes);
                    var cameraAnimationGroup = new AnimationGroup("cameraAnimationGroup");
                    cameraAnimationGroup.addTargetedAnimation(cameraPositionAnimation, camera);
                    cameraAnimationGroup.addTargetedAnimation(cameraRotationAnimation, camera);
                    cameraAnimationGroup.play(false);
                }
            } else if(mode == MODE.Planet) {
                mode = MODE.Solar;
                var div = document.getElementById("data");
                if(div) {
                    div.style.height = "0";
                    div.style.opacity = "0";
                }
                for (const key in planets) {
                    if (Object.prototype.hasOwnProperty.call(planets, key)) {
                        const mesh = planets[key];
                        scene.beginAnimation(mesh, 30, 0, false);
                        
                    }
                }
            }
        } else {
        }
    }
}
new App();