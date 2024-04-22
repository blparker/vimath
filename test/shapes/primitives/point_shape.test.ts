import { beforeEach, expect, test } from 'vitest';
import { PointShape } from '../../../src/shapes/primitives/point_shape';
import { Point } from '../../../src/base';

// const triangle = new PointShape({ points: [[0, 0], [1, 0], [0, 1]] as Point[] });
// const square = new PointShape({ points: [[0, 0], [0, 2], [2, 2], [2, 0]] as Point[] });
let triangle: PointShape;
let square: PointShape;


function expectArraysToBeClose(arr1: number[] | number[][], arr2: number[] | number[][], precision = 2) {
    expect(arr1.length).toEqual(arr2.length);

    arr1.forEach((value: number | number[], index: number) => {
        if (Array.isArray(value) && Array.isArray(arr2[index])) {
            expectArraysToBeClose(value, arr2[index] as number[], precision);
        } else {
            expect(value).toBeCloseTo(arr2[index] as number, precision);
        }
    });
}


beforeEach(() => {
    triangle = new PointShape({ points: [[0, 0], [1, 0], [0, 1]] as Point[] });
    square = new PointShape({ points: [[0, 0], [0, 2], [2, 2], [2, 0]] as Point[] });
});


test('should create point shape with points', () => {
    const ps = [[0, 0], [1, 1], [2, 2]] as Point[];
    const s = new PointShape({ points: ps });
    const points = s.points();

    expect(ps.length).toEqual(points.length);

    for (let i = 0; i < ps.length; i++) {
        expect(points[i]).toMatchObject(ps[i]);
    }
});


test('should shift point shape', () => {
    const ps = [[-1, 0], [1, 0], [0, 1]] as Point[];
    const s = new PointShape({ points: ps });

    const shifted = s.shift([1, 1]);
    const points = shifted.points();

    expect(points).toMatchObject([[0, 1], [2, 1], [1, 2]]);
});


test('should not mutate input points', () => {
    const pts = [[-1, 0], [1, 0], [0, 1]] as Point[];
    const ptsCopy = structuredClone(pts);

    new PointShape({ points: pts }).shift([1, 1]);

    expect(pts).toMatchObject(ptsCopy);
});


test('should get center of point shape', () => {
    const s = new PointShape({ points: [[-1, 0], [1, 0], [0, 3]] });

    expect(s.center()).toMatchObject([0, 1]);
});


test('should get top of shape', () => {
    expect(square.top()).toMatchObject([1, 2]);
    expect(triangle.top()).toMatchObject([0.5, 1]);
});


test('should get right of point shape', () => {
    expect(square.right()).toMatchObject([2, 1]);
    expect(triangle.right()).toMatchObject([1, 0.5]);
});


test('should get bottom of shape', () => {
    expect(square.bottom()).toMatchObject([1, 0]);
    expect(triangle.bottom()).toMatchObject([0.5, 0]);
});


test('should get left of point shape', () => {
    expect(square.left()).toMatchObject([0, 1]);
    expect(triangle.left()).toMatchObject([0, 0.5]);
});


test('should get width of point shape', () => {
    expect(square.width()).toEqual(2);
    expect(triangle.width()).toEqual(1);
});


test('should get height of point shape', () => {
    expect(square.height()).toEqual(2);
    expect(triangle.height()).toEqual(1);
});


test('should move the center of the point shape', () => {
    expect(square.moveTo([2, 2]).center()).toMatchObject([2, 2]);
    expect(square.left()).toMatchObject([1, 2]);
});


test('should shift the center of the point shape', () => {
    expect(square.shift([2, 2]).center()).toMatchObject([3, 3]);
    expect(square.left()).toMatchObject([2, 3]);
});


test('should scale point shape', () => {
    const s = new PointShape({ points: [[-1, 0], [1, 0], [0, 3]] });
    const scaled = s.scale(2);

    expect(s.points()).toMatchObject([
        [-2, 0], [2, 0], [0, 6]
    ]);
});


test('should rotate point shape', () => {
    // Square with width = 2 and centered a origin
    const square = new PointShape({ points: [[-1, -1], [1, -1], [1, 1], [-1, 1]] });
    expectArraysToBeClose(square.rotate(Math.PI / 2).points(), [[1, -1], [1, 1], [-1, 1], [-1, -1]]);
});


test('should determine if point is on edge', () => {
    const square = new PointShape({ points: [[-1, -1], [1, -1], [1, 1], [-1, 1]] });
    expect(square.isPointOnEdge([0, 1])).toBe(true);
    expect(square.isPointOnEdge([0, 5])).toBe(false);

    // Check that if the point is close to the edge, it is considered on the edge
    expect(square.isPointOnEdge([0, 0.95])).toBe(true);
});
