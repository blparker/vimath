import { beforeEach, expect, test } from 'vitest';
import { PointShape } from '../../../src/shapes/primitives/point_shape';
import { Point } from '../../../src/base';
import { expectArraysToBeClose } from '../../test_utils';


test('should convert points to bezier segments', () => {
    const points = [[1, 1], [1, -1], [-1, -1], [-1, 1], [1, 1]] as Point[];
    const shape = new PointShape({ points });

    expect(shape.points()).toMatchObject([
        [[1, 1], [1, 1], [1, -1], [1, -1]],
        [null, [1, -1], [-1, -1], [-1, -1]],
        [null, [-1, -1], [-1, 1], [-1, 1]],
        [null, [-1, 1], [1, 1], [1, 1]]
    ]);
});


test('should just return bezier segments if all points are bezier segments', () => {
    const points = [[[1, 1], [1, 1], [1, -1], [1, -1]], [null, [1, -1], [-1, -1], [-1, -1]], [null, [-1, -1], [-1, 1], [-1, 1]], [null, [-1, 1], [1, 1], [1, 1]]];
    const shape = new PointShape({ points });

    expect(shape.points()).toMatchObject(points);
});


test('should convert a mixture of points and bezier segments to bezier segments', () => {
    const points = [[1, 1], [null, [1, -1], [1, -1], [1, -1]], [-1, -1], [null, [-1, 1], [-1, 1], [-1, 1]]];
    const shape = new PointShape({ points });

    expect(shape.points()).toMatchObject([
        [[1, 1], [1, 1], [1, -1], [1, -1]],
        [null, [1, -1], [-1, -1], [-1, -1]],
        [null, [-1, -1], [-1, 1], [-1, 1]],
        [null, [-1, 1], [1, 1], [1, 1]]
    ]);
});


test('should get geometric center of a square', () => {
    const points = [[1, 1], [1, -1], [-1, -1], [-1, 1], [1, 1]] as Point[];
    const shape = new PointShape({ points });

    expect(shape.center()).toMatchObject([0, 0]);
});


test('should get geometric center of a non-regular shape', () => {
    // const points = [[1, 1], [1, -1], [-1, -1], [-1, 1], [1, 1]] as Point[];
    const points = [[1, 1], [1, -1], [-1, -1], [-1, 1], [0, 2], [1, 1]] as Point[];
    const shape = new PointShape({ points });

    expectArraysToBeClose(shape.center(), [0, 0.5]);
});
