// import {describe, expect, test} from '@jest/globals';
// import { describe, expect, test } from '../node_modules/@jest/globals/build/index';
import * as math from '../src/math';


describe('math module', () => {

    test('should subtract arrays', () => {
        expect(math.subtract([0, 0], [1, 1])).toEqual([-1, -1]);
    });

    test('should throw error if subtracting arrays that are not the same length', () => {
        expect(() => math.subtract([0], [1, 1])).toThrowError();
    });

    test('should subtract if param is scalar', () => {
        // expect(math.subtract(0, [1])).toEqual([-1]);
        // expect(math.subtract([0], 1)).toEqual([-1]);
        expect(math.subtract(0, 1)).toEqual(-1);
    });

    test('should add arrays', () => {
        expect(math.add([1, 0], [1, 1])).toEqual([2, 1]);
    });

    test('should throw error if adding arrays that are not the same length', () => {
        expect(() => math.add([0], [1, 1])).toThrowError();
    });

    test('should multiply an array by a scalar', () => {
        expect(math.scalarMultiply([1, 2, 3], 2)).toEqual([2, 4, 6]);
        expect(math.scalarMultiply([-0.5, 0.5], 2)).toEqual([-1, 1]);
    });

    test('should lerp', () => {
        expect(math.lerp(0, 1, 0.5)).toEqual(0.5);
        expect(math.lerp(0, 1, 0)).toEqual(0);
        expect(math.lerp(0, 2, 0.25)).toEqual(0.5);
    });

    test('should invlerp', () => {
        expect(math.invlerp(0, 2, 0.5)).toEqual(0.25);
        expect(math.invlerp(0, 10, 5)).toEqual(0.5);
    });

    test('should lerp an array', () => {
        expect(math.arrLerp([0, 0], [5, 10], 0.5)).toEqual([2.5, 5]);
    });

    test('should calculate distance', () => {
        expect(math.distance(0, 2)).toEqual(2);
        expect(math.distance(2, 0)).toEqual(2);
        expect(math.distance([0, 0], [0, 2])).toEqual(2);
        expect(math.distance([2, 0], [0, 0])).toEqual(2);
        expect(math.distance([1, 0], [3, 0])).toEqual(2);
        expect(math.distance([0, 0], [2, 2])).toBeCloseTo(Math.sqrt(8));
    });

    test('should get mode of array', () => {
        expect(math.mode([1, 1, 1, 2, 3])).toEqual(1);
        expect(math.mode([1, 2, 2, 3])).toEqual(2);
        expect(math.mode([1, 2, 3])).toEqual(1);
    });

    test('should return num of decimals', () => {
        expect(math.numDecimals(1.2345)).toEqual(4);
        expect(math.numDecimals(1.23)).toEqual(2);
        expect(math.numDecimals(123)).toEqual(0);
    });

    // test('should add if param is scalar', () => {
    //     expect(math.add(0, [1])).toEqual([1]);
    //     expect(math.add([0], 1)).toEqual([1]);
    //     expect(math.add(0, 1)).toEqual([1]);
    // });

    test('should sum arrays', () => {
        const sum = math.sum([[1, 1], [2, 2], [3, 3]]);
        expect(sum).toEqual([6, 6]);
    });

    test('should sum array index', () => {
        const sum = math.sum([[0, 1], [0, 2], [0, 3]], 1);
        expect(sum).toEqual(6);
    });

    test('should take max of array', () => {
        expect(math.max([0, 5, 1, 2])).toEqual(5);
    });

    test('should take max of arrays with index', () => {
        expect(math.max([[0, 1], [3, 2], [2, 5]], 0)).toEqual(3);
        expect(math.max([[0, 1], [3, 2], [2, 5]], 1)).toEqual(5);
    });

    test('should take min of array', () => {
        expect(math.min([0, 5, -1, 2])).toEqual(-1);
    });

    test('should take min of arrays with index', () => {
        expect(math.min([[0, 1], [3, 2], [-2, 5]], 0)).toEqual(-2);
        expect(math.min([[0, 1], [3, 2], [2, 5]], 1)).toEqual(1);
    });
});
