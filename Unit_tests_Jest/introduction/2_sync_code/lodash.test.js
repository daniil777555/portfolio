const Lodash = require("./Lodash")
const _ = new Lodash();

describe('Lodash: compact', () => {
    let arr = []
    beforeEach(() => {
        arr = [1, '', 0, 'dd', false, undefined, null,]
    });

    test('should be defined', () => {
        expect(_.compact).toBeDefined();
    });

    test('should be called', () => {
        const compact = jest.fn(arr => _.compact(arr));
        compact(arr)
        expect(compact).toHaveBeenCalled();
    });

    test('should retur truthe values', () => {
        expect(_.compact(arr)).toEqual([1, 'dd']);

        const compact = jest.fn(arr => _.compact(arr));
        compact(arr)
        expect(compact).toHaveReturnedWith([1, 'dd']);
    });

    test("shouldn't have falsy values", () => {
        expect(_.compact(arr)).not.toContain(false);
        expect(_.compact(arr)).not.toContain(undefined);
        expect(_.compact(arr)).not.toContain(null);
        expect(_.compact(arr)).not.toContain('');
        expect(_.compact(arr)).not.toContain(0);
    });
});

describe('Lodash: groupBy', () => {
    test('should be defined', () => {
        expect(_.groupBy).toBeDefined();
    });

    test('should be called', () => {
        const groupBy = jest.fn(() => _.groupBy([], "length"));
        groupBy()
        expect(groupBy).toHaveBeenCalled();
    });

    test('should group values by Math.floor', () => {
        let arr = [2.3, 2.5, 4, 5.3, 4.1, 3.6]
        let result = {
            2: [2.3, 2.5],
            3: [3.6],
            4: [4, 4.1],
            5: [5.3]
        }
        expect(_.groupBy(arr, Math.floor)).toEqual(result);
        expect(_.groupBy(arr, Math.floor)).not.toBeInstanceOf(Array);
    });

    test('should group values by length', () => {
        let arr = ["one", "two", "math", "hello"]
        let result = {
            3: ["one", "two"],
            4: ["math"],
            5: ["hello"]
        }
        expect(_.groupBy(arr, "length")).toEqual(result);
        expect(_.groupBy(arr, "length")).not.toBeInstanceOf(Array);
    });
});