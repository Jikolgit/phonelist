import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import appleLogosrc from './appleLogoTXT.png';
import Extra from './extra';

import { LoaderManager } from './loader_template';


export class ModelLoading{

    constructor(scene,renderer,orbit,camera){
        this.extra = new Extra();
        this.camera = camera;
        this.orbit = orbit;
        this.carWave;
        //this.dloader = new DRACOLoader();
        //this.dloader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        //this.dloader.setDecoderConfig({type:'js'});
        this.shopOut = new URL('phones.glb',import.meta.url);
        this.phoneLIst=['iphone13','iphone6s'];
        this.actualPhone=0;
        this.loadedModel,this.modelAnimation;
        this.assetLoad = new GLTFLoader();
        this.hdriSrc = 'studio3.hdr';
        //this.assetLoad.setDRACOLoader(this.dloader);
        this.loadingManager = new LoaderManager(this.assetLoad)
        this._loader;
        this.scene = scene;
        this.ambilight = new THREE.AmbientLight(0x333333,2);
        this.light1 = new THREE.PointLight(0xCF830F,1.7,50);
        this.light1Helper = new THREE.PointLightHelper(this.light1,1,0xFF5733);
        this.light2 = new THREE.PointLight(0xFF9300,2,85.7);
        this.light2Helper = new THREE.PointLightHelper(this.light2,1,0xFF5733);
        this.Hemislight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1.5 );
        this.HemisLightHelp = new THREE.HemisphereLightHelper(this.Hemislight,3,0xFF5733)
        this.datG = new dat.GUI();
        this.gFold0 = this.datG.addFolder('light');
        this.gFold1 = this.datG.addFolder('sceneStat');
        this.gFold2 = this.datG.addFolder('carPOsition');
        this.mixer,this.clip,this.action,this.animationStart=false;
        this.clock = new THREE.Clock();
        this.datOption = {
            renderCol:0x272727,lampaONOFF:true,day:true,startCar:false,
            light1X:0,light1Y:0,light1Z:0,intensit1:5,color1:0xCF830F,distance1:200,emission1:0,
            light2X:0,light2Y:0,light2Z:0,intensit2:5,color2:0xCF830F,distance2:200,
            Hemislight1X:0,Hemislight1Y:0,Hemislight1Z:0,Hemisintensit1:5,
            busX:0,busY:0,busZ:0,
            bus2X:0,bus2Y:0,bus2Z:0,
            carX:0,carY:0,carZ:0,
            motoX:0,motoY:0,motoZ:0,
            AmbienIntens:2,sceneLight:true,
        
        };
        this.rgbLoad = new RGBELoader();
        this.renderer = renderer;
        this.carList = ['bus1','bus2','car','motoRoad'];
        this.car = {start:-186.7,fadeInStart:-186.7,fadeOutStart:80,end:122.1,fadeOutStartONCE:false};
        this.carNumber = 0;
        this.txt;
        this.busClone;
        this.clonedMOdelArr=[];
        this.day=true;
        this.setEventOnce = false;
    }
    findmaterial(elem){
        return elem.material.name == 'window3'
    }
    findmaterial2(elem){
        return elem.material.name == 'lampa1'
    }
    findmaterial3(elem){
        return elem.material.name == 'ampoule_1'
    }

    nightParam(){
        this.light1.position.set(6.9,18.2,18.2);
        this.light1.intensity=2.3

      this.loadedModel.getObjectByName('lampadaire').children.find(this.findmaterial2).material.emissiveIntensity=1
      this.loadedModel.getObjectByName('ampoule').children.find(this.findmaterial3).material.emissiveIntensity=1
      this.loadedModel.getObjectByName('vitre').children.find(this.findmaterial).material.emissive.set(0x989898)
      this.loadedModel.getObjectByName('vitre').children.find(this.findmaterial).material.roughness=1
      this.loadedModel.getObjectByName('vitre').children.find(this.findmaterial).material.metalness=1;
        this.renderer.setClearColor(0xf0f0f);
        this.scene.remove(this.Hemislight);
        this.scene.remove(this.HemisLightHelp);
        this.scene.add(this.light1);
        //this.scene.add(this.light1Helper);
        this.scene.add(this.light2);
        //this.scene.add(this.light2Helper);
        this.scene.add(this.ambilight);
    }
    dayParam(){
       // this.renderer.toneMapping = THREE.ReinhardToneMapping;
       // this.renderer.toneMappingExposure=1
        this.setHDRI();
        this.renderer.setClearColor(new THREE.Color('rgb(255,255,255)'), 0);
        this.scene.remove(this.light1);
        this.scene.remove(this.light1Helper);
        this.scene.remove(this.light2);
        this.scene.remove(this.light2Helper);
        this.scene.remove(this.ambilight);
        this.scene.remove(this.Hemislight);
        this.scene.remove(this.HemisLightHelp);

       
    }
    setDayorNight(){
        if(this.day){this.nightParam();this.day=false;}
        else{this.dayParam();this.day=true;}
    }
    init(){


        this.light1.position.set(5.9,11.2,-8.65);
        this.light2.position.set(24.4,20,-28.5);
        this.Hemislight.position.set(24.95,29.45,-6.6);
        //this.light2.position.set(17.8,42.05,-10.85);
        this.camera.position.set(-9.8,29.83,-64.05);
        this.orbit.target.y=-5
        //this.orbit.enablePan=false
       

        this.dayParam();
        this.loadmodel();
        
        this._datgui();
    }
    nextInit(){
       
        this.setColorPanel(0)
        

       
    }
    setColorPanel(index){
        let stringg = this.extra.createColorSelect(this.extra.phoneList[index]);
        //console.log(stringg)
        this.setEvent(stringg)
    }
    setHDRI(){
        
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.rgbLoad.load(new URL(this.hdriSrc,import.meta.url),(txt)=>{
            txt.mapping = THREE.EquirectangularReflectionMapping; 
           // scene.background=txt;
           this.txt = txt
            this.scene.environment=this.txt;
            this.scene.envMapIntensity=0;
       
        })
        
    }

    _datgui(){
        this.gFold1.add(this.datOption,'startCar').onChange((e)=>{
            if(e==false){
                
                
                
            }
            else if(e){
                
            }
        })
        this.gFold1.add(this.datOption,'day').onChange((e)=>{
            if(e==false){
                
                this.nightParam();
            }
            else if(e){
                this.dayParam();
            }
        })
        this.gFold1.add(this.datOption,'lampaONOFF').onChange((e)=>{
            if(e==false){
                
                this.loadedModel.getObjectByName('lampadaire').children.find(this.findmaterial2).material.emissiveIntensity=0
            }
            else if(e){
                
                this.loadedModel.getObjectByName('lampadaire').children.find(this.findmaterial2).material.emissiveIntensity=1
            }
        })
        this.gFold1.addColor(this.datOption,'renderCol').onChange((e)=>{this.renderer.setClearColor(e);})
        this.gFold0.add(this.datOption,'light1X',-100,100,0.05).onChange((e)=>{this.light1.position.x=e})
        this.gFold0.add(this.datOption,'light1Y',-100,100,0.05).onChange((e)=>{this.light1.position.y=e})
        this.gFold0.add(this.datOption,'light1Z',-100,100,0.05).onChange((e)=>{this.light1.position.z=e})
        this.gFold0.add(this.datOption,'intensit1',0,10,0.05).onChange((e)=>{this.light1.intensity=e})
        this.gFold0.add(this.datOption,'distance1',0.1,400,0.05).onChange((e)=>{this.light1.distance=e})

        this.gFold0.add(this.datOption,'emission1',0,100,0.05).onChange((e)=>{
            this.loadedModel.getObjectByName('ampoule').children[1].material.emissiveIntensity=e;
        })
        this.gFold0.add(this.datOption,'distance1',0.1,400,0.05).onChange((e)=>{this.light1.distance=e})
        //this.gFold0.addColor(this.datOption,'color1').onChange((e)=>{this.light1.color.set(e)})
        this.gFold0.addColor(this.datOption,'color1').onChange((e)=>{this.loadedModel.getObjectByName('vitre').children.find(this.findmaterial).material.emissive.set(e)})
        this.gFold0.add(this.datOption,'light2X',-100,100,0.05).onChange((e)=>{this.light2.position.x=e})
        this.gFold0.add(this.datOption,'light2Y',-100,100,0.05).onChange((e)=>{this.light2.position.y=e})
        this.gFold0.add(this.datOption,'light2Z',-100,100,0.05).onChange((e)=>{this.light2.position.z=e})
        this.gFold0.add(this.datOption,'intensit2',0.1,200,0.05).onChange((e)=>{this.light2.intensity=e}) 
        this.gFold0.add(this.datOption,'distance2',0.1,400,0.05).onChange((e)=>{this.light2.distance=e})
        this.gFold0.addColor(this.datOption,'color2').onChange((e)=>{this.light2.color.set(e)})
        this.gFold2.add(this.datOption,'busX',-100,100,0.05).onChange((e)=>{this.loadedModel.getObjectByName('bus1').position.x=e})
        this.gFold2.add(this.datOption,'busY',-100,100,0.05).onChange((e)=>{this.loadedModel.getObjectByName('bus1').position.y=e})
        this.gFold2.add(this.datOption,'busZ',-500,500,0.05).onChange((e)=>{this.loadedModel.getObjectByName('bus1').position.z=e})
        this.gFold2.add(this.datOption,'bus2X',-100,100,0.05).onChange((e)=>{this.loadedModel.getObjectByName('bus2').position.x=e})
        this.gFold2.add(this.datOption,'bus2Y',-100,100,0.05).onChange((e)=>{this.loadedModel.getObjectByName('bus2').position.y=e})
        this.gFold2.add(this.datOption,'bus2Z',-500,500,0.05).onChange((e)=>{this.loadedModel.getObjectByName('bus2').position.z=e})
        this.gFold2.add(this.datOption,'carX',-100,100,0.05).onChange((e)=>{this.loadedModel.getObjectByName('bus2').position.x=e})
        this.gFold2.add(this.datOption,'carY',-100,100,0.05).onChange((e)=>{this.loadedModel.getObjectByName('bus2').position.y=e})
        this.gFold2.add(this.datOption,'carZ',-500,500,0.05).onChange((e)=>{this.loadedModel.getObjectByName('bus2').position.z=e})
        this.gFold2.add(this.datOption,'motoX',-100,100,0.05).onChange((e)=>{this.loadedModel.getObjectByName('car_4').position.x=e})
        this.gFold2.add(this.datOption,'motoY',-100,100,0.05).onChange((e)=>{console.log(this.loadedModel.getObjectByName('car_4').position.y)})
        this.gFold2.add(this.datOption,'motoZ',-500,500,0.05).onChange((e)=>{console.log(this.loadedModel.getObjectByName('car_4').position.z)})
        this.gFold0.add(this.datOption,'Hemislight1X',-100,100,0.05).onChange((e)=>{this.Hemislight.position.x=e})
        this.gFold0.add(this.datOption,'Hemislight1Y',-100,100,0.05).onChange((e)=>{this.Hemislight.position.y=e})
        this.gFold0.add(this.datOption,'Hemislight1Z',-100,100,0.05).onChange((e)=>{this.Hemislight.position.z=e})
        this.gFold0.add(this.datOption,'Hemisintensit1',0,10,0.05).onChange((e)=>{this.Hemislight.intensity=e})

        this.gFold0.add(this.datOption,'AmbienIntens',0.1,10,0.05).onChange((e)=>{this.ambilight.intensity=e})
        this.datG.hide();
    }

    forUpdate(){
        if(this.animationStart)
        {
            //this.mixer.update(this.clock.getDelta());
            for(let i =0; i< this.phoneLIst.length;i++){
                this.loadedModel.getObjectByName(this.phoneLIst[i]).rotation.y += 0.01 ;
            }
        }
    }
    loadAnimation(){
        /*
        this.mixer = new THREE.AnimationMixer(this.loadedModel);
        this.clip =  THREE.AnimationClip.findByName(this.modelAnimation,"climON");
        this.action = this.mixer.clipAction(this.clip)
        this.action.play();
        */
    }


    loadmodel(){
        this.loadingManager.init();
        this.assetLoad.load(this.shopOut.href,(gltf)=>{

           
            this.loadedModel = gltf.scene
            this.modelAnimation = gltf.animations;

                      
            this.scene.add(this.loadedModel)

            this.loadAnimation();
            this.animationStart=true;
            this.nextInit();
            //this.loadedModel.getObjectByName('appleLogo').material = new THREE.MeshToonMaterial({color:'red'})
            const appleLogotxt = new THREE.TextureLoader().load(appleLogosrc);
            appleLogotxt.flipY=false;
            //this.loadedModel.getObjectByName('appleLogo').material.map = appleLogotxt
            //this.loadedModel.getObjectByName('appleLogo').material.metalness = 1
            this.loadedModel.children[1].children[11].material.map = appleLogotxt
            this.loadedModel.children[1].children[11].material.metalness = 1
            this.loadedModel.children[0].children[13].material.map = appleLogotxt
            this.loadedModel.children[0].children[13].material.metalness = 1
            this.loadedModel.children[0].visible=false //13
            this.loadedModel.children[1].position.set(0,0,0)  //13
            this.loadedModel.children[0].position.set(0,0,0)  //6

            console.log(this.loadedModel.getObjectByName('iphone6s').children[0].material.color)
          
            
  

            
        })
    }
    
    callSwitchPhone(dir){
        
        this.actualPhone = this.extra.switchPhone(dir,this.actualPhone,this.phoneLIst);
        

        for(let i =0; i< this.phoneLIst.length;i++){
            this.loadedModel.getObjectByName(this.phoneLIst[i]).visible=false ;
        }
        this.loadedModel.getObjectByName(this.phoneLIst[this.actualPhone]).visible=true; 
        this.setphoneCount()
        this.setColorPanel(this.actualPhone)
    }
    setEvent(elem){
        if(this.setEventOnce==false){
            document.querySelector('#arrowright').addEventListener('click',()=>{
                this.callSwitchPhone('right');
            })
            document.querySelector('#arrowleft').addEventListener('click',()=>{
                this.callSwitchPhone('left');
            })
            this.setEventOnce=true;
        }
       
        for(let i =0; i<elem.length;i++){
            
            document.querySelector(elem[i].name).addEventListener('click',()=>{
                this.setColor(this.loadedModel,elem[i].name,elem[i].csscolor,elem[i].threeCol);
            })
        }

    }
    setphoneCount(){
        document.querySelector('#itemcount').innerHTML=(this.actualPhone+1)+' / '+this.phoneLIst.length;
        
    }
    setColor(model,x,y,z){
            if(this.actualPhone==0){
                model.getObjectByName('iphone13').children[0].material.color = new THREE.Color(z)
                model.getObjectByName('iphone13').children[4].material.color = new THREE.Color(z)
                model.getObjectByName('iphone13').children[8].material.color = new THREE.Color(z)
            }

            else if(this.actualPhone==1){
                 model.getObjectByName('iphone6s').children[0].material.color = new THREE.Color(z)
                 //model.getObjectByName('iphone6s').children[6].material.color = new THREE.Color(z)
                

                
            }

        //model.getObjectByName('iphone13').material.metalness = 1

    }
}