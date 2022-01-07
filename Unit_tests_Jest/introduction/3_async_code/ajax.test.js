const Ajax = require("./Ajax")
const axios = require("axios")

jest.mock("axios")

describe('Ajax: echo', () => {
    test('should return value', async () => {
        let res = await Ajax.echo("data")
        expect(res).toBe("data");

        // or

        await expect(Ajax.echo("data")).resolves.toBe("data")
    });

    test('should return error', async () => {
        try{
            await Ajax.echo()
        } catch(e){
            expect(e.message).toBe("error");
        }

        // or

        await expect(Ajax.echo()).rejects.toThrow("error")
    });
});

describe('Ajax: get', () => {
    let response = {}
    let todos = []

    beforeEach(() => {
        todos = [
            {id: 1, title: "todo 1"}
        ]
        response = {
            data: {
                todos
            }
        }
    });

    test('should return data json', async () => {
        axios.get.mockReturnValue(response)
        
        let res = await Ajax.get()
        expect(res.todos).toEqual(todos)

    });
});