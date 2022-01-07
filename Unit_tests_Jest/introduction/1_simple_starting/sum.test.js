const {sum} = require('./sum')

describe("Sum", () => {
    test('should return the right value', () => {
        expect(sum(1, 2)).toBe(3);
        expect(sum(4, 5)).toEqual(9);
    });

    test('should be greater or less than given number', () => {
        expect(sum(2, 4)).toBeGreaterThan(3);
        expect(sum(2, 7)).toBeGreaterThanOrEqual(9);
        expect(sum(4, 1)).toBeLessThan(7);
        expect(sum(2, 6)).toBeLessThanOrEqual(8);

        //Smth different

        expect(sum(4, 6)).not.toBeGreaterThan(10);
        expect(sum(0.1, 0.2)).toBeCloseTo(0.3);
    });
})

