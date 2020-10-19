'use strict'

let input = document.querySelector(".input");
let result = document.querySelector(".result");

input.addEventListener("keydown", ruactiveEntry);

function ruactiveEntry(){
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(() => calc(input.value))
        }, 0);
      }).then(func => func());
     
}

function calculate(val, act){
    let splitVal = val.map(el =>  Number(el));
    switch(act){
        case "+":
           return result.innerHTML = splitVal[0] + splitVal[1];
        case "-":
            return result.innerHTML = splitVal[0] - splitVal[1];
        case "*":
            return result.innerHTML = splitVal[0] * splitVal[1];
        case "/":
            return result.innerHTML = splitVal[0] / splitVal[1];
        case "^":
            return result.innerHTML = splitVal[0] ** splitVal[1];
        case "S":
            return result.innerHTML = splitVal[0]**(1/splitVal[1]);
    }
}

const calc = new Proxy(calculate, {
    apply(func){
        let actionArr = ["+","-","*","/","^","S"];
        let str = input.value;
        let act = "";
        for(let i = 0; i < str.length; i++){
            for(let j = 0; j < actionArr.length; j++){
                if(str[i] === actionArr[j]){
                    act = actionArr[j];
                };
            }
        }
        let splitVal = str.split(act);
        if(input.value === "") result.innerHTML = 0;
        func(splitVal, act);
    }    
})


