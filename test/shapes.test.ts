// import { describe, expect, test } from '@jest/globals';
// import { describe, expect, test } from '../node_modules/@jest/globals/build/index';
import { PointShape, Line, Triangle, Square, Circle, } from '../src/shapes/base_shapes';
import { Point } from '../src/base';
import { zip } from '../src/math';
import structuredClone from '@ungap/structured-clone'
import { Colors } from '../src/colors';


describe('shape module', function() {
    const square: Point[] = [[-1, 1], [1, 1], [1, -1], [-1, -1]];
    const diamond: Point[] = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    test('should do basic shift', () => {
        // Shift to the left
        const shape = new PointShape({ points: [[0, 0]] }).shift([-1, 0]) as PointShape;
        expect(shape.points()).toEqual([[ -1, 0 ]]);
    });

    test('should handle multiple shifts', () => {
        // Shift to the left
        const shape = new PointShape({ points: [[0, 0]] }).shift([-1, 1], [0, 1]) as PointShape;
        expect(shape.points()).toEqual([[ -1, 2 ]]);
    });

    test('should move to a point', () => {
        const shape = new PointShape({ points: [[0, 0]] }).moveTo([2, 1]) as PointShape;
        expect(shape.points()).toEqual([[ 2, 1 ]]);
    });

    test('should get center point', () => {
        const shape = new PointShape({ points: structuredClone(diamond) });
        expect(shape.center()).toEqual([0, 0]);
    });

    test('should get sides of point shape', () => {
        const shape = new PointShape({ points: structuredClone(diamond) });
        expect(shape.top()).toEqual([0, 1]);
        expect(shape.bottom()).toEqual([0, -1]);
        expect(shape.left()).toEqual([-1, 0]);
        expect(shape.right()).toEqual([1, 0]);
    });

    test('should get dimensions of shape', () => {
        const shape = new PointShape({ points: structuredClone(diamond) });
        expect(shape.width()).toEqual(2);
        expect(shape.height()).toEqual(2);
    });

    test('should scale shape', () => {
        // Square centered at [0, 0]
        const shape = new PointShape({ points: structuredClone(square) });
        expect(shape.scale(2).computedPoints()).toEqual([[-2, 2], [2, 2], [2, -2], [-2, -2]]);
    });

    test('should rotate shape', () => {
        // Square centered at [0, 0] should rotate 45deg to diamond
        const shape = new PointShape({ points: structuredClone(square) });
        const s2 = Math.sqrt(2);

        const actual = shape.rotate(Math.PI / 4).computedPoints();
        const expected = [[-s2, 0], [0, s2], [s2, 0], [0, -s2]] as Point[];

        for (const [p1, p2] of zip(actual, expected)) {
            expect(p1[0]).toBeCloseTo(p2[0]);
            expect(p1[1]).toBeCloseTo(p2[1]);
        }
    });

    test('should scale and rotate', () => {
        // Square centered at [0, 0] should rotate 45deg to diamond
        const shape = new PointShape({ points: structuredClone(square) });
        const scaleFactor = 2;

        // Same as rotate test above, but s
        const s2 = Math.sqrt(2) * scaleFactor;

        // Scale and rotate
        const actual = shape.scale(scaleFactor).rotate(Math.PI / 4).computedPoints();
        const expected = [[-s2, 0], [0, s2], [s2, 0], [0, -s2]] as Point[];

        for (const [p1, p2] of zip(actual, expected)) {
            expect(p1[0]).toBeCloseTo(p2[0]);
            expect(p1[1]).toBeCloseTo(p2[1]);
        }
    });

    test('should put a shape next to another shape without specifying direction', () => {
        const square1 = new PointShape({ points: structuredClone(square) });
        const square2 = new PointShape({ points: structuredClone(square) }).nextTo(square1);

        // Account for the 0.2 offset
        const expectedPoints = [[1.2, 1], [3.2, 1], [3.2, -1], [1.2, -1]];

        expect(square2.points()).toEqual(expectedPoints);
    });

    test('should create a line', () => {
        const l = new Line({ from: [0, 0], to: [2, 2] });
        expect(l.points()).toEqual([[0, 0], [2, 2]]);
    });

    test('should create a triangle', () => {
        const t = new Triangle({ x: 0, y: 0, height: 2 });
        expect(t.points()).toEqual([[0, 1], [1, -1], [-1, -1]]);
    });

    test('should create a square', () => {
        const s = new Square({ x: 0, y: 0, size: 2 });
        expect(s.points()).toEqual([[-1, 1], [1, 1], [1, -1], [-1, -1]]);
    });

    test('should move the center', () => {
        const s = new Square({ x: 0, y: 0, size: 2 });
        expect(s.moveCenter([2, 2]).center()).toEqual([2, 2]);
        expect(s.moveCenter([0, 0]).center()).toEqual([0, 0]);
        expect(s.moveCenter([-2, -2]).center()).toEqual([-2, -2]);
    });

    test('should set the line and fill colors of a shape', () => {
        const s = new Square({ lineColor: Colors.blue(), color: Colors.red() });
        expect(s.lineColor()).toEqual(Colors.blue());
        expect(s.color()).toEqual(Colors.red());
    });

    test('shapes can be constructed with default args', () => {
        const circle = new Circle();
        expect(circle.center()).toEqual([0, 0]);
        expect(circle.right()).toEqual([1, 0]);

        const triangle = new Triangle();
        const square = new Square();
    });

    test('should set line color to color when color is specified but not line color', () => {
        const s = new PointShape({ points: [], color: Colors.red() });

        expect(s.color()).toEqual(Colors.red());
        expect(s.lineColor()).toEqual(Colors.red());
    });
});
