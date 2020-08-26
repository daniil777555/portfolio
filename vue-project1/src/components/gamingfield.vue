<template>
    <div class="gaming-fild">
        <div class="item" disabled   v-for="item of arr" :key="item.id" v-on:click="$emit('output', item)">{{ item.innerTxt }}</div>
        <div class="disabled" v-show="!show"></div>
        <p>{{ winner }}</p>
        <button v-on:click="$emit('playagain')">Play again</button>
    </div>
</template>

<script>

export default {
    props:{
        arr: Array,
        winner: String,
        show: Boolean
    },
    data(){
      return{
      }
    },
    methods:{

    }

}

</script>

<style scoped>

    button{
        position: absolute;
        top: 180px;
        left: 150px;
        box-sizing: border-box;
        padding: 10px;
        border-radius: 5px;
        border: 2px solid rgb(70, 79, 119);
        outline:none;
        cursor: pointer;
        background:white;
        color: rgb(70, 79, 119);
        transition: all 0.5s;

    }

    button:hover{
        background: rgb(130, 74, 161);
        color: #fff;
        border: 2px solid rgb(255, 255, 255);
    }

    p{
        color: red;
        font-size: 28px;
        font-weight: 800;
    }
    .gaming-fild{
        position: relative;
        margin: 40px auto 80px auto;
        width: 150px;
        height: 150px;
        display: flex;
        flex-wrap: wrap;
    }

    .item{
        text-align: center;
        padding: 10px;
        font-size: 25px;
        cursor: pointer;
        overflow: hidden;
        width: 50px;
        height: 50px;
        box-sizing: border-box;
        color: #fff;
        border: 1px solid #fff;
    }

    .disabled{
      z-index: 20;
      position: absolute;
      left: 0;
      top: 0;
      width: 150px;
      height: 150px;
    }
</style>