<template>
    <div class="table">
        <header class="table-header">
            <p class="header-num-quantity">{{ quantityPeople }} people in the list </p>
            <div class="columns">
                <div class="column-name column">Name</div>
                <div class="column-email column">Email</div>
                <div class="column-ptt-quantity column">Potatoes</div>
            </div>
        </header>
        <draggable v-model="peopleArr">
            <transition-group>
                <TableRow v-for="person of peopleArr" :key="person.id" :person="person"/>
            </transition-group>
        </draggable>    
    </div>
</template>

<script>
import Person from '../utils/Person';
import {getUnicNum, cleanNumArray, setSortedNumArr, getSortedNumArr} from '../utils/InteractionWithNumArray';
import TableRow from './TableRow.vue'
import draggable from 'vuedraggable';

export default {
  	name: 'Table',
    props: {
        quantityPeople: Number,
        successOpen: Boolean
    },
     components: {
		TableRow,
        draggable
	},

    data(){
        return{
            peopleArr: [],
        }
    },

    methods:{
        getQuantityPptArr(){
            return this.peopleArr.map(el => el.potatoQuantity)
        },

        compareRightArrWithCurrent(currentArr, rightArr){
            for(let i = 0; i < this.peopleArr.length; i++){
                if(currentArr[i] !== rightArr[i])  return;
            }

            this.$emit("successOpen", true);
        }
    },
    
    beforeMount(){
        for(let i = 0; i < this.quantityPeople; i++){
            this.peopleArr.push(new Person(i, getUnicNum()));
        }
        setSortedNumArr();
        cleanNumArray();
    },

    watch:{
        peopleArr(value){
            this.compareRightArrWithCurrent(
                this.getQuantityPptArr(), getSortedNumArr()
            )
        }
    }
	
}
</script>

<style scoped>
    .table{
        background: #FFFFFF;
        border: 1px solid #DDDDDD;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.101972);
        border-radius: 5px;
        padding: 25px 0 25px 0;
    }

    .header-num-quantity{
        font-weight: bold;
        font-size: 14px;
        line-height: 16px;
        color: #000000;
        text-align: end;
        border-bottom: 1px solid #DDDDDD;
        padding: 0 30px 30px 0;
    }

    .columns{
        display: flex;
        padding: 0 20px;
    }

    .column{
        font-size: 17px;
        line-height: 48px;
        flex: 1;
        color: #555;
    }

    .column-name{
        border-right: 1px solid #DDDDDD;
    }

    .column-email{
        padding: 0 0 0 30px;
        box-sizing: border-box;
    }

</style>