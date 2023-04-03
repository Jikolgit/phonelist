//Classe qui s'occupe de la barre de chargement
import gsap from 'gsap'

import * as THREE from 'three'
export class LoaderManager{

            constructor(gltfloader){
                this.loader= new THREE.LoadingManager()
                this.assetLoad = gltfloader;
                this.assetLoad.manager = this.loader;
            }

            init(){
                this.loader.onProgress=function(url,loaded,total){
                    document.querySelector('#progression').value=(loaded/total)*100;
            
                  }
                  this.loader.onLoad=()=>{
                    
                    setTimeout(()=>{this.loaderFadeOut()},1500);
                   // this.loaderFadeOut();
                    
                  }
            }
            
            loaderFadeOut(){
               
                let alpha = {val:1};
                gsap.to(alpha,{
                    val:0,
                    duration:0.5,
                    onStart:()=>{
                        document.querySelector('#progression').style.display='none'
                    },
                    onUpdate: ()=>{
                        
                        document.querySelector('#loaderContainer').style.backgroundColor = `rgba(22, 22, 22, ${alpha.val})` ;
                    },
                    onComplete:()=>{
                        document.querySelector('#loaderContainer').style.display='none'
                    }
                })
            }


}