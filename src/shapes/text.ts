/// <reference types="offscreencanvas/index.d.ts" />


import { Color, Colors, RGBA } from '../colors.js';
import { Point, Shift, HAlign, RIGHT, OFFSET_GUTTER } from '../base.js';
import * as math from '../math.js';
import { Shape } from './base_shapes.js';


export interface TextMetrics {
    measureText(text: string, size: number): [number, number];
}


export class CanvasTextMetrics implements TextMetrics {
    private canvas: OffscreenCanvas;

    constructor() {
        this.canvas = new OffscreenCanvas(256, 256);
    }

    measureText(text: string, size: number): [number, number] {
        const ctx = this.canvas.getContext('2d');

        if (ctx === null) {
            throw new Error('Context of offscreen canvas is null');
        }

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.font = `${size}px Iowan Old Style, Apple Garamond, Baskerville, Times New Roman, Droid Serif, Times, Source Serif Pro, serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol`;

        const metrics = ctx.measureText(text);
        return [
            metrics.width,
            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
        ];
    }
}


export type TextBaseline = 'top' | 'middle' | 'bottom';


export class Text implements Shape {
    private _text: string;
    private _x: number;
    private _y: number;
    private _size: number;
    private _align: HAlign;
    private _baseline: TextBaseline;
    private _tex: boolean;
    private _color: RGBA;
    private _vertical: boolean;
    private _width: number;
    private _height: number;
    private _textMetrics: TextMetrics;
    private _offsetGutter: number;
    private _angle: number = 0;
    private _currentScale: number = 1;
    // private _canvas = new OffscreenCanvas(256, 256);

    constructor({ text, x = 0, y = 0, size = 20, align = 'center', baseline = 'middle', tex = false, color = Colors.black(), vertical = false, textMetrics = null, offsetGutter = OFFSET_GUTTER }: { text: string; x?: number; y?: number; size?: number; align?: HAlign; baseline?: 'top' | 'middle' | 'bottom'; tex?: boolean; color?: RGBA; vertical?: boolean; textMetrics?: TextMetrics | null; offsetGutter?: number; }) {
        this._text = text;
        this._x = x;
        this._y = y;
        this._size = size;
        this._align = align;
        this._baseline = baseline;
        this._tex = tex;
        this._color = color;
        this._vertical = vertical;
        this._offsetGutter = offsetGutter;

        this._textMetrics = textMetrics ?? new CanvasTextMetrics();
        [this._width, this._height] = this._textMetrics.measureText(text, size);
        // this._width = 0;
        // this._height = 0;
    }

    shift(...shifts: Shift[]): Shape {
        for (const [sX, sY] of shifts) {
            this._x += sX;
            this._y += sY;
        }

        return this;
    }

    moveTo(point: Point): Shape {
        [this._x, this._y] = point;

        return this;
    }

    scale(factor: number): Shape {
        this._size *= factor;
        this._currentScale = factor;

        return this;
    }

    rotate(angle: number): Shape {
        this._angle = angle;

        return this;
    }

    nextTo(shape: Shape, direction: Point = RIGHT()): Shape {
        const [cX, cY] = shape.center();
        let dX = math.add(cX, math.mult(direction[0], shape.width() / 2));
        let dY = math.add(cY, math.mult(direction[1], shape.height() / 2));

        if (dX !== 0) {
            dX += Math.sign(dX) * this._offsetGutter;
        }

        if (dY !== 0) {
            dY += Math.sign(dY) * this._offsetGutter;
        }

        this._x = dX;
        this._y = dY;

        return this;
    }

    center(): Point {
        const cX = this.top()[0];
        const cY = this.left()[1];

        return [cX, cY] as Point;
    }

    moveCenter(newCenter: Point): Shape {
        this.shift(math.subtract(newCenter, this.center()) as Shift);
        return this;
    }

    top(): Point {
        let tX, tY;

        if (this._align === 'left') {
            tX = this._x + this.width() / 2;
        } else if (this._align === 'center') {
            tX = this._x;
        } else {
            tX = this._x - this.width() / 2;
        }

        if (this._baseline === 'top') {
            tY = this._y;
        } else if (this._baseline === 'middle') {
            tY = this._y + this.height() / 2;
        } else {
            tY = this._y + this.height();
        }

        return [tX, tY] as Point;
    }

    bottom(): Point {
        let bX, bY;

        if (this._align === 'left') {
            bX = this._x + this.width() / 2;
        } else if (this._align === 'center') {
            bX = this._x;
        } else {
            bX = this._x - this.width() / 2;
        }

        if (this._baseline === 'top') {
            bY = this._y - this.height();
        } else if (this._baseline === 'middle') {
            bY = this._y - this.height() / 2;
        } else {
            bY = this._y;
        }

        return [bX, bY] as Point;
    }

    left(): Point {
        let lX, lY;

        if (this._align === 'left') {
            lX = this._x;
        } else if (this._align === 'center') {
            lX = this._x - this.width() / 2;
        } else {
            lX = this._x - this.width();
        }

        if (this._baseline === 'top') {
            lY = this._y - this.height() / 2;
        } else if (this._baseline === 'middle') {
            lY = this._y;
        } else {
            lY = this._y + this.height() / 2;
        }

        return [lX, lY] as Point;
    }

    right(): Point {
        let rX, rY;

        if (this._align === 'left') {
            rX = this._x + this.width();
        } else if (this._align === 'center') {
            rX = this._x + this.width() / 2;
        } else {
            rX = this._x;
        }

        if (this._baseline === 'top') {
            rY = this._y - this.height() / 2;
        } else if (this._baseline === 'middle') {
            rY = this._y;
        } else {
            rY = this._y + this.height() / 2;
        }

        return [rX, rY] as Point;
    }

    width(): number {
        return this._width;
    }

    height(): number {
        return this._height;
    }

    get angle(): number {
        return this._angle;
    }

    get currentScale(): number {
        return this._currentScale;
    }

    get text(): string {
        return this._text;
    }

    get size(): number {
        return this._size;
    }

    get align(): HAlign {
        return this._align;
    }

    get baseline(): TextBaseline {
        return this._baseline;
    }

    get color(): RGBA {
        return this._color;
    }

    get vertical(): boolean {
        return this._vertical;
    }
}
