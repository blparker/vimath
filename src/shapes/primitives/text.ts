<<<<<<< HEAD
/// <reference types="offscreencanvas/index.d.ts" />
import { HAlign, OFFSET_GUTTER, Point, RIGHT, Shift } from '@/base';
import { Colors, RGBA } from '@/colors';
import * as math from '@/math';
import { PointsAware, Shape, Styleable } from '@/shapes/shape';
import { CanvasTextMetrics, TexTextMetrics, TextMetrics } from './text_metrics';


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

    changeLineColor(_: RGBA): Styleable {
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
=======
import { Point, Prettify, RIGHT } from '@/base';
import { RGBA } from '@/colors';
import { Locatable, Shape, ShapeStyles, defaultShapeStyles, isShape, locatableToPoint } from '@/shapes/shape';
import { config } from '@/config';
import { TextMeasurement } from '@/shapes/primitives/text_measurement';
import utils from '@/utils';


type TextBaseline = 'top' | 'middle' | 'bottom';
type TextAlign = 'left' | 'center' | 'right';

type TextArgs = {
    text: string;
    x?: number;
    y?: number;
    center?: Locatable;
    size?: number;
    font?: string;
    baseline?: TextBaseline;
    align?: TextAlign;
    tex?: boolean;
};


class Text implements Shape {
    private _text: string = 'Vimath';
    private _x: number = 0;
    private _y: number = 0;
    private _size: number = config.text.size;
    private _font: string = 'monospace';
    private _styles: ShapeStyles = Object.assign({}, defaultShapeStyles);
    private _baseline: TextBaseline = 'middle';
    private _align: TextAlign = 'center';
    private _tex: boolean = false;
    private _textWidth: number;
    private _textHeight: number;
    private _textMeasurement: TextMeasurement;
    private _angle = 0;
    private _scale = 1;

    constructor();
    constructor(text: string);
    constructor(args: Prettify<TextArgs & ShapeStyles>);
    constructor(args?: Prettify<TextArgs & ShapeStyles> | string) {
        if (typeof args === 'string') {
            this._text = args;
        } else if (args !== undefined) {
            const { text, x, y, center, size, font, baseline, align, tex, ...styleArgs } = args;

            this._text = text;
            this._size = size ?? this._size;
            this._font = font ?? this._font;
            this._baseline = baseline ?? this._baseline;
            this._align = align ?? this._align;
            this._tex = tex ?? this._tex;
            this._styles = Object.assign({}, defaultShapeStyles, styleArgs);

            if (center !== undefined) {
                [this._x, this._y] = locatableToPoint(center);
            } else {
                this._x = x ?? this._x;
                this._y = y ?? this._y;
            }
        }

        this._textMeasurement = new TextMeasurement(config.canvasInstance!, this._tex);
        this._textWidth = this._textMeasurement.textWidth(this._text, this._size, this._font);
        this._textHeight = this._textMeasurement.textHeight(this._text, this._size, this._font);
    }

    center(): Point {
        const { minX, maxX, minY, maxY } = this.boundingBox();
        return [(minX + maxX) / 2, (minY + maxY) / 2];
    }

    top(): Point {
        const { minX, maxX, maxY } = this.boundingBox();
        return [(minX + maxX) / 2, maxY];
    }

    right(): Point {
        const { maxX, minY, maxY } = this.boundingBox();
        return [maxX, (minY + maxY) / 2];
    }

    bottom(): Point {
        const { minX, maxX, minY } = this.boundingBox();
        return [(minX + maxX) / 2, minY];
    }

    left(): Point {
        const { minX, minY, maxY } = this.boundingBox();
        return [minX, (minY + maxY) / 2];
    }

    width(): number {
        return this._textWidth;
    }

    height(): number {
        return this._textHeight;
    }

    moveTo(point: Point): this {
        const [cX, cY] = this.position();

        this._x += (point[0] - cX);
        this._y += (point[1] - cY);

        return this;
    }

    shift(...shifts: Point[]): this {
        for (const [x, y] of shifts) {
            this._x += x;
            this._y += y;
        }

        return this;
    }

    scale(factor: number): this {
        this._scale += factor;
        return this;
    }

    rotate(angle: number): this {
        this._angle += angle;
        return this;
    }

    nextTo(other: Locatable, direction: Point = RIGHT(), standoff: number = config.standoff): this {
        let [toX, toY] = locatableToPoint(other);
        let [sW, sH] = [0, 0];
        const [w, h] = [this.width(), this.height()];

        if (isShape(other)) {
            sW = other.width();
            sH = other.height();
        }

        const [dX, dY] = direction;

        if (dX > 0) {
            toX += sW / 2 + standoff;

            if (this._align === 'center') {
                toX += w / 2;
            } else if (this._align === 'right') {
                toX += w;
            }
        } else if (dX < 0) {
            toX -= sW / 2 + standoff;

            if (this._align === 'center') {
                toX -= w / 2;
            } else if (this._align === 'left') {
                toX -= w;
            }
        }

        if (dY === 0 && dX !== 0) {
            if (this._baseline === 'top') {
                toY += h / 2;
            } else if (this._baseline === 'bottom') {
                toY -= h / 2;
            }
        }

        if (dY > 0) {
            toY += sH / 2 + standoff;

            if (this._baseline === 'middle') {
                toY += h / 2;
            } else if (this._baseline === 'top') {
                toY += h;
            }
        } else if (dY < 0) {
            toY -= sH / 2 + standoff;

            if (this._baseline === 'middle') {
                toY -= h / 2;
            } else if (this._baseline === 'bottom') {
                toY -= h;
            }
        }

        if (dX === 0 && dY !== 0) {
            if (this._align === 'left') {
                toX -= w / 2;;
            } else if (this._align === 'right') {
                toX += w / 2;
            }
        }

        const adjStandoff = Math.sqrt(standoff ** 2 / 2);

        if (direction[0] !== 0 && direction[1] !== 0) {
            const xDir = Math.sign(direction[0]);
            const yDir = Math.sign(direction[1]);

            toX += -xDir * standoff;
            toY += -yDir * standoff;

            toX += xDir * adjStandoff;
            toY += yDir * adjStandoff;
        }

        this.moveTo([toX, toY]);

        return this;
    }

    angle(): number {
        return this._angle;
    }

    currentScale(): number {
        return this._scale;
    }

    styles(): ShapeStyles {
        return this._styles;
    }

    setStyles(newStyles: ShapeStyles): this {
        this._styles = newStyles;
        return this;
    }

    changeColor(color: RGBA): this {
        this.styles().color = color;
        return this;
    }

    changeLineColor(color: RGBA): this {
        this.styles().lineColor = color;
        return this;
    }

    text(): string {
        return this._text;
    }

    copy(): this {
        return utils.deepCopy(this);
    }

    baseline(): TextBaseline {
        return this._baseline;
    }

    align(): TextAlign {
        return this._align;
    }

    fontSize(): number {
        return this._size;
    }

    fontFamily(): string {
        return this._font;
    }

    position(): Point {
        return [this._x, this._y];
    }

    isTex(): boolean {
        return this._tex;
    }

    private boundingBox(): { minX: number, maxX: number, minY: number, maxY: number } {
        const left = this._align === 'left' ? this._x : this._align === 'center' ? this._x - this._textWidth / 2 : this._x - this._textWidth;
        const top = this._baseline === 'top' ? this._y : this._baseline === 'middle' ? this._y - this._textHeight / 2 : this._y - this._textHeight;

        return {
            minX: left,
            maxX: left + this._textWidth,
            minY: top,
            maxY: top + this._textHeight
        };
    }
}

export { Text, type TextBaseline, type TextAlign, type TextArgs };
>>>>>>> refactor/master
