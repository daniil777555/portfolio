import {Site} from './site'
import {SiteBar} from './siteBar'
import {stylesToObj} from '../utilits'

export class App{
  constructor(arrItems){
    this.arrItems = arrItems;
  }

    init() {
      const site = new Site('#site');
    
      site.render(this.arrItems);
  
      const addCallback = newBlock => {
        this.arrItems.push(newBlock);
        site.render(this.arrItems);
      }

      const updateCallBack = (classOfBlock, style) => {
        this.arrItems.filter(el => el.class === classOfBlock).forEach(el => Object.assign(el.style, stylesToObj(style)));
        site.render(this.arrItems);
      }

      const deleteCallBack = (classOfBlock) => {
        let arr = this.arrItems.filter(el => el.class !== classOfBlock);
        site.render(arr);
      }
  
      new SiteBar('#panel', addCallback, updateCallBack, deleteCallBack);
      document.querySelector(".download").addEventListener("click", this.download);
    }

    download(){
      let content = document.querySelector(".content").outerHTML
       let fetchStr =  fetch(`server.php`, {
        method: "POST",
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({str: content})
      })

      fetchStr.then(() => {window.location.href = '/download.php'});
    }
}