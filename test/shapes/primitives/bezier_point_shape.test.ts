import { beforeEach, expect, test } from 'vitest';
import { PointShape } from '../../../src/shapes/primitives/bezier_point_shape';
import { Point } from '../../../src/base';


test('should convert points to bezier segments', () => {
    const points = [[1, 1], [1, -1], [-1, -1], [-1, 1]] as Point[];
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
