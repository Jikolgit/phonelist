export default class Extra{
    constructor(){
        this.elem=[];
        this.sendArr=[]; 
        this.phoneList=[];
        this.iphone13_color =[{col:'red',threeColor:'rgb(165, 0, 17)'},{col:'white',threeColor:'rgb(249, 229, 201)'},{col:'black',threeColor:'rgb(23, 30, 39)'}
        ,{col:'bleu',threeColor:'rgb(4, 52, 88)'},{col:'bleu',threeColor:'rgb(54, 73, 53)'},{col:'bleu',threeColor:'rgb(174, 225, 205)'}                             
        ];
        this.iphone6s_color=[{col:'gold',threeColor:'rgb(220, 188, 156)'},
                             {col:'silver',threeColor:'rgb(192, 192, 192)'},{col:'Rose Gold',threeColor:'rgb(239, 192, 185)'}];
        this.phoneList=[this.iphone13_color,this.iphone6s_color];
        
        
    }
    createColorSelect(x){
        this.elem=[];
        this.sendArr=[]; 
        for(let i =0 ; i<x.length;i++){
            this.elem[i] = document.createElement('div')
            this.elem[i].classList.add('colorselect');
            this.elem[i].setAttribute('id','button'+i)
            this.elem[i].style.backgroundColor=x[i].threeColor
            this.sendArr[i]={name:0,csscolor:0,threeCol:0}
            this.sendArr[i].name='#button'+i;
            this.sendArr[i].csscolor=x[i].col;
            this.sendArr[i].threeCol=x[i].threeColor;
        }

      let bic =  this.addElement(this.elem);
        return this.sendArr;
        
    }
    addElement(x){
        document.querySelector('#colorpanel').innerHTML="";
      
            for(let i =0 ; i<this.elem.length;i++)
            {   
                
                document.querySelector('#colorpanel').appendChild(this.elem[i])
            }
           
            return 'bza';

            
        

        
    }
    switchPhone(dir,actualPhone,phoneList){
        if(dir=='left'){
            if(actualPhone ==0){
              
                return 0;
            }
            else{
                actualPhone--;
                
                return actualPhone;
            }
        }
        else if(dir=='right'){
            if(actualPhone == phoneList.length-1){
                
                return (phoneList.length-1);
            }
            else{
                actualPhone++;
               
                return actualPhone;
            }
        }
    }


}