import { Point } from '@/base';
import { config } from '@/config';
import { Canvas } from '@/canvas';


class Translation {
    private _canvasWidth: number;
    private _canvasHeight: number;

    constructor(canvas: Canvas) {
        this._canvasWidth = canvas.width() - 2 * config.canvasPadding;
        this._canvasHeight = canvas.height() - 2 * config.canvasPadding;
    }

    /**
     * Translate a relative point (in drawing units) to an absolute point (in pixels)
     * @param x the relative X-coordinate
     * @param y the relative Y-coordinate
     * @returns the absolute point (in pixels)
     */
    translateRelative(x: number, y: number): Point;
    /**
     * Translate a relative point (in drawing units) to an absolute point (in pixels)
     * @param p the relative XY point
     * @returns the absolute point (in pixels)
     */
    translateRelative(p: Point): Point;
    translateRelative(x: unknown, y?: unknown): Point {
        const xUnits = this._canvasWidth / config.xTicks;
        const yUnits = this._canvasHeight / config.yTicks;

        let _x: number;
        let _y: number;

        if (typeof x === 'number' && typeof y === 'number') {
            [_x, _y] = [x, y];
        } else if (Array.isArray(x) && x.length === 2 && typeof x[0] === 'number' && typeof x[1] === 'number') {
            [_x, _y] = x;
        } else {
            throw new Error('Invalid arguments');
        }

        return [
            (_x * xUnits) + (this._canvasWidth / 2) + config.canvasPadding,
            (this._canvasHeight / 2) - (_y * yUnits) + config.canvasPadding
        ];
    }

    translateAbsolute(x: number, y: number): Point {
        const xUnits = this._canvasWidth / config.xTicks;
        const yUnits = this._canvasHeight / config.yTicks;

        return [
            (x - config.canvasPadding - (this._canvasWidth / 2)) / xUnits,
            (this._canvasHeight / 2 - (y - config.canvasPadding)) / yUnits,
        ];
    }
}


export { Translation };
