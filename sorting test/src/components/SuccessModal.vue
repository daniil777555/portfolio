<template>
    <div class="success">
        <span class="success-close" v-on:click="$emit('successOpen', false)">&#215;</span>
        <p class="success-text">Success!!!!</p>
        <p class="success-time">{{ time }} min</p>
    </div>
</template>

<script>

export default {
  	name: 'SuccessModal',
    props:["startTime"],

    computed:{
        time(){
            let curTime = new Date().getTime();
            let min = Math.floor((curTime - this.startTime) / 1000 / 60);
            let sec = Math.floor((curTime - this.startTime) / 1000 % 60);
            return `${min}:${sec}`
        }
    }
}
</script>

<style scoped>
    .success{
        position: absolute;
        border: 3px solid rgb(15, 146, 3);
        border-radius: 5px;
        background: rgb(22, 228, 4);
        padding: 45px 15px;
        min-width: 200px;
        text-align: center;
        top: 150px;
        left: 440px;
        z-index: 3;
    }

    .success-close{
        cursor: pointer;
        position: absolute;
        color: #fff;
        font-size: 32px;
        top: -5px;
        left: 205px;
    }

    .success-text{
        font-size: 25px;
        font-weight: bold;
        color: #fff;
    }

    .success-time{
        font-size: 20px;
        font-weight: bold;
        color: #fff;
    }
</style>