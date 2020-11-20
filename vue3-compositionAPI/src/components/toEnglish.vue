<template>
    <div>
        <div class="wrap">
            <label class="input-text" for="input-code">Input code <span class="info" 
            title="1 space between letter designations 2 spaces between words">!</span></label>
            <input type="text" v-model="input"  class="input" id="input-code">
        </div>
        <p v-if="err.show" class="error">Error, there is no such symbol: {{err.element}}</p>
        <p class="result">Result: {{ result }}</p>
    </div>
</template>

<script>
import {changeInput} from '../composition/changeInput'
import {cipher, deciphering} from "../arraysOfCode&Letters"

export default {
    name: 'toMorze',

    setup(){

        return {
            ...changeInput(cipher, deciphering, " ")
        }
    }
}

</script>


<style scoped>

    .info{
        font-size: 18px;
        color: rgb(141, 141, 141);
        border: 1px solid rgb(141, 141, 141);
        border-radius: 50%;
        padding: 2px 9px;
        box-sizing: border-box;
    }

</style>