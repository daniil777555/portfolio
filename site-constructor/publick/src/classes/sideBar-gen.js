import {model} from "../model"

export class SiteBarGen{
    constructor(){
        this.model = model
        this.$element = document.querySelector("#panel")
        
        this.generate();
    }

    generate(){
        for(let el of this.model){
            let objDetailsStyles = `
            <form class="formStyle formAddBlock" data-name="${el.tag ? el.tag : "block"}"  action="#">
                <details class="details" close>
                    <summary class="styleFor${el.tag ? el.tag.toUpperCase() : "block".toUpperCase()}">Styles ${el.tag ? el.tag : "block"}</summary>
                    <input class="input desk" type="text" name="otherStyle" placeholder="Input other style">
                    <button class="btn" type="submit">Done</button>
                </details>
            </form>
            `;
            this.$element.insertAdjacentHTML('beforeend', objDetailsStyles)


            let objKeys = Object.keys(el.style).reverse()
            let desk = document.querySelector(`.styleFor${el.tag ? el.tag.toUpperCase() : "block".toUpperCase()}`);
            for(let prop of objKeys){
                let styles = `
                    <label class="desk">${prop} <input class="input input-in-label" name="${prop}" type="text" placeholder="Input style"></label>
                `
                desk.insertAdjacentHTML('afterend', styles);
            }


            desk.insertAdjacentHTML('afterend', `
            <label class="desk">into block <input class="input input-in-label" name="intoBlock" type="text" placeholder="block's class"></label>`);

            if("href" in el) desk.insertAdjacentHTML('afterend', `
            <label class="desk">href <input class="input input-in-label" name="href" type="text" placeholder="Input href"></label>`);
            if("src" in el) desk.insertAdjacentHTML('afterend', `
            <label class="desk">src <input class="input input-in-label" name="src" type="text" placeholder="Input src"></label>`);
            if("value" in el) desk.insertAdjacentHTML('afterend', `
            <label class="desk">value <input class="input input-in-label" name="value" type="text" placeholder="Input value"></label>`);

            desk.insertAdjacentHTML('afterend', `
            <label class="desk">Class <input class="input input-in-label" name="class" type="text" placeholder="Input class"></label>`);

            if(el.tag === "block") desk.insertAdjacentHTML('afterend', `
            <label class="desk">Tag <input class="input input-in-label" name="tag" type="text" placeholder="Input tag"></label>`)
        }
        this.$element.insertAdjacentHTML('beforeend',
        `
        <form class="formStyle form-update additional-form" data-name="updateBlock-form"  action="#">
            <label class="desk">Class 
                <input class="input input-in-label" type="text" name="classBlock" placeholder="Enter class of block">
            </label>
            <label class="desk">New styles
                <input class="input input-in-label" type="text" name="updateBlock" placeholder="Enter styles through ;">
            </label>
            <button class="btn update" type="submit">Update</button>
        </form>
        `)

        this.$element.insertAdjacentHTML('beforeend',
        `
        <form class="formStyle form-delete additional-form" data-name="updateBlock-form"  action="#">
            <label class="desk">Class 
                <input class="input input-in-label" type="text" name="classBlockDelete" placeholder="Enter class of block">
            </label>
            <button class="btn delete" type="submit">Delete</button>
        </form>
        `)
        this.$element.insertAdjacentHTML('beforeend',`<button class='download' >Download</button>`)
        
    }
}