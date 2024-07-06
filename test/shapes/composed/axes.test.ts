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


test('should create axes with balanced ranges and default length at (0, 0)', () => {
    const a = new Axes({
        xRange: [-4, 4],
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

    expectArraysToBeClose(shapes[1].from(), [0, -4]);
    expectArraysToBeClose(shapes[1].to(), [0, 4]);
});


test('should create axes with balanced ranges and specified length at (0, 0)', () => {
    const a = new Axes({
        xRange: [-4, 4],
        yRange: [-4, 4],
        xLength: 4,
        yLength: 4,
        showXTicks: false,
        showYTicks: false,
    });

    const shapes = a.compose().composedShapes();

    expect(shapes[0].from()).toEqual([-2, 0]);
    expect(shapes[0].to()).toEqual([2, 0]);

    expectArraysToBeClose(shapes[1].from(), [0, -2]);
    expectArraysToBeClose(shapes[1].to(), [0, 2]);
});


test('should not render ticks or labels if showTicks is false', () => {
    const a = new Axes({
        xRange: [0, 4],
        yRange: [-4, 4],
        showTicks: false,
        showLabels: false,
    });

    const shapes = a.compose().composedShapes();

    expect(shapes[0].composedShapes().length).toBe(1);
    expect(shapes[1].composedShapes().length).toBe(1);

    expect(shapes[0].composedShapes()[0]).toBeInstanceOf(Line);
    expect(shapes[1].composedShapes()[0]).toBeInstanceOf(Line);
});


test('should not render labels if showLabels is false', () => {
    const a = new Axes({
        xRange: [0, 4],
        yRange: [-4, 4],
        showLabels: false,
    });

    const shapes = a.compose().composedShapes();

    expect(shapes[0].composedShapes()[0]).toBeInstanceOf(Line);
    expect(shapes[1].composedShapes()[0]).toBeInstanceOf(Line);

    expect(shapes[0].composedShapes().length).toBeGreaterThan(1);
    expect(shapes[1].composedShapes().length).toBeGreaterThan(1);

    shapes[0].composedShapes().slice(1).forEach((s: Shape) => {
        expect(s).toBeInstanceOf(Line);
    });

    shapes[1].composedShapes().slice(1).forEach((s: Shape) => {
        expect(s).toBeInstanceOf(Line);
    });
});


test('should not render ticks if showLabels is false', () => {
    const a = new Axes({
        xRange: [0, 4],
        yRange: [-4, 4],
        showTicks: false,
    });

    const shapes = a.compose().composedShapes();
    const shapes1 = shapes[0].composedShapes();
    const shapes2 = shapes[1].composedShapes();

    expect(shapes1.length).toBeGreaterThan(1);
    expect(shapes2.length).toBeGreaterThan(1);

    shapes1.slice(0, shapes1.length - 2).forEach((s: Shape) => {
        expect(s).toBeInstanceOf(Text);
    });

    shapes2.slice(0, shapes2.length - 2).forEach((s: Shape) => {
        expect(s).toBeInstanceOf(Text);
    });

    expect(shapes1.at(-1)).toBeInstanceOf(Line);
    expect(shapes2.at(-1)).toBeInstanceOf(Line);
});


test('should create axes with shift origin if x-range is not balanced', () => {
    const a = new Axes({
        xRange: [0, 4],
        yRange: [-4, 4],
        showTicks: false,
        showLabels: false,
    });

    const shapes = a.compose().composedShapes();
    expect(shapes[0].center()).toEqual([0, 0]);
    expect(shapes[1].center()).toEqual([-7, 0]);
});


test('should create axes with shift origin if y-range is not balanced', () => {
    const a = new Axes({
        xRange: [-4, 4],
        yRange: [0, 4],
        showTicks: false,
        showLabels: false,
    });

    const shapes = a.compose().composedShapes();
    expect(shapes[0].center()).toEqual([0, -4]);
    expect(shapes[1].center()).toEqual([0, 0]);
});


test('should create axes with shift origin if x- and y-range is not balanced', () => {
    const a = new Axes({
        xRange: [0, 4],
        yRange: [0, 4],
        showTicks: false,
        showLabels: false,
    });

    const shapes = a.compose().composedShapes();
    expect(shapes[0].center()).toEqual([0, -4]);
    expect(shapes[1].center()).toEqual([-7, 0]);
});
