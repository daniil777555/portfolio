<template>
    <li>
        <span :class="{done: todo.completed}">
            <input v-on:click="change(todo)" :checked="check" type="checkbox">
            <strong>{{index + 1}}</strong>
            {{todo.text}}
            
        </span>
        <button v-on:click="remove(todo)">&times;</button>
    </li>
</template>

<style scoped>
    li{
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        list-style-type: none;
        margin: 20px 0;
        border:1px solid rgb(226, 226, 226);
        padding:10px;
    }
    
    span{
        margin-right: 55px;
    }

    input{
        cursor: pointer;
        margin-right: 35px;
    }

    button{
        cursor:pointer;
        border:1px solid rgb(70, 79, 119);
        border-radius: 50%;
        background-color: red;
        color: white;
        transition: all 0.5s;
    }
    button:hover{
        border: 1px solid red;
        background-color: #fff;
        color:rgb(70, 79, 119);
    }

    .done{
        text-decoration: line-through ;
    }
</style>

<script>
    export default{
        
        props:{
            todo: {
                type:Object,
                required:true
            },
            index:Number,
            todos:Array,
            checked:Boolean
        },

        data(){
            return{
                check: this.checked,
            }
        },


        methods:{
            remove(todo){
                this.$emit('remove', todo);
            },

            change(todo){
                this.check = !this.check;
                todo.checked = this.check;
                todo.completed = !todo.completed;
                this.$parent.$parent.postJson(this.todos)
                    .then(()=>{
                    console.log(this.todos)
                    })
            }
        }
    }
</script>

