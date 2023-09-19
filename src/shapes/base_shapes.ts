
import { Color, Colors, RGBA } from '../colors.js';
import { Point, Shift, RIGHT, OFFSET_GUTTER } from '../base.js';
import * as math from '../math.js';
// import { Decimal } from 'decimal.js';

const DEFAULT_LINE_WIDTH = 3;


class BaseParams {
    lineColor: Color | null = null;
    fillColor: Color | null = null;
    lineWidth: number = DEFAULT_LINE_WIDTH;
}


export interface Shape {
    angle: number;
    currentScale: number;

    shift(...shifts: Shift[]): Shape;
    moveTo(point: Point): Shape;
    scale(factor: number): Shape;
    rotate(angle: number): Shape;
    nextTo(shape: Shape, direction?: Point): Shape;
    center(): Point;
    moveCenter(newCenter: Point): Shape;
    top(): Point;
    bottom(): Point;
    left(): Point;
    right(): Point;
    width(): number;
    height(): number;
}


export interface Styleable {
    color(): RGBA;
    changeColor(newColor: RGBA): Styleable;
    lineColor(): RGBA;
    changeLineColor(newColor: RGBA): Styleable;
}


export function isShape(o: any): o is Shape {
    return 'moveTo' in o && 'scale' in o && 'rotate' in o;
}


export class PointShape implements Shape, Styleable {
    private _points: Point[];
    private _closePath: boolean;
    private _offsetGutter: number;
    private _angle: number = 0;
    private _currentScale: number = 1;
    private _color: RGBA = Colors.black();
    private _lineColor: RGBA = Colors.black();

    constructor({ points, closePath = true, offsetGutter = OFFSET_GUTTER }: { points: Point[], closePath?: boolean, offsetGutter?: number }) {
        this._points = points;
        this._closePath = closePath;
        this._offsetGutter = offsetGutter;
    }

    shift(...shifts: Shift[]): PointShape {
        for (const point of this._points) {
            // let [pX, pY] = math.toDecimal(point);
            let [pX, pY] = point;

            for (const [sX, sY] of shifts) {
                // pX = pX.add(sX);
                // pY = pY.add(sY);
                [pX, pY] = math.add([pX, pY], [sX, sY]);
                point[0] = pX;
                point[1] = pY;

                // point[0] += sX;
                // point[1] += sY;
            }

            // point[0] = pX.
        }

        return this;
    }

    moveTo(point: Point): PointShape {
        const shift = math.subtract(point, this.center()) as Shift;
        this.shift(shift);

        return this;
    }

    scale(factor: number): PointShape {
        this._currentScale = factor;

        // const [cX, cY] = this.center();

        // for (const point of this._points) {
        //     const sX = point[0] + (cX - point[0]) * (1 - factor);
        //     const sY = point[1] + (cY - point[1]) * (1 - factor);

        //     point[0] = sX;
        //     point[1] = sY;
        // }

        return this;
    }

    rotate(angle: number): PointShape {
        this._angle = angle;
        return this;
        // const [cX, cY] = this.center();

        // for (const point of this._points) {
        //     const [tX, tY] = [point[0] - cX, point[1] - cY];

        //     const nX = tX * Math.cos(angle) - tY * Math.sin(angle);
        //     const nY = tX * Math.sin(angle) + tY * Math.cos(angle);

        //     point[0] = cX + nX;
        //     point[1] = cY + nY;

            /*
            const [tX, tY] = math.subtract(point, [cX, cY]);

            const nX = math.subtract(math.pMultiply(tX, Math.cos(angle)), math.pMultiply(tY, Math.sin(angle)));
            const nY = math.add(math.pMultiply(tX, Math.sin(angle)), math.pMultiply(tY, Math.cos(angle)));

            console.log(math.add(cX, nX))
            point[0] = math.add(cX, nX)[0];
            point[1] = math.add(cY, nY)[0];
            */

            // const tX = Decimal.sub(point[0], cX);
            // const tY = Decimal.sub(point[1], cY);

            // const nX = Decimal.sub(Decimal.mul(tX, Decimal.cos(angle)), Decimal.mul(tY, Decimal.sin(angle)));
            // const nY = Decimal.add(Decimal.mul(tX, Decimal.sin(angle)), Decimal.mul(tY, Decimal.cos(angle)));

            // point[0] = Decimal.add(cX, nX).toNumber();
            // point[1] = Decimal.add(cY, nY).toNumber();
        // }

        // return this;
    }

    nextTo(shape: Shape, direction: Point = RIGHT()): PointShape {
        let offsetX = 0, offsetY = 0;
        let [dX, dY] = direction;

        if (dX !== 0) {
            // Left or right side
            // offsetX = this.width() / 2 + offsetGutter;
            offsetX = math.add(math.pDivide(this.width(), 2), this._offsetGutter);
        } else {
            // Top or bottom side
            // offsetY = this.height() / 2 + offsetGutter;
            offsetY = math.add(math.pDivide(this.height(), 2), this._offsetGutter);
        }

        // dX += offsetX * Math.sign(dX);
        // dY += offsetY * Math.sign(dY);
        dX = math.add(dX, offsetX * Math.sign(dX));
        dY = math.add(dY, offsetY * Math.sign(dY));

        const dest = shape.center();

        for (const point of this._points) {
            // point[0] += dest[0] + dX;
            // point[1] += dest[1] + dY;
            point[0] = math.add(point[0], math.add(dest[0], dX));
            point[1] = math.add(point[1], math.add(dest[1], dY));
        }

        return this;
    }

    center(): Point {
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        for (const point of this.points) {
            minX = Math.min(point[0], minX);
            minY = Math.min(point[1], minY);
            maxX = Math.max(point[0], maxX);
            maxY = Math.max(point[1], maxY);
        }

        return [(minX + maxX) / 2, (minY + maxY) / 2];
    }

    moveCenter(newCenter: Point): PointShape {
        this.shift(math.subtract(newCenter, this.center()) as Shift);
        return this;
    }

    top(): Point {
        const cX = this.center()[0];
        const ys = this.computedPoints().map(p => p[1]);

        return [cX, Math.max(...ys)];
    }

    bottom(): Point {
        const cX = this.center()[0];
        const ys = this.computedPoints().map(p => p[1]);

        return [cX, Math.min(...ys)];
    }

    left(): Point {
        const cY = this.center()[1];
        const xs = this.computedPoints().map(p => p[0]);

        return [Math.min(...xs), cY];
    }

    right(): Point {
        const cY = this.center()[1];
        const xs = this.computedPoints().map(p => p[0]);

        return [Math.max(...xs), cY];
    }

    width(): number {
        return this.right()[0] - this.left()[0];
    }

    height(): number {
        return this.top()[1] - this.bottom()[1];
    }

    public get points(): Point[] {
        return this._points;
    }

    computedPoints(): Point[] {
        const [cX, cY] = this.center();
        const computedPoints = [];

        for (const point of this._points) {
            const [tX, tY] = [point[0] - cX, point[1] - cY];

            const rX = cX + (tX * Math.cos(this._angle) - tY * Math.sin(this._angle));
            const rY = cY + (tX * Math.sin(this._angle) + tY * Math.cos(this._angle));

            // const sX = point[0] + (cX - point[0]) * (1 - this.currentScale);
            // const sY = point[1] + (cY - point[1]) * (1 - this.currentScale);
            const sX = rX + (cX - rX) * (1 - this.currentScale);
            const sY = rY + (cY - rY) * (1 - this.currentScale);

            computedPoints.push([sX, sY] as Point);
        }

        return computedPoints;
    }

    public get closePath(): boolean {
        return this._closePath;
    }

    get angle() {
        return this._angle;
    }

    get currentScale() {
        return this._currentScale;
    }

    color(): RGBA {
        return this._color;
    }

    changeColor(newColor: RGBA): Styleable {
        this._color = newColor;
        return this;
    }

    lineColor(): RGBA {
        return this._lineColor;
    }

    changeLineColor(newColor: RGBA): Styleable {
        this._lineColor = newColor;
        return this;
    }

}


export class Circle extends PointShape {
    constructor({ x = 0, y = 0, radius = 1 }: { x?: number, y?: number, radius?: number }) {
        super({ points: Circle.#points(x, y, radius) });
    }

    static #points(x: number, y: number, radius: number, numPoints: number = 100): Point[] {
        const points = [];

        for (let i = 0; i < numPoints; i++) {
            const a = (i / numPoints) * Math.PI * 2;
            const [dx, dy] = [x + Math.cos(a) * radius, y + Math.sin(a) * radius];
        
            points.push([dx, dy]);
        }

        return points as Point[];
    }
}


export class Line extends PointShape {
    constructor({ from, to }: { from: Point, to: Point }) {
        super({ points: Line.#points(from, to) });
    }

    static #points(from: Point, to: Point): Point[] {
        return [from, to];
    }
}


export class Triangle extends PointShape {
    constructor({ x = 0, y = 0, height = 2 }: { x?: number, y?: number, height?: number }) {
        super({ points: Triangle.#points(x, y, height) });
    }

    static #points(x: number, y: number, size: number): Point[] {
        const hs = size / 2;
        return [
            [x, y + hs],
            [x + hs, y - hs],
            [x - hs, y - hs],
        ];
    }
}


export class Square extends PointShape {
    constructor({ x = 0, y = 0, size = 2, }: { x?: number, y?: number, size?: number } = {}) {
        // super({ x, y, radius: size, sides: 4, strokeColor, fill, lineWidth, hoverable, fillHoverable });
        super({ points: Square.#points(x, y, size) });
    }

    static #points(x: number, y: number, size: number): Point[] {
        const hs = size / 2;
        return [
            [x - hs, y + hs],
            [x + hs, y + hs],
            [x + hs, y - hs],
            [x - hs, y - hs]
        ];
    }
}


export class NSidedPolygon extends PointShape {
    constructor({ sides, x = 0, y = 0, radius = 1 }: { sides: number, x?: number, y?: number, radius?: number }) {
        super({ points: NSidedPolygon.#points(x, y, radius, sides) });
    }

    static #points(x: number, y: number, radius: number, sides: number): Point[] {
        const points: Point[] = [];
        const angle = 2 * Math.PI / sides;

        function rotate(p: number[], theta: number): Point {
            const t = -(Math.PI / 2);
            return [
                Math.cos(theta + t) * p[0] - Math.sin(theta + t) * p[1],
                Math.sin(theta + t) * p[0] + Math.cos(theta + t) * p[1]
            ];
        }

        const base = [x + radius, y + radius * Math.tan((2 * Math.PI) / (sides * 2))]
        for (let i = 0; i < sides; i++) {
            points.push(rotate(base, i * angle));
        }

        return points;
    }
}
