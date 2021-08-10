<template>
    <div class="container">
        <header class="header">
            <h1 class="heading">Sorting Training System</h1>
            <button class="btn btn-init" 
            v-on:click="isModalOpen = true; isTableOpen = false">
                Start sorting!
            </button>
        </header>
        <ModalW v-if="isModalOpen" v-model="quantityPeople"
            v-on:startSorting="startSorting" v-on:isModalOpen="isModalOpen = $event"/>

        <Table v-if="isTableOpen" v-on:successOpen="successOpen = $event"
            :quantityPeople="quantityPeople"/>

        <SuccessModal v-if="successOpen" v-on:successOpen="successOpen = $event" :startTime="startTime"/>
    </div>
</template>

<script>
import ModalW from './ModalW.vue';
import Table from './Table.vue'
import SuccessModal from "./SuccessModal.vue"

export default {
    name: 'Main',
    components: {
		ModalW,
        Table,
        SuccessModal
	},

    data(){
        return{
            isModalOpen: false,
            isTableOpen: false,
            successOpen: false,
            startTime: null,
            quantityPeople: 20
        }
    },

    methods:{
        startSorting(){
            this.isModalOpen = false;
            this.isTableOpen = true;
            this.startTime =  new Date().getTime();
        },
    },

    watch:{
        quantityPeople(value){
            if(value > 100) return this.quantityPeople = 100
            else if(value < 20) return this.quantityPeople = 20
            return this.quantityPeople = +value
        }
    }
}
</script>

<style>
    .container{
        position: relative;
        max-width: 1200px;
        margin: 0 auto;
    }

    .header{
        padding: 30px 0 0 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 0 0 36px 0;
    }

    .heading{
        font-weight: bold;
        font-size: 32px;
        line-height: 37px;
    }

    .btn{
        cursor: pointer;
        background: #FF8D00;
        border-radius: 5px;
        color: #fff;
        outline: none;
        border: none;
    }

    .btn:hover{
        background: #fff;
        color: #FF8D00;
    }

    .btn:active{
        background: rgb(241, 241, 241);
        color: #FF8D00;
    }

    .btn-init{
        font-weight: bold;
        font-size: 15px;
        line-height: 20px;
        padding: 15px 35px;
    }
</style>