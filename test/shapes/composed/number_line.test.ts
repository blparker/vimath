import { beforeEach, expect, test } from 'vitest';
import { Axes } from '../../../src/shapes/composed/axes';
import { before } from 'node:test';
import { getTestCanvas } from '../../test_utils';
import { config } from '../../../src/config';
import { Line, NumberLine, Shape } from '../../../src/shapes';
import { Text } from '../../../src/shapes';


beforeEach(() => {
    config.canvasInstance = getTestCanvas();
});


test('should add a numberline with default length', () => {
    const n = new NumberLine();

    // The width is somewhere between 8-9 due to the default length being 8 and the width including the width of the labels
    expect(n.width()).toBeGreaterThan(8);
    expect(n.width()).toBeLessThan(9);
});


test('should default add a numberline to the origin', () => {
    const n = new NumberLine({
        showLabels: false,
    });

    expect(n.center()).toEqual([0, 0]);
});
