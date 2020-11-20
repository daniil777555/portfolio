<template>
<div class="container">
  <toMorze />
  <toEnglish />
</div>

</template>

<script>

import toMorze from "./components/toMorze"
import toEnglish from "./components/toEnglish"


export default {
  name: 'App',
  components: {
    toMorze,
    toEnglish
  },


  setup(){


  }
}
</script>

<style>
  *{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-weight: 500;
  }
  .container{
    width: 650px;
    margin: 0 auto;
    text-align: center;
    outline: 2px solid rgb(194, 193, 193);
    padding: 20px 30px;
    box-sizing: border-box;
  }

  .wrap{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 20px;
  }
  .input-text{
    font-size: 33px;
    color: rgb(52, 50, 65);
  }

  .input{
    font-size: 26px;
    padding: 5px 7px;
    box-sizing: border-box;
    border: 2px solid rgb(194, 193, 193);
    border-radius: 5px;
    outline: none;
    color: rgb(143, 143, 143);
  }

  .error{
    padding: 20px;
    background: rgb(197, 0, 0);
    color: #fff;
    font-size: 24px;
  }

  .result{
    text-align: start;
    word-wrap: break-word;
    margin-left: 55px;
    font-size: 26px;
  }
</style>
