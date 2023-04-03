import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {ModelLoading} from './loadModel_template';



var _canvasWidth,_canvasHeight;

if(document.body.clientWidth>700)
{
    _canvasWidth = document.querySelector('#canvasCont').clientWidth;
    document.querySelector('#canvasCont').style.height = 500+'px';
    document.querySelector('#container3d').style.height = 500+'px';
    _canvasHeight = 500;
}
else
{
    
    document.querySelector('#canvasCont').style.width = window.innerWidth+'px';
    document.querySelector('#container3d').style.width = window.innerWidth+'px';
    _canvasWidth = window.innerWidth
    document.querySelector('#canvasCont').style.height = window.innerHeight+'px';
    document.querySelector('#container3d').style.height = window.innerHeight+'px';
    _canvasHeight = window.innerHeight

    
    
}
const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45,_canvasWidth/_canvasHeight,0.1,2000);
const orbit = new OrbitControls(camera,document.querySelector('#canvasCont'))



renderer.setSize(_canvasWidth,_canvasHeight);
renderer.setPixelRatio( window.devicePixelRatio );




/*

orbit.minDistance=100
orbit.maxDistance=200
orbit.maxAzimuthAngle = Math.PI*(1.4)+5;  //rotation droite
orbit.minAzimuthAngle = Math.PI*(0.6)+5;
orbit.rotateSpeed = 0.2
orbit.maxPolarAngle=1.3 // rotation verticale MAXI

*/
//orbit.enablePan=false
//orbit.enableRotate=false
/*
orbit.touches.ONE = THREE.TOUCH.PAN;
orbit.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
orbit.mouseButtons.LEFT = THREE.MOUSE.PAN;
orbit.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
*/
//orbit.screenSpacePanning=false;


document.querySelector('#canvasCont').appendChild(renderer.domElement);
const _model = new ModelLoading(scene,renderer,orbit,camera);
_model.init();
function _animate()
{
    orbit.update();
 



    _model.forUpdate();
    renderer.render(scene,camera)

    document.querySelector('#cameraPosition').innerHTML='x:'+camera.position.x+'<br>y:'+camera.position.y+'<br>z:'+camera.position.z;
   
}

renderer.setAnimationLoop(_animate)

