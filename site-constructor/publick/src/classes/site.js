import {Block} from "./block"



export class Site {
    constructor(itme){
        this.$container = document.querySelector(itme)

        
        
    }

    render(arrItems){
        this.$container.innerHTML = '';
        let block = new Block();
        for(let key of arrItems){
            let $element = key.intoBlock ? document.querySelector(key.intoBlock) : this.$container;
            $element.insertAdjacentHTML('beforeend', block[key.exeFunc](key));
        }
    }

}