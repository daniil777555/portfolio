<template>
  <div class="tic-tac-toe">
    <h1>Tic Tac Toe</h1>
    <hr>
    <router-link class="link" to="/">To do list</router-link>
    <hr>
    <field :arr="arrItems" :show="show" @playagain="clearField" :winner="winner" @output="output"></field>
    <hr>
    <p>X {{ pointX }} : {{ pointO }} O</p>
  </div>
</template>

<style scoped>
    .link{
        text-decoration: none;
        color: #fff;


    }
    .tic-tac-toe{
      position: relative;
    }

    .link:hover{
        text-decoration: underline;
    }

    .disabled{
      z-index: 20;
      position: absolute;
      left: 551px;
      top: 137px;
      width: 150px;
      height: 150px;
    }

</style>

<script>
import field from '@/components/gamingfield.vue'

export default {
    data(){
      return{
        arrItems:[
          {
            id:1,
            innerTxt:""
          },
          {
            id:2,
            innerTxt:""
          },
          {
            id:3,
            innerTxt:""
          },
          {
            id:4,
            innerTxt:""
          },
          {
            id:5,
            innerTxt:""
          },
          {
            id:6,
            innerTxt:""
          },
          {
            id:7,
            innerTxt:""
          },
          {
            id:8,
            innerTxt:""
          },
          {
            id:9,
            innerTxt:""
          }
        ],
        counter: 1,
        winner: "",
        show: true,
        pointX: 0,
        pointO: 0,
      }
    },

    components:{
            field
        },

    methods:{
      output(item){
        if(item.innerTxt == ""){
          if(this.counter % 2 == 0){
            this.counter++
            item.innerTxt = "O"
          } else if (this.counter % 2 != 0){
              this.counter++
              item.innerTxt = "X"
          }
        } else{
            return
        }
        console.log(this.filtered().arrX)
        this.checkWin(this.filtered().arrX, "X");
        this.checkWin(this.filtered().arrO, "O");
        return
        
      },

      filtered(){
        let arrX = [];
        let arrO = [];
        this.arrItems.forEach((el) => {
          if(el.innerTxt == "X"){
            arrX.push(el.id)
          }
        }); 
        this.arrItems.forEach((el) => {
          if(el.innerTxt == "O"){
            arrO.push(el.id)
          }
        });
        return {arrX, arrO}
      },

      clearField(){
        this.arrItems.forEach(el => {
          el.innerTxt = ""
        });
        this.changeShow()
        this.winner = '';
      },

      changeShow(){
        this.show = !this.show
      },

      checkWin(arr, player){
        if(
            arr.includes(1)
         && arr.includes(2) 
         && arr.includes(3) 
         ||
            arr.includes(4)
         && arr.includes(5) 
         && arr.includes(6) 
         ||
            arr.includes(7)
         && arr.includes(8) 
         && arr.includes(9) 
         ||
            arr.includes(1)
         && arr.includes(4) 
         && arr.includes(7) 
         ||
            arr.includes(2)
         && arr.includes(5) 
         && arr.includes(8) 
         ||
            arr.includes(3)
         && arr.includes(6) 
         && arr.includes(9) 
         ||
            arr.includes(1)
         && arr.includes(5) 
         && arr.includes(9) 
         ||
            arr.includes(3)
         && arr.includes(5) 
         && arr.includes(7)
         ){
            this.winner = `${player} wins`;
            this.changeShow();
            this.counter = 1;
            this.score(player)
        }
      },

      score(player){
        if(player == "X"){
          this.pointX++
        }else if(player == "O"){
          this.pointO++
        }
      }
    }
}

</script>
