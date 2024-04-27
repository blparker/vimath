import { beforeEach, expect, test } from 'vitest';
import { Axes } from '../../../src/shapes/composed/axes';
import { before } from 'node:test';
import { getTestCanvas } from '../../test_utils';
import { config } from '../../../src/config';
import { NumberLine } from '../../../src/shapes';


beforeEach(() => {
    config.canvasInstance = getTestCanvas();
});


test('should create axes with balanced ranges and default length at (0, 0)', () => {
    const a = new Axes({
        xRang: [-4, 4],
        yRange: [-4, 4],
        showXTicks: false,
        showYTicks: false,
    });

    const shapes = a.compose().composedShapes();
    expect(shapes.length).toBe(2);
    expect(shapes[0]).instanceOf(NumberLine);
    expect(shapes[1]).instanceOf(NumberLine);

    expect(shapes[0].from()).toEqual([-7, 0]);
    expect(shapes[0].to()).toEqual([7, 0]);
    // They start off unrotated
    expect(shapes[1].from()).toEqual([-4, 0]);
    expect(shapes[1].to()).toEqual([4, 0]);
});
