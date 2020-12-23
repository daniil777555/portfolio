<template>
    <form @submit.prevent="onSubmit">
        <input name="inputText" type="text" v-model="inputTxt">
        <button type="submit">Added</button>
    </form>
</template>

<style scoped>
    form{
        margin: 20px 0;
    }

    input{
        border:none;
        height: 33px;
        font-size: 20px;
        color: #fff;
        background: inherit;
        border-bottom: 1px solid rgb(247, 247, 247);
        width: 350px; 
        outline: none;
        margin-right: 15px;
    }
    button{
        box-sizing: border-box;
        padding: 10px;
        border-radius: 5px;
        border: 2px solid rgb(70, 79, 119);
        outline:none;
        cursor: pointer;
        color: rgb(70, 79, 119);
        background:white;
        transition: all 0.5s;
    }
    button:hover{
        background: rgb(130, 74, 161);
        color: #fff;
        border: 2px solid rgb(255, 255, 255);
    }
</style>

<script>
    export default{
        data(){
            return{
                inputTxt:""
            }
        },
        methods:{
            getId(){
                let maxId = 0;
                if(this.$parent.todos.length == 0){
                    maxId = 0;
                }
                if(this.$parent.todos.length == 1){
                    maxId = 1;
                }
                this.$parent.todos.forEach((el)=>{
                    if(maxId <= el.id){
                        maxId = el.id + 1;
                    }    
                });
                return maxId
                
            },
            onSubmit(){
                if(this.inputTxt.trim()){
                    const newTodo = {
                        id: this.getId(),
                        text: this.inputTxt,
                        completed: false
                    }
                    this.inputTxt ="";
                    this.$emit('add-todo',newTodo);
                }
            }
        }
    }
       
</script>
