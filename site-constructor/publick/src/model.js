export const model = [
    {
        tag: "block",
        intoBlock:"",
        class:"",
        value:"",
        style:{
            display:"",
            float:"",
            "text-align": "",
            width:"auto",
            height:"auto",
            padding:"0px",
            margin:"0px",
            "font-size": "",
            "font-weight": "",
            "line-height":"1",
            "letter-spacing":"",
            background:"",
            color:""
        },
        exeFunc:"innerBlock"
    },

    {
        tag: "a",
        intoBlock:"",
        class:"",
        href:"",
        value:"",
        style:{
            display:"inline-block",
            float:"",
            "text-align": "",
            width:"auto",
            height:"auto",
            padding:"",
            margin:"0px",
            "font-size": "",
            "font-weight": "",
            "line-height":"1",
            "letter-spacing":"0.2px",
            color:"",
            background:""
        },
        exeFunc:"innerLink"
    },
    
    {
        tag: "img",
        intoBlock:"",
        class:"",
        src:"",
        alt:"",
        style:{
            display:"",
            float:"",
            "text-align": "",
            width:"",
            height:"",
            padding:"",
            margin:"",
            background:""
        },
        exeFunc:"innerImg"
    },
]