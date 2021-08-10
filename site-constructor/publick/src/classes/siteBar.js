import {model} from "../model"
import {toCSSotherStyle} from "../utilits"
import {SiteBarGen} from "./sideBar-gen"

export class SiteBar{
    constructor(selector, addCallback, updateCallBack, deleteCallBack){
        this.$el = document.querySelector(selector);
        this.addBlock = addCallback;
        this.update = updateCallBack;
        this.delete = deleteCallBack;

        this.init();

    }

    init(){
        new SiteBarGen();
        document.querySelector(".form-update").addEventListener('submit', this.updateStyle.bind(this));
        document.querySelector(".form-delete").addEventListener('submit', this.deleteBlock.bind(this));
        document.querySelectorAll(".formAddBlock").forEach(el => {
            el.addEventListener('submit', this.add.bind(this));
        })
    }

    add(event){
        event.preventDefault();
        
        let obj = {};
        obj.style = {};

        for(let el of model){
            if(event.target.dataset.name === el.tag){
                obj.exeFunc = el.exeFunc;
                if("value" in el)  {
                    obj.value = event.target.value.value;
                    event.target.value.value = "";   
                }
                 
                if("src" in el)  {
                    obj.src = event.target.src.value;
                    event.target.src.value = ""; 
                }
                 
                if("href" in el)  {
                    obj.href = event.target.href.value;
                    event.target.href.value = ""; 
                }
                 
                 obj.tag = event.target.tag ? event.target.tag.value : el.tag; 
                 if(event.target.tag) event.target.tag.value = "";

                 obj.class = event.target.class.value;
                 event.target.class.value = "";
            }
             
        }

        obj.intoBlock = event.target.intoBlock ? event.target.intoBlock.value : "";
        event.target.intoBlock.value = "";
        
        let objKeys = Object.keys(model[0].style)
        for(let prop of objKeys){
            if(event.target[`${prop}`]){
                obj.style[`${prop}`] =  event.target[`${prop}`].value ;
                event.target[`${prop}`].value = "";
            }
        }

        obj.style = toCSSotherStyle(event.target.otherStyle.value, obj.style)
        event.target.otherStyle.value = "";


        this.addBlock(obj);
    }

    updateStyle(event){
        event.preventDefault();
        this.update(event.target.classBlock.value, event.target.updateBlock.value);
        event.target.classBlock.value = event.target.updateBlock.value = "";
    }

    deleteBlock(event){
        event.preventDefault();
        this.delete(event.target.classBlockDelete.value);
        event.target.classBlockDelete.value = "";
    }

}