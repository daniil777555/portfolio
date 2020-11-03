import img from "./assets/img.png"

export let itemsArr = [
    {
        tag: "div",
        intoBlock:"#site",
        class:"block",
        value:"",
        style:{
            display:"block",
            float:"",
            "text-align": "center",
            width:"auto",
            height:"auto",
            padding:"30px",
            margin:"0px",
            background:"linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)"
        },
        exeFunc:"innerBlock"
    },
    {
        tag: "h1",
        intoBlock:".block",
        class:"text",
        value:"Site Constructor",
        style:{
            float:"",
            "text-align": "center",
            width:"auto",
            height:"auto",
            padding:"0px",
            margin:"0px",
            "font-size": "36px",
            "font-weight": "800",
            "line-height":"1",
            "letter-spacing":"0.2px",
            background:"inherit",
            color:"#fff"
        },
        exeFunc:"innerBlock"
    },
    
    {
        tag: "div",
        intoBlock:"#site",
        class:"block4",
        value:"",
        style:{
            display:"block",
            float:"",
            "text-align": "center",
            width:"auto",
            height:"auto",
            padding:"30px",
            margin:"0px",
            background:"rgb(230, 230, 230)"
        },
        exeFunc:"innerBlock"
    },

    {
        tag: "img",
        intoBlock:".block4",
        class:"",
        src: img,
        alt:"IMG",
        style:{
            display:"block",
            float:"",
            "text-align": "center",
            width:"1080px",
            height:"",
            padding:"0px",
            margin:"0 auto",
            background:"",
        },
        exeFunc:"innerImg"
    }

]

