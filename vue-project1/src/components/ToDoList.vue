<template>
    <div>
        <ul>
            <todoitem v-for='(todo, i) of todos'
              :key="todo.id"
             :todo='todo'
             :todos='todos'
             :index="i"
             :checked="todo.checked"
             v-on:remove="remove"
             ></todoitem>    
        </ul>
    </div> 
</template>

<style scoped>
    div{
        display: flex;
    }
   ul{
       text-align:center;
       padding:0;
       margin:0 auto;
   }
</style>

<script>
    import todoitem from '@/components/TodoItem'
    export default{
        props:['todos'],
        components:{
            todoitem
        },
        methods:{
            remove(todo){
                this.$emit('remove', todo)
            }
            
        }
    }
</script>