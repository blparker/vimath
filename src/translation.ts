import { Point } from '@/base';
import { config } from '@/config';
import { Canvas } from '@/canvas';


class Translation {
    // private _canvasWidth: number;
    // private _canvasHeight: number;
    private _canvas: Canvas;

    constructor(canvas: Canvas) {
        // this._canvasWidth = canvas.width() - 2 * config.canvasPadding;
        // this._canvasHeight = canvas.height() - 2 * config.canvasPadding;
        this._canvas = canvas;
    }

    canvasWidth(): number {
        return this._canvas.width() - 2 * config.canvasPadding;
    }

    canvasHeight(): number {
        return this._canvas.height() - 2 * config.canvasPadding;
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
        const xUnits = this.canvasWidth() / config.xTicks;
        const yUnits = this.canvasHeight() / config.yTicks;

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
            (_x * xUnits) + (this.canvasWidth() / 2) + config.canvasPadding,
            (this.canvasHeight() / 2) - (_y * yUnits) + config.canvasPadding
        ];
    }

    translateAbsolute(x: number, y: number): Point {
        const xUnits = this.canvasWidth() / config.xTicks;
        const yUnits = this.canvasHeight() / config.yTicks;

        return [
            (x - config.canvasPadding - (this.canvasWidth() / 2)) / xUnits,
            (this.canvasHeight() / 2 - (y - config.canvasPadding)) / yUnits,
        ];
    }


    translateDimensions(relWidth: number, relHeight: number): Point {
        const xUnits = this.canvasWidth() / config.xTicks;
        const yUnits = this.canvasHeight() / config.yTicks;

        return [
            relWidth * xUnits,
            relHeight * yUnits
        ];
    }

    translateAbsWidth(absWidth: number): number {
        const xUnits = this.canvasWidth() / config.xTicks;
        // return (absWidth - config.canvasPadding - (this._canvasWidth / 2)) / xUnits;
        // absWidth = relWidth * xUnits
        // relWidth = absWidth / xUnits

        return absWidth / xUnits;
    }

    translateAbsHeight(absHeight: number): number {
        // return absHeight * this._canvasHeight / config.yTicks;
        const yUnits = this.canvasHeight() / config.yTicks;
        return absHeight / yUnits;
    }

    translateRelWidth(relWidth: number): number {
        const xUnits = this.canvasWidth() / config.xTicks;
        return relWidth * xUnits;
    }

    translateRelHeight(relHeight: number): number {
        const yUnits = this.canvasHeight() / config.yTicks;
        return relHeight * yUnits;
    }
}


export { Translation };
