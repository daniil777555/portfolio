

export class UpdateBlock{
  constructor(styleStr, selector){
    this.styleStr = styleStr;
    this.selector = selector;
  }

  update(){
    let el = null;
    try{
      el = document.querySelectorAll(`.${this.selector}`);
    } catch(err){
      
    }

    
  }

}