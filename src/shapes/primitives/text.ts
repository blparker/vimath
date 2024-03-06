/// <reference types="offscreencanvas/index.d.ts" />
import { Colors, RGBA } from '../../colors.js';
import { Point, Shift, HAlign, RIGHT, OFFSET_GUTTER, DEFAULT_PADDING } from '../../base.js';
import * as math from '../../math.js';
import { PointsAware, Shape, Styleable } from '../shape.js';
import { TexTextMetrics } from '../text_metrics.js';
import { TextMetrics } from '../text_metrics.js';
import { CanvasTextMetrics } from '../text_metrics.js';


export type TextBaseline = 'top' | 'middle' | 'bottom';


export class Text implements Shape, PointsAware, Styleable {
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

        this._textMetrics = textMetrics ?? (tex ? new TexTextMetrics() : new CanvasTextMetrics());
        [this._width, this._height] = this._textMetrics.measureText(text, size);
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

    nextTo(shape: Shape | Point, direction: Point = RIGHT()): Shape {
        const [w, h] = [this.width(), this.height()];
        const [dX, dY] = direction;

        const shapeCenter = Array.isArray(shape) ? shape : shape.center();
        const [shapeWidth, shapeHeight] = [
            Array.isArray(shape) ? 0 : shape.width(),
            Array.isArray(shape) ? 0 : shape.height(),
        ];

        let align = this.align === 'left' ? -w / 2 : this.align === 'right' ? w / 2 : 0;
        let baseline = this.baseline === 'top' ? h / 2 : this.baseline === 'bottom' ? -h / 2 : 0;

        const nX = shapeCenter[0] + align + (dX * shapeWidth / 2) + (dX * w / 2) + (dX * this._offsetGutter);
        const nY = shapeCenter[1] + baseline + (dY * shapeHeight / 2) + (dY * h / 2) + (dY * this._offsetGutter);

        this.moveTo([nX, nY])

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
            // rX = this._x + this.width();
            rX = math.add(this._x, this.width());
        } else if (this._align === 'center') {
            // rX = this._x + this.width() / 2;
            rX = math.add(this._x, math.div(this.width(), 2));
        } else {
            rX = this._x;
        }

        if (this._baseline === 'top') {
            // rY = this._y - this.height() / 2;
            rY = math.subtract(this._y, math.div(this.height(), 2));
        } else if (this._baseline === 'middle') {
            rY = this._y;
        } else {
            // rY = this._y + this.height() / 2;
            rY = math.add(this._y, math.div(this.height(), 2));
        }

        return [rX, rY] as Point;
    }

    width(): number {
        return this._width;
    }

    height(): number {
        return this._height;
    }

    copy(): Shape {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    points(): Point[] {
        return [this.top(), this.bottom(), this.left(), this.right()];
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

    // get color(): RGBA {
    //     return this._color;
    // }

    get vertical(): boolean {
        return this._vertical;
    }

    get tex(): boolean {
        return this._tex;
    }

    get location(): Point {
        return [this._x, this._y];
    }

    color(): RGBA {
        return this._color;
    }

    changeColor(newColor: RGBA): Styleable {
        this._color = newColor;
        return this;
    }

    lineColor(): RGBA {
        return this._color;
    }

    changeLineColor(newColor: RGBA): Styleable {
        return this;
    }

    lineWidth(): number {
        return 0;
    }

    setText(newText: string): Text {
        this._text = newText;
        return this;
    }
}
