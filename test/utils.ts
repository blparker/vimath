import { expect } from 'vitest';
import { Point, X_TICKS, Y_TICKS } from '../src/base';
import { HtmlCanvas } from '../src/renderers/renderer';
import { zip } from '../src/math';
import { TextMetrics } from '../src/shapes/primitives/text_metrics';


export function createTestCanvas(cvsWidth = 400, cvsHeight = 200): HtmlCanvas {
    const cvs: HTMLCanvasElement = document.createElement('canvas');
    cvs.width = cvsWidth; cvs.height = cvsHeight;

    return new HtmlCanvas(cvs);
}


export function expectArraysClose(a1: number[][], a2: number[][], delta: number = 5) {
    if (a1.length !== a2.length) {
        throw new Error('Must compare arrays of equal length');
    }

    for (const [p1, p2] of zip(a1, a2)) {
        expect(p1[0]).toBeCloseTo(p2[0], delta);
        expect(p1[1]).toBeCloseTo(p2[1], delta);
    }
}


export class TestTextMetrics implements TextMetrics {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    measureText(): [number, number] {
        // return [105.23332977294922, 15.419921875];
        const canvasWidth = 860;
        const canvasHeight = 500;

        // const [cX, cY] = [(canvasWidth - 40) / 2, (canvasHeight - 40) / 2];
        const [cX, cY] = this._translate([0, 0], canvasWidth, canvasHeight);
        const [pX, pY] = this._untranslate([cX - this.width, cY - this.height], canvasWidth, canvasHeight);

        // return this._untranslate(
        //     [cX - this.width, cY - this.height] as Point,
        //     canvasWidth,
        //     canvasHeight
        // )
        return [Math.abs(pX), Math.abs(pY)];
    }

    _translate(point: Point, canvasWidth: number, canvasHeight: number): [number, number] {
        const padding = 20;

        const [xTicks, yTicks] = [
            (canvasWidth - 2 * padding) / X_TICKS,
            (canvasHeight - 2 * padding) / Y_TICKS
        ];
        const [oX, oY] = [X_TICKS / 2 * xTicks, Y_TICKS / 2 * yTicks];

        return [padding + oX + point[0] * xTicks, padding + oY - point[1] * yTicks];
    }

    _untranslate(point: Point, canvasWidth: number, canvasHeight: number): [number, number] {
        const padding = 20;

        const [xTicks, yTicks] = [
            (canvasWidth - 2 * padding) / X_TICKS,
            (canvasHeight - 2 * padding) / Y_TICKS
        ];

        /*
        For a canvas that is 860px wide, it's divided into X_TICK chunks. For X_TICKS = 14, each tick size (minus padding on either side) is
        (860 - 40 (padding)) / 14 = 58.571428571428571. We are translating absolute X-Y points into canvas units relative to the origin being
        at the center. THe center is simply the the the total width/height of the canvas divided by 2. The center X is located at
        58.571428571428571 * (14 / 2) = 410.

        Center of canvas: ((canvasWidth - padding) / 2, (canvasHeight - padding) / 2) = (410, 230)
        X-Tick size: (canvasWidth - padding) / 14 = 58.571428571428571
        Y-Tick size: (canvasHeight - padding) / 8 = 57.5
        Width/height of text: (100, 10)
        Left of text (relative to center): (410 - 100, 230) = (310, 230)
        Untranslate(310, 230):
            Relative X: (310 - 410) - 20 / 58.571428571428571 = -2.048780487804878
            Relative Y: 0
        */
        const [oX, oY] = [X_TICKS / 2 * xTicks, Y_TICKS / 2 * yTicks];

        return [(point[0] - oX - padding) / xTicks, -(point[1] - oY - padding) / yTicks];
    }
}
