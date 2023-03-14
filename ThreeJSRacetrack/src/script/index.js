// Globals
const TRACK_STEPS = 2000;

let app = null;
let stage = null;
let frame = 0;
let speedFactor = 5;

//-------------------------------------------------------------------------------------------------
class Skybox {
    constructor() {
        stage.scene.background = new THREE.CubeTextureLoader().load([
            '../images/skybox_px.jpg',
            '../images/skybox_nx.jpg',
            '../images/skybox_py.jpg',
            '../images/skybox_ny.jpg',
            '../images/skybox_pz.jpg',
            '../images/skybox_nz.jpg',
        ]);
    }
}

//-------------------------------------------------------------------------------------------------
class Ground {
    constructor() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('../images/checker.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.repeat.set(1000, 1000);
        this.material = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        
        this.geometry = new THREE.PlaneGeometry(1000, 1000);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = Math.PI / 2;
        this.mesh.receiveShadow = true;
        stage.scene.add(this.mesh);
        this.ground = this.mesh;
    }
}

//-------------------------------------------------------------------------------------------------
class RacetrackCurve {
    constructor() {
        this.racetrackCurve = new THREE.Group();
        stage.scene.add(this.racetrackCurve);

        // NURBS curve
        this.nurbsControlPoints = [];
        this.nurbsKnots = [];
        this.nurbsDegree = 3;

        this.nurbsControlPoints.push(new THREE.Vector4(-31.5170442652965, 32.1468388535131, 3.12157397731265, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(-56.2794390874725, 36.3878766133962, 1.69961466543061, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(-48.6529234516902, -4.74660159938221, 1.69961466543061, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(-18.0783022580192, 21.9446257840784, 1.69961466543061, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(-0.784873892941589, 28.0196384168769, 1.69961466543061, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(6.76297808976574, 27.9393565522274, 3.24966764540835, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(11.8085590105922, 27.403848863594, 8.29789718309303, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(14.7225090545587, 27.1671825966072, 15.234868180624, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(13.0534854706587, 27.8195060989921, 23.2073657340966, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(9.0657182552699, 28.8170834639474, 28.942666020655, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(0.49398895103512, 30.2185943492661, 31.0846258115476, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(-7.78907126038674, 32.695145577131, 30.2880001836107, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(-14.4740969035994, 33.9755334476611, 22.4230825778952, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(-14.8961609812511, 33.0496240903111, 14.0407857008976, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(-11.8191800799649, 32.8114116717757, 6.72054578940792, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(-2.44090485805394, 32.7420467889606, 3.24966764540835, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(4.17076214445508, 32.1701145539528, 2.67275931100516, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(8.53293992715886, 32.2354750826712, 2.22829553296863, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(14.5746718237961, 31.9305053162216, 1.38487153794159, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(22.6504459511963, 39.6776624320611, 1.78205936677987, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(35.7543059332659, 35.3040048599378, 1.69961466543062, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(33.0387194322662, 22.5812476229171, 1.69961466543062, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(31.7835112338997, 12.9646054740102, 1.69961466543062, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(33.3888832249497, 6.59134538616923, 1.69961466543062, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(26.6276167608211, 2.18142457092616, 1.69961466543062, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(13.5229134920202, -2.29957221455714, 1.69961466543062, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(-0.61161460109662, -0.888891376062561, 2.65341528042946, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(-15.1472502381473, 24.028598922126, 7.51363761675257, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(-31.5170442652965, 33.1468388535131, 2.12157397731265, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(-56.2794390874725, 36.3878766133962, 1.69961466543061, 1));
        this.nurbsControlPoints.push(new THREE.Vector4(-48.6529234516902, -4.74660159938221, 1.69961466543061, 1));

        for (let i = 0; i <= this.nurbsDegree; i++) {
             this.nurbsKnots.push(0);
        }
        // this.nurbsKnots.push(-15.1767974147721);
        // this.nurbsKnots.push(-7.58839870738603);
        // this.nurbsKnots.push(0);
        this.nurbsKnots.push(7.58839870738603);
        this.nurbsKnots.push(15.1767974147721);
        this.nurbsKnots.push(22.7651961221581);
        this.nurbsKnots.push(30.3535948295441);
        this.nurbsKnots.push(37.9419935369302);
        this.nurbsKnots.push(45.5303922443162);
        this.nurbsKnots.push(53.1187909517022);
        this.nurbsKnots.push(60.7071896590883);
        this.nurbsKnots.push(68.2955883664743);
        this.nurbsKnots.push(75.8839870738603);
        this.nurbsKnots.push(83.4723857812464);
        this.nurbsKnots.push(91.0607844886324);
        this.nurbsKnots.push(98.6491831960184);
        this.nurbsKnots.push(106.237581903404);
        this.nurbsKnots.push(113.82598061079);
        this.nurbsKnots.push(121.414379318177);
        this.nurbsKnots.push(129.002778025563);
        this.nurbsKnots.push(136.591176732949);
        this.nurbsKnots.push(144.179575440335);
        this.nurbsKnots.push(151.767974147721);
        this.nurbsKnots.push(159.356372855107);
        this.nurbsKnots.push(166.944771562493);
        this.nurbsKnots.push(174.533170269879);
        this.nurbsKnots.push(182.121568977265);
        this.nurbsKnots.push(189.709967684651);
        this.nurbsKnots.push(197.298366392037);
        this.nurbsKnots.push(204.886765099423);
        this.nurbsKnots.push(212.475163806809);
        this.nurbsKnots.push(220.063562514195);
        this.nurbsKnots.push(227.651961221581);
        this.nurbsKnots.push(203.709967684651);

        // for (let i = 0; i <= this.nurbsDegree; i++) {
        //     this.nurbsKnots.push(0);
        // }
        // for (let i = 0; i < this.nurbsControlPoints.length; i++) {
        //     const knot = (i + 1) / (this.nurbsControlPoints.length - this.nurbsDegree);
        //     this.nurbsKnots.push(THREE.MathUtils.clamp(knot, 0, 1));
        // } 

        this.nurbsCurve = new THREE.NURBSCurve(this.nurbsDegree, this.nurbsKnots, this.nurbsControlPoints);
        this.nurbsGeometry = new THREE.BufferGeometry();
        this.nurbsPoints = this.nurbsCurve.getPoints(TRACK_STEPS);
        for (let i = 0; i < this.nurbsPoints.length; i++) {
            let t = this.nurbsPoints[i].z;
            this.nurbsPoints[i].z = -this.nurbsPoints[i].y;
            this.nurbsPoints[i].y = t;

            this.nurbsPoints[i].x *= 0.1;
            this.nurbsPoints[i].y *= 0.1;
            this.nurbsPoints[i].z *= 0.1;

            this.nurbsPoints[i].x += 1.15;
            this.nurbsPoints[i].y -= 0.05;
            this.nurbsPoints[i].z += 2.0;
        }
        this.nurbsGeometry.setFromPoints(this.nurbsPoints);
        // Schließen der Kurve (der letzte Punkt der Kurve ist nun gleich dem ersten Punkt der Kurve)
        let len = this.nurbsGeometry.attributes.position.array.length;
        let newArray = new Float32Array(len + 3);
        newArray.set(this.nurbsGeometry.attributes.position.array);
        newArray[len] = this.nurbsGeometry.attributes.position.array[0];
        newArray[len + 1] = this.nurbsGeometry.attributes.position.array[1];
        newArray[len + 2] = this.nurbsGeometry.attributes.position.array[2];
        this.nurbsGeometry.attributes.position.count = this.nurbsGeometry.attributes.position.count + 1;
        this.nurbsGeometry.attributes.position.array = newArray;
        this.nurbsMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        this.nurbsLine = new THREE.Line(this.nurbsGeometry, this.nurbsMaterial);
        this.racetrackCurve.add(this.nurbsLine);

        // Indikatoren für die NURBS Stützpunkte
        const geometry = new THREE.SphereGeometry(0.4, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x0080c0,
            flatShading: true,
            shininess: 0
        });
        this.controlPoints = new THREE.Group();
        const sphere = new THREE.Mesh(geometry, material);
        let x = this.nurbsControlPoints[0].x;
        let y = this.nurbsControlPoints[0].y;
        let z = this.nurbsControlPoints[0].z;
        sphere.position.set(x, y, z);
        this.controlPoints.add(sphere);
        for (let i = 1; i < this.nurbsControlPoints.length; i++) {
            x = this.nurbsControlPoints[i].x;
            y = this.nurbsControlPoints[i].y;
            z = this.nurbsControlPoints[i].z;
             const sphereClone = sphere.clone();
             sphereClone.position.set(x, y, z);
             this.controlPoints.add(sphereClone);
        }
        this.controlPoints.scale.set(0.1, 0.1, 0.1);
        this.controlPoints.position.set(1.2, -0.05, 2.1);
        this.controlPoints.rotation.x = -Math.PI / 2;
        this.racetrackCurve.add(this.controlPoints);

        // Die Kurve mit den Stützpunkten soll erstmal nicht sichtbar sein
        this.racetrackCurve.visible = false;

    }
}

//-------------------------------------------------------------------------------------------------
class Racetrack {
    constructor() {
        let _this = this;
        const loader = new THREE.GLTFLoader();
        loader.load(
            '../models/racetrack/racetrack.glb',
            function (obj) {
                obj.scene.traverse(function (node) {
                    if (node.isMesh) {
                        node.castShadow = true;
                    }
                });
                obj.scene.scale.set(0.1, 0.1, 0.1);
                obj.scene.position.set(1.2, -0.05, 2);
                stage.scene.add(obj.scene);
            },
            // called when loading has errors
            function (error) {
                console.log(error);
            }
        );
    }
}

//-------------------------------------------------------------------------------------------------
class Car {
    constructor() {
        let _this = this;
        const loader = new THREE.GLTFLoader();
        loader.load(
            '../models/falloutCar/scene.gltf',
            // called when the resource is loaded
            function (obj) {
                obj.scene.scale.set(0.0008, 0.0008, 0.0008);

                obj.scene.traverse(function (node) {
                    if (node.isMesh) { node.castShadow = true; }
                });
                stage.scene.add(obj.scene);
                _this.car = obj.scene;

                let p1 = stage.racetrackCurveObject.nurbsPoints[0];
                let p2 = stage.racetrackCurveObject.nurbsPoints[1];
                _this.car.position.set(p1.x, p1.y, p1.z);
                 _this.car.lookAt(p2);
            },
            // called when loading has errors
            function (error) {
                console.log(error);
            }
        );
    }

}

//-------------------------------------------------------------------------------------------------
class AmbientLight {
    constructor() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        stage.scene.add(this.ambientLight);
    }
}

//-------------------------------------------------------------------------------------------------
class DirectionalLight {
    constructor() {
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
        this.directionalLight.position.set(40, 44, -110);
        this.directionalLight.target.position.set(0, 0, 0);
        this.directionalLight.castShadow = true;

        this.directionalLight.shadow.mapSize.width = 4096;
        this.directionalLight.shadow.mapSize.height = 4096;

        stage.scene.add(this.directionalLight);
        stage.scene.add(this.directionalLight.target);

        this.directionalLightCameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
        this.directionalLightCameraHelper.visible = false;
        stage.scene.add(this.directionalLightCameraHelper);

        this.directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight);
        this.directionalLightHelper.visible = false;
        stage.scene.add(this.directionalLightHelper);
    }
}

//-------------------------------------------------------------------------------------------------
class Stage {
    constructor() {
        const w = app.renderPanel.offsetWidth;
        const h = app.renderPanel.offsetHeight;
        const fov = 60;
        const aspectRatio = w / h;
        const nearPlane = 0.1;
        const farPlane = 1000;

        this.camera = new THREE.PerspectiveCamera(fov, aspectRatio, nearPlane, farPlane);
        this.camera.position.set(-2, 1.6, 8);

        this.scene = new THREE.Scene();
        const near = 1;
        const far = 30;
        const color = '#c0cad0';
        this.scene.fog = new THREE.Fog(color, near, far);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(w, h);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setAnimationLoop(this.animationLoop);
        app.renderPanel.appendChild(this.renderer.domElement);

        this.cameraControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.cameraControl.minPolarAngle = 0.1;
        this.cameraControl.maxPolarAngle = 1.5;
        this.cameraControl.minDistance = 2;
        this.cameraControl.maxDistance = 50;
    }

    initObjects() {
        this.skyboxObject = new Skybox();
        this.groundObject = new Ground();
        this.racetrackCurveObject = new RacetrackCurve();
        this.racetrackObject = new Racetrack();
        this.carObject = new Car();
        this.ambientLightObject = new AmbientLight();
        this.directionalLightObject = new DirectionalLight();
    }

    animationLoop(time) {
        if (app.isAnimationMode) {
            let car = stage.carObject.car;
            let idx = (frame * speedFactor) % stage.racetrackCurveObject.nurbsPoints.length;
            let p1 = stage.racetrackCurveObject.nurbsPoints[idx];
            let p2 = stage.racetrackCurveObject.nurbsPoints[(idx + 1) % stage.racetrackCurveObject.nurbsPoints.length];
            car.position.set(p1.x, p1.y, p1.z);
            car.lookAt(p2);

            if (p1.y > 1.75) {
                car.up.set(0, -1, 0);
            } else {
                car.up.set(0, 1, 0);
            }
            // if (steigung <= 90°) {
            //     car.up.set(0, 1, 0);
            // } else {
            //     car.up.set(0, -1, 0);
            // }
            frame++;
        }
        stage.renderer.render(stage.scene, stage.camera);
    }
}

//-------------------------------------------------------------------------------------------------
class App {
    constructor() {
        this.mainPanel = document.getElementById("mainPanel");
        this.renderPanel = document.getElementById("renderPanel");
        this.buttonPanel = document.getElementById("buttonPanel");
        this.startButton = document.getElementById("startButton");
        this.speedUpButton = document.getElementById("speedUpButton");
        this.speedDownButton = document.getElementById("speedDownButton");
        this.lightButton = document.getElementById("lightButton");
        this.trackButton = document.getElementById("trackButton");
        this.fullscreenButton = document.getElementById("fullscreenButton");

        this.isAnimationMode = false;
        this.isLightHelperVisible = false;
        this.isRacetrackHelperVisible = false;
        this.isFullscreen = false;

        window.onresize = () => {
            if (this.renderPanel != null && stage.camera != null && stage.renderer != null) {
                stage.camera.aspect = this.renderPanel.offsetWidth / this.renderPanel.offsetHeight;
                stage.camera.updateProjectionMatrix();
                stage.renderer.setSize(this.renderPanel.offsetWidth, this.renderPanel.offsetHeight);
            }
        }
        this.startButton.onclick = () => {
            if (this.isAnimationMode) {
                this.startButton.innerHTML = "<i class='fa fa-play' aria-hidden='true'></i>";
                this.startButton.classList.remove("checked");
                this.isAnimationMode = false;
            } else {
                frame = 0;
                this.startButton.innerHTML = "<i class='fa fa-stop' aria-hidden='true'></i>";
                this.startButton.classList.add("checked");
                this.isAnimationMode = true;
            }
        }
        this.speedUpButton.onclick = () => {
            frame = 0;
            speedFactor = Math.min(speedFactor + 1, 20);
        }
        this.speedDownButton.onclick = () => {
            frame = 0;
            speedFactor = Math.max(speedFactor - 1, 1);
        }
        this.lightButton.onclick = () => {
            if (this.isLightHelperVisible) {
                stage.directionalLightObject.directionalLightCameraHelper.visible = false;
                stage.directionalLightObject.directionalLightHelper.visible = false;
                this.lightButton.classList.remove("checked");
                this.isLightHelperVisible = false;
            } else {
                stage.directionalLightObject.directionalLightCameraHelper.visible = true;
                stage.directionalLightObject.directionalLightHelper.visible = true;
                this.lightButton.classList.add("checked");
                this.isLightHelperVisible = true;
            }   
        }
        this.trackButton.onclick = () => {
            if (this.isRacetrackHelperVisible) {
                stage.racetrackCurveObject.racetrackCurve.visible = false;
                this.trackButton.classList.remove("checked");
                this.isRacetrackHelperVisible = false;
            } else {
                stage.racetrackCurveObject.racetrackCurve.visible = true;
                this.trackButton.classList.add("checked");
                this.isRacetrackHelperVisible = true;
            }
        }
        this.fullscreenButton.onclick = () => {
            if (this.isFullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                    this.fullscreenButton.innerHTML = "<i class='fa fa-window-maximize' aria-hidden='true'></i>";
                    this.fullscreenButton.classList.remove("checked");
                    this.isFullscreen = false;
                }
            } else {
                if (document.body.requestFullscreen) {
                    document.body.requestFullscreen();
                    this.fullscreenButton.innerHTML = "<i class='fa fa-window-minimize' aria-hidden='true'></i>";
                    this.fullscreenButton.classList.add("checked");
                    this.isFullscreen = true;
                }
            }
        }

    }
}

//-------------------------------------------------------------------------------------------------
// Start the application
//-------------------------------------------------------------------------------------------------
app = new App();
stage = new Stage();
stage.initObjects();
