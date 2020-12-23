<template>
  <div>
    <h1 class="app-h1">To do list</h1>
    <hr>
    <router-link class="link" to="/tictactoe">TicTacToe</router-link>
    <hr>
    <select v-model="filter">
      <option value="all">All</option>
      <option value="completed">Completed</option>
      <option value="not-completed">Not Completed</option>
    </select>
    <hr>
    <addTodo 
      @add-todo="addTodo"
    />
    <hr>
    <TodoList @remove="remove" v-if="filteredTodos.length" v-bind:todos="filteredTodos"></TodoList>
    <p v-else>No todos!</p>
  </div>
</template>

<style scoped>
    select{
        cursor: pointer;
    }

    .link{
        color: #fff;
        text-decoration: none;

    }

    .link:hover{
        text-decoration: underline;
    }

    
</style>

<script>
  import TodoList from '@/components/ToDoList' 
  import addTodo from '@/components/addTodo' 

  export default {
    data(){
      return{
        todos:[],
        filter: "all"
      }
    },
    name: 'app',
      methods:{

        postJson(data){
            return fetch("todo.json", {
                method: 'POST',
                body: JSON.stringify(data, null, "\t"),
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin" : "*", 
                    "Access-Control-Allow-Credentials" : true 
                }
            })
                
        },

        addTodo(todo){
          this.todos.push(todo);
          
          this.postJson(this.todos)
            .then(()=>{
              console.log(this.todos)
            })
            .catch(err => {console.log(err)})
        },
      
        remove(todo){
          let checkpoint = null;
          this.todos.forEach((el, i)=>{
                if(el.id == todo.id){
                    checkpoint = todo.id;
                    this.todos.splice(i, 1)
                }
                 
            });
            let newArr = this.todos.filter((item) => {
               if(item.id >= checkpoint){
                   return item.id
               }
                  
            })
            newArr.forEach((el)=>{
              el.id = el.id - 1;
            })
            this.todos.splice(checkpoint, this.todos.length, ...newArr)
            console.log(this.todos);

            this.postJson(this.todos)
            .then(()=>{
              console.log(this.todos)
            })

        }

      },

    computed: {
      filteredTodos() {
        if (this.filter === 'all') {
          return this.todos
        }

        if (this.filter === 'completed') {
          return this.todos.filter(t => t.completed)
        }

        if (this.filter === 'not-completed') {
          return this.todos.filter(t => !t.completed)
        }
      }
    },
      
      mounted(){
        fetch('todo.json')
            .then(result => result.json())
            .then(data => {
                  this.todos = data;
            })
      },
    components: {
      TodoList,
      addTodo
    }
  }  
</script>