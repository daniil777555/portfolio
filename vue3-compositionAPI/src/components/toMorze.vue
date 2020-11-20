<template>
    <div>
        <div class="wrap">
            <label class="input-text" for="input-text">Input text</label>
            <input type="text" v-model="input"  class="input" id="input-text">
        </div>
        <p v-if="err.show" class="error">Error, there is no such symbol: {{err.element}}</p>
        <p class="result">Result: {{result}}</p>
    </div>
</template>

<script>
import {changeInput} from '../composition/changeInput'
import {cipher, deciphering} from "../arraysOfCode&Letters"

export default {
  name: 'toEnglish',

  setup(){

    return{
        ...changeInput(deciphering, cipher, ""), 
    }
  }
}
</script>


<style scoped>

    

</style>