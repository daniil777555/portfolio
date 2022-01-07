const axios = require("axios")

class Ajax{
    static echo(data){
        return new Promise((res, rej) => {
            setTimeout(() => {
                if(data){
                    res(data)
                } else{
                    rej(new Error("error"))
                }
            }, 100)
        })
    }

    static async get(){
        try{
            const res = await axios.get("https://jsonplaceholder.typicode.com/todos")
            return res.data
        } catch(e){
            throw new Error(e)
        }

    }
}

module.exports = Ajax