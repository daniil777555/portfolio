const {map} = require("./mock")

describe('Map', () => {
    let arr = []
    let func = new Function()

    beforeEach(() => {
        arr = [1, 2, 3, 5, 8]
        func = jest.fn(x => x ** 2) 
        map(arr, func)
    });
    test("should do callback", () => {
        expect(func).toHaveBeenCalled()

        expect(func).toHaveBeenCalledTimes(5)

        // or

        expect(func.mock.calls.length).toBe(5)
    });

    test('should rise a number to the 2 power', () => {
        for(let i = 0; i < arr.length; i++){
            expect(func.mock.results[i].value).toEqual(arr[i] ** 2);
        }
    });
});