export function toCSS(style = {}){
    let toString = key => `${key}:${style[key]}`
    return Object.keys(style).map(toString).join(";")
}

export function toCSSotherStyle(str, style){
    let arrFromStr = str.split(";").map(el => el.trim().split(":"));
    arrFromStr.splice(arrFromStr.length - 1, 1);
    for(let el of arrFromStr){
        style[el[0]] = el[1];
    }
    return style
    
}