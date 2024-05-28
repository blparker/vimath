import { beforeEach, expect, test } from 'vitest';
import { Axes } from '../../../src/shapes/composed/axes';
import { before } from 'node:test';
import { expectArraysToBeClose, getTestCanvas } from '../../test_utils';
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


test('should center number line at center if provided', () => {
    const n = new NumberLine({
        showLabels: false,
        center: [1, 2]
    });

    expect(n.center()).toEqual([1, 2]);
});


test('should give from and to correctly for origin centered number line', () => {
    const n = new NumberLine({
        showLabels: false,
        length: 6,
    });

    expect(n.from()).toEqual([-3, 0]);
    expect(n.to()).toEqual([3, 0]);
});


test('should give from and to correctly for non-origin centered number line', () => {
    const n = new NumberLine({
        showLabels: false,
        length: 6,
        center: [1, 2],
    });

    expect(n.from()).toEqual([-2, 2]);
    expect(n.to()).toEqual([4, 2]);
});


test('should give correct point on number line centered at origin', () => {
    const n = new NumberLine({
        showLabels: false,
        length: 6,
        range: [0, 6],
    });

    expect(n.pointOnLine(0)).toEqual([-3, 0]);
    expect(n.pointOnLine(3)).toEqual([0, 0]);
    expect(n.pointOnLine(6)).toEqual([3, 0]);
});


test('should give correct point on number line centered at non-origin', () => {
    const n = new NumberLine({
        showLabels: false,
        length: 6,
        range: [0, 6],
        center: [1, 2],
    });

    expect(n.pointOnLine(0)).toEqual([-2, 2]);
    expect(n.pointOnLine(3)).toEqual([1, 2]);
    expect(n.pointOnLine(6)).toEqual([4, 2]);
});


test('should give correct point on number line rotated 90 degrees', () => {
    const n = new NumberLine({
        showLabels: false,
        length: 6,
        range: [0, 6],
        rotation: Math.PI / 2,
    });

    expectArraysToBeClose(n.pointOnLine(0), [0, -3]);
    expectArraysToBeClose(n.pointOnLine(3), [0, 0]);
    expectArraysToBeClose(n.pointOnLine(6), [0, 3]);
});


test('should give correct "to" and "from" of number line rotated 90 degrees', () => {
    const n = new NumberLine({
        showLabels: false,
        length: 6,
        range: [0, 6],
        rotation: Math.PI / 2,
    });

    expectArraysToBeClose(n.from(), [0, -3]);
    expectArraysToBeClose(n.to(), [0, 3]);
});


test('should add tick points to number line', () => {
    const n = new NumberLine({
        showLabels: false,
        length: 6,
        range: [-5, 5],
    });

    const shapes = n.composedShapes();

    // 11 ticks [0-10] + 1 line
    expect(shapes.length).toBe(12);
});