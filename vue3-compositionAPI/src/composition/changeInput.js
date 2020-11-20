import {ref, watch} from 'vue'



export function changeInput(decip, cip, separator){
    let input = ref("");
    let array = ref([]);
    let err = ref({show:false, element:""});
    let result = ref("");

    watch(input, () => {
        array = input.value.split(separator);
        func();
        
    })

    const func = () => {
        err.value.show = false
        result.value = "";
        array.forEach((el, i) => {
            el = el.toLowerCase()
            if(separator === " " && el === " " && array[i - 1] === " "){
                result.value += " ";
                return
            }
            if(separator === ""){
                result.value += " ";
                if(el === " "){
                    return
                }
            }
            if(!decip.includes(el) && el !== " " && el !== ""){
                err.value.show = true 
                err.value.element = `" ${el} "`;
                return 
            }

            let letterInd = decip.indexOf(el);
            result.value += cip[letterInd];
        });
    }

    return{
        input,
        err, 
        result
        
    }
}