import {Site} from './site'
import {SiteBar} from './siteBar'

export class App{
  constructor(arrItems){
    this.arrItems = arrItems;
  }

    init() {
      const site = new Site('#site');
    
      site.render(this.arrItems);
  
      const updateCallback = newBlock => {
        this.arrItems.push(newBlock);
        site.render(this.arrItems);
      }
  
      new SiteBar('#panel', updateCallback);
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