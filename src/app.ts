import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, 
    Scene, 
    ArcRotateCamera, 
    Vector4, 
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
    Sound,
    Space,
    Tools,
    Axis,
    Quaternion,
    DynamicTexture,
    ShaderMaterial} from "@babylonjs/core";

enum MODE {
    Solar = 1,
    Planet = 2,
    MONUMENTS = 3,
    ITINERARY = 4
}
let mode : MODE = MODE.Solar;
let scene : Scene;
let planets : { [key: string]: Mesh } = {};
let activePlanet : string;
let activePlanetPos : Vector3;
let activePlanetScale : Vector3;
let camera: ArcRotateCamera;
var canvas : HTMLCanvasElement;
let data : any;
var light1: HemisphericLight;
var light2: HemisphericLight | null;
var points : Mesh[] = [];
var clickedPoint : Mesh | null;

class App {

    constructor() {
        canvas = document.createElement("canvas");
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
        camera.upperRadiusLimit = 9;
        light1 = new HemisphericLight("light1", new Vector3(2, 0, 0), scene);
        
        /*var backgroundMusic = new Sound("backgroundMusic", "assets/bgMusic.mp3", scene, null, {
            loop: true,
            autoplay: true
        });*/

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

        var url = "data.json?v=1";
        fetch(url)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(function(jsonData) {
                data = jsonData;
                console.log(data);
            })
            .catch(function(error) {
                console.error("Fetch error:", error);
            });

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
        
        var skybox = Mesh.CreateBox("skyBox", 20.0, scene);
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

        var closeBtn = document.querySelector(".closeContainer") as HTMLElement;
        if(closeBtn) {
            closeBtn.addEventListener("click", () => {
                closeBtn.style.opacity = "0";
                points.forEach(point => {
                    point.dispose();
                });
                points = [];
                for (const key in planets) {
                    if (Object.prototype.hasOwnProperty.call(planets, key)) {
                        const mesh = planets[key];
                        mesh.position.z -= 20;
                    }
                }
                for (const key in planets) {
                    if (Object.prototype.hasOwnProperty.call(planets, key)) {
                        const mesh = planets[key];
                        if(mesh.name != activePlanet)
                            scene.beginAnimation(mesh, 30, 0, false);
                    }
                }
                var animationFramesPos = [
                    {
                        frame: 0,
                        value: planets[activePlanet].position.clone()
                    },
                    {
                        frame: 30,
                        value:  activePlanetPos
                    }
                ];
                var animationFramesScale = [
                    {
                        frame: 0,
                        value: planets[activePlanet].scaling.clone()
                    },
                    {
                        frame: 30,
                        value: activePlanetScale
                    }
                ];
                
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
                camera.target = new Vector3(0, 0, 0);
                
                animationPos.setKeys(animationFramesPos);
                animationScale.setKeys(animationFramesScale);
                if(activePlanet == "saturn") {
                    planets['saturn'].animations = [animationPos, animationScale];
                    scene.beginAnimation(planets['saturn'], 0, 60, false);
                    planets['saturnRings'].animations = [animationPos, animationScale];
                    scene.beginAnimation(planets['saturnRings'], 0, 60, false);
                    planets['saturnRingsDown'].animations = [animationPos, animationScale];
                    scene.beginAnimation(planets['saturnRingsDown'], 0, 60, false);
                } else {
                    planets[activePlanet].animations = [animationPos, animationScale];
                    scene.beginAnimation(planets[activePlanet], 0, 60, false);
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
                var cameraAnimationGroup = new AnimationGroup("cameraAnimationGroup2");
                cameraAnimationGroup.addTargetedAnimation(cameraPositionAnimation, camera);
                cameraAnimationGroup.addTargetedAnimation(cameraRotationAnimation, camera);
                cameraAnimationGroup.play(false);
                mode = MODE.Solar;
                
                light1.direction = new Vector3(2, 0, 0);
                light2 = null;

            });
        }

        document.querySelector('.data .monuments')?.addEventListener('click', () => {
            if(mode == MODE.Planet) {
                mode = MODE.MONUMENTS;
                if(closeBtn) {
                    closeBtn.style.opacity = "1";
                }

                var title = document.querySelector(".title .text") as HTMLElement;
                var div = document.querySelector(".data") as HTMLElement;
                if(div) {
                    div.style.height = "0";
                    div.style.opacity = "0";
                }
                const clickedMesh = planets[activePlanet];
                var initialPosition = clickedMesh.position.clone();
                var initialRotation = clickedMesh.rotation.clone();
                var initialScaling = clickedMesh.scaling.clone();
                var animationFramesPos;
                var animationFramesScale;
                var animationFramesRotation;

                animationFramesPos = [
                    {
                        frame: 0,
                        value: initialPosition
                    },
                    {
                        frame: 30,
                        value:  new Vector3(0, 0, -2)
                    }
                ];
                animationFramesRotation = [
                    {
                        frame: 0,
                        value: initialRotation
                    },
                    {
                        frame: 30,
                        value:  new Vector3(0, Math.PI , 0)
                    }
                ];
                animationFramesScale = [
                    {
                        frame: 0,
                        value: initialScaling
                    },
                    {
                        frame: 30,
                        value: new Vector3(0.0025, 0.0025, 0.0025)
                    }
                ];
                
                var animationPos = new Animation(
                    "openPlanet",
                    "position",
                    30,
                    Animation.ANIMATIONTYPE_VECTOR3,
                    Animation.ANIMATIONLOOPMODE_CONSTANT 
                );
                var animationRotation = new Animation(
                    "openPlanet",
                    "rotation",
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
                camera.target = new Vector3(0, 0, -2);
                
                animationPos.setKeys(animationFramesPos);
                animationRotation.setKeys(animationFramesRotation);
                animationScale.setKeys(animationFramesScale);
                if(clickedMesh.name == "saturn") {
                    planets['saturn'].animations = [animationPos, animationScale, animationRotation];
                    scene.beginAnimation(planets['saturn'], 0, 60, false);
                    planets['saturnRings'].animations = [animationPos, animationScale, animationRotation];
                    scene.beginAnimation(planets['saturnRings'], 0, 60, false);
                    planets['saturnRingsDown'].animations = [animationPos, animationScale, animationRotation];
                    scene.beginAnimation(planets['saturnRingsDown'], 0, 60, false);
                    planets['saturn'].rotationQuaternion = null;
                    planets['saturnRings'].rotationQuaternion = null;
                    planets['saturnRingsDown'].rotationQuaternion = null;
                } else {
                    clickedMesh.rotationQuaternion = null;
                    clickedMesh.animations = [animationPos, animationScale, animationRotation];
                    scene.beginAnimation(clickedMesh, 0, 60, false);
                }

                for (const key in planets) {
                    if (Object.prototype.hasOwnProperty.call(planets, key)) {
                        const mesh = planets[key];
                        mesh.position.z += 20;
                    }
                }

                light1.direction = new Vector3(0, 1, 0);
                light2 = new HemisphericLight("light2", new Vector3(0, -1, 0), scene);
                data[activePlanet]['monuments'].forEach((monument : any, key : number ) => {
                    var sphere = MeshBuilder.CreateSphere("sphere", { diameter: 0.05 }, scene);
                    sphere.position.z = -0.75;
                    sphere.rotateAround(new Vector3(0, 0, -2), new Vector3(1, 0, 0), monument.latitude);
                    sphere.rotateAround(new Vector3(0, 0, -2), new Vector3(0, 1, 0), monument.longitude);
                    /*setInterval(() => {
                        //sphere.rotateAround(new Vector3(0, 0, -2), new Vector3(1, 0, 0), Math.PI / 50);
                    }, 100);*/
                    var material = new StandardMaterial("sphereMaterial", scene);
                    material.diffuseColor = new Color3(1, 0, 0); // Red color
                    sphere.material = material;
                    sphere.name = key.toString();
                    points.push(sphere);
                });
            }
        })

        scene.onPointerDown = this.ClickEvent;


        scene.onPointerMove = function (evt, pickInfo) {
            console.log(pickInfo.pickedMesh);
            points.forEach(point => {
                if (pickInfo.hit && pickInfo.pickedMesh === point) {
                    scene.getEngine().getRenderingCanvas()?.classList.add('hover-pointer');
                } else {
                    scene.getEngine().getRenderingCanvas()?.classList.remove('hover-pointer');
                }
            });
        };

        let lastTimestamp = performance.now();
        engine.runRenderLoop(() => {
            var currentTimestamp = performance.now();
            var deltaTime = (currentTimestamp - lastTimestamp) / 1000;
            if(planets['mercury']) {
                if(mode == MODE.Solar) {
                    planets['mercury'].rotate(new Vector3(0.999, 0.00059, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['mercury'], Space.WORLD);
                } else if (mode == MODE.Planet) {
                    planets['mercury'].rotate(new Vector3(0.999, 0.00059, 0), angularVelocity * deltaTime, Space.WORLD);
                }
            }
            if(planets['venus']) {
                if(mode == MODE.Solar) {
                    planets['venus'].rotate(new Vector3(-0.9989, 0.04536, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['venus'], Space.WORLD);
                } else if (mode == MODE.Planet) {
                    planets['venus'].rotate(new Vector3(-0.9989, 0.04536, 0), angularVelocity * deltaTime, Space.WORLD);
                }
            }
            if(planets['earth']) {
                if(mode == MODE.Solar) {
                    planets['earth'].rotate(new Vector3(0.9174, 0.3979, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['earth'], Space.WORLD);
                } else if (mode == MODE.Planet) {
                    planets['earth'].rotate(new Vector3(0.9174, 0.3979, 0), angularVelocity * deltaTime, Space.WORLD);
                }
            }
            if(planets['mars']) {
                if(mode == MODE.Solar) {
                    planets['mars'].rotate(new Vector3(0.9048, 0.42577, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['mars'], Space.WORLD);
                } else if (mode == MODE.Planet) {
                    planets['mars'].rotate(new Vector3(0.9048, 0.42577, 0), angularVelocity * deltaTime, Space.WORLD);
                }
            }
            if(planets['jupiter']) {
                if(mode == MODE.Solar) {
                    planets['jupiter'].rotate(new Vector3(0.9985, 0.05407, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['jupiter'], Space.WORLD);
                } else if (mode == MODE.Planet) {
                    planets['jupiter'].rotate(new Vector3(0.9985, 0.05407, 0), angularVelocity * deltaTime, Space.WORLD);
                }
            }
            if(planets['saturn'] && planets['saturnRings'] && planets['saturnRingsDown']) {
                if(mode == MODE.Solar) {
                    //planets['saturn'].rotate(new Vector3(0.89337, 0.4493, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['saturn']);
                    planets['saturn'].rotate(new Vector3(0.89337, 0.4493, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['saturn'], Space.LOCAL);
                    planets['saturnRings'].rotate(new Vector3(0.89337, 0.4493, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['saturn'], Space.LOCAL);
                    planets['saturnRingsDown'].rotate(new Vector3(0.89337, 0.4493, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['saturn'], Space.LOCAL);
                } else if (mode == MODE.Planet) {
                    planets['saturn'].rotate(new Vector3(0.89337, 0.4493, 0), angularVelocity * deltaTime, Space.LOCAL);
                    planets['saturnRings'].rotate(new Vector3(0.89337, 0.4493, 0), angularVelocity * deltaTime, Space.LOCAL);
                    planets['saturnRingsDown'].rotate(new Vector3(0.89337, 0.4493, 0), angularVelocity * deltaTime, Space.LOCAL);
                }
            }
            if(planets['uranus']) {
                if(mode == MODE.Solar) {
                    planets['uranus'].rotate(new Vector3(-0.1357, 0.9907, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['uranus'], Space.WORLD);
                } else if (mode == MODE.Planet) {
                    planets['uranus'].rotate(new Vector3(-0.1357, 0.9907, 0), angularVelocity * deltaTime, Space.WORLD);
                }
            }
            if(planets['neptune']) {
                if(mode == MODE.Solar) {
                    planets['neptune'].rotate(new Vector3(0.88, 0.474, 0), angularVelocity * deltaTime * relativeRotationalSpeeds['neptune'], Space.WORLD);
                } else if (mode == MODE.Planet) {
                    planets['neptune'].rotate(new Vector3(0.88, 0.474, 0), angularVelocity * deltaTime, Space.WORLD);
                }
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
                    var title = document.querySelector(".title .text") as HTMLElement;
                    var div = document.querySelector(".data") as HTMLElement;
                    var content = document.querySelector(".data .content") as HTMLElement;
                    if(div) {
                        div.style.height = "500px";
                        div.style.opacity = "1";
                    }
                    activePlanet = clickedMesh.name;
                    if(content && data) {
                        content.innerHTML = "";
                        if(data[activePlanet] && data[activePlanet]['data']) {
                            data[activePlanet]["data"].forEach((element : {"type" : String, "value" : String}, key : number) => {
                                if(element.type == "number") {
                                    content.innerHTML += `<div class="element ${element.type} ${element.type == "number" && data[activePlanet]["data"][key + 1]['type'] != "number"?"last":null}"><label class="f">${element.value.split(':')[0]}</label><label class="l">${element.value.split(':')[1]}</label></div>`;
                                } else {
                                    content.innerHTML += `<div class="element ${element.type}">${element.value}</div>`;
                                }
                            });
                        }
                        var btns = document.querySelector(".buttons") as HTMLElement;
                        if(!["mars", "saturn"].includes(clickedMesh.name)) {
                            div.classList.add("no-btns");
                            btns.style.display = "none";
                        } else {
                            div.classList.remove("no-btns");
                            btns.style.display = "flex";
                        }
                    }
                    if(clickedMesh.name && title)
                        title.textContent = clickedMesh.name;
                    var initialPosition = clickedMesh.position.clone();
                    var initialScaling = clickedMesh.scaling.clone();
                    activePlanetPos = initialPosition;
                    activePlanetScale = initialScaling;
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
                                value: new Vector3(0.0013, 0.0013, 0.0013)
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
            } else if (mode == MODE.Planet) {
                mode = MODE.Solar;  
                var title = document.querySelector(".title .text") as HTMLElement;
                var div = document.querySelector(".data") as HTMLElement;
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
            } else if (mode == MODE.MONUMENTS) {
                if(pickResult.pickedMesh){
                    if(data[activePlanet]['monuments'].length >= parseInt(pickResult.pickedMesh.name) + 1) {
                        let site = data[activePlanet]['monuments'][pickResult.pickedMesh.name];
                        clickedPoint = pickResult.pickedMesh as Mesh;
                        if (pickResult.pickedMesh.material) {
                            var standardMaterial = pickResult.pickedMesh.material as StandardMaterial;
                            standardMaterial.diffuseColor = new Color3(0, 1, 0);
                        }
                        var title = document.querySelector(".title .text") as HTMLElement;
                        var div = document.querySelector(".data") as HTMLElement;
                        var content = document.querySelector(".data .content") as HTMLElement;
                        if(div) {
                            title.innerHTML = site.name;
                            div.classList.add("no-btns");
                            div.style.height = "500px";
                            div.style.opacity = "1";
                        }
                        if(content && data) {
                            content.innerHTML = "";
                            content.innerHTML += `<img class="img" src='/assets/${activePlanet}${parseInt(pickResult.pickedMesh.name) + 1}.jpg' />`;
                            content.innerHTML += `<div class="number"><label class="f">Latitude</label><label class="l">${site.latitude}</label></div>`;
                            content.innerHTML += `<div class="number last"><label class="f">Longitude</label><label class="l">${site.longitude}</label></div>`;
                            content.innerHTML += `<div class="text">${site.details}</div>`;
                            var btns = document.querySelector(".buttons") as HTMLElement;
                            btns.style.display = "none";
                        }
                    } else {
                        var title = document.querySelector(".title .text") as HTMLElement;
                        var div = document.querySelector(".data") as HTMLElement;
                        if(div) {
                            div.style.height = "0";
                            div.style.opacity = "0";
                        }
                        if(clickedPoint) {
                            var standardMaterial = clickedPoint.material as StandardMaterial;
                            standardMaterial.diffuseColor = new Color3(1, 0, 0);
                            clickedPoint = null;
                        }
                    }
                }
            }
        } else {
        }
    }
}
new App();