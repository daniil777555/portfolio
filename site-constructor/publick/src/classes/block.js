import {toCSS} from "../utilits"

export class Block {
    constructor(){

        
    }

    innerBlock(block){
        if(block){
            return `
                <${block.tag} class="${block.class}" style="${toCSS(block.style)}">
                    ${block.value}
                </${block.tag}>
            ` 
        }
    }

    innerImg(img){
        if(img){
            return `
                <img src="${img.src}" alt="${img.alt}" class="${img.class}" style="${toCSS(img.style)}"/>
            ` 
        }
    }

    innerLink(link){
        if(link){
            return `
                <${link.tag} href="${link.href}" class="${link.class}" style="${toCSS(link.style)}">
                    ${link.value}
                </${link.tag}>
            ` 
        }
    }

    
    
}

