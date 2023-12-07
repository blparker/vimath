
import { Colors, RGBA, parseColor } from '../colors.js';
import { Point, Shift, RIGHT, OFFSET_GUTTER, Prettify } from '../base.js';
import * as math from '../math.js';

const DEFAULT_LINE_WIDTH = 3;


export interface Shape {
    angle: number;
    currentScale: number;

    shift(...shifts: Shift[]): Shape;
    moveTo(point: Point): Shape;
    scale(factor: number): Shape;
    rotate(angle: number): Shape;
    nextTo(shape: Shape | Point, direction?: Point): Shape;
    center(): Point;
    moveCenter(newCenter: Point): Shape;
    top(): Point;
    bottom(): Point;
    left(): Point;
    right(): Point;
    width(): number;
    height(): number;
    copy(): Shape;
}


export interface Styleable {
    color(): RGBA;
    changeColor(newColor: RGBA): Styleable;
    lineColor(): RGBA;
    changeLineColor(newColor: RGBA): Styleable;
    lineWidth(): number;
}


export interface PointsAware {
    points(): Point[];
}


export function isShape(o: any): o is Shape {
    return 'moveTo' in o && 'scale' in o && 'rotate' in o;
}


export function isPointsAware(o: any): o is PointsAware {
    return 'points' in o && typeof o.points === 'function';
}


export type LineStyle = 'solid' | 'dashed' | 'dotted';

export type StyleArgs = {
    lineColor?: string | RGBA;
    color?: string | RGBA;
    lineWidth?: number;
    lineStyle?: LineStyle;
};

export const defaultStyleArgs = {
    lineColor: Colors.black(),
    lineWidth: DEFAULT_LINE_WIDTH,
    color: Colors.transparent(),
    lineStyle: 'solid',
} as const;


/**
 * PointShape is a base class for shapes that are constructed of points and lines (e.g., square)
 */
export class PointShape implements Shape, Styleable, PointsAware {
    private _points: Point[];
    private _closePath: boolean;
    private _offsetGutter: number;
    private _angle: number = 0;
    private _currentScale: number = 1;
    private _color: RGBA = Colors.black();
    private _lineColor: RGBA;
    private _lineWidth: number;
    private _lineStyle: LineStyle;
    private _smooth: boolean;

    /**
     * ctor
     * @param points an array (Point[]) of points that make up this shape
     * @param closePath a flag indicating whether or not the last point should be connected back to the first point
     * @param offsetGutter a number indicating the relative closeness of other shapes when placing shapes next to this object
     * @param smooth a flag indicating whether or not a more sophisticated spline approach should be used to smooth out the lines connecting the points
     * @param lineColor the color of the line connecting the points
     * @param lineWidth the widht of hte line connecting the points
     * @param color for connected shapes, the color of the fill
     */
    constructor({ points, closePath = true, offsetGutter = OFFSET_GUTTER, smooth = false, ...styleArgs }: { points: Point[], closePath?: boolean, offsetGutter?: number, smooth?: boolean } & Prettify<StyleArgs>) {
        this._points = points;
        this._closePath = closePath;
        this._offsetGutter = offsetGutter;
        this._smooth = smooth;

        const a = { ...defaultStyleArgs, ...styleArgs };

        this._color = styleArgs.color !== undefined ? parseColor(styleArgs.color) : defaultStyleArgs.color;
        this._lineColor = styleArgs.lineColor !== undefined ? parseColor(styleArgs.lineColor) : (styleArgs.color !== undefined ? this._color : defaultStyleArgs.lineColor);
        this._lineWidth = a.lineWidth;
        this._lineStyle = a.lineStyle;
    }

    shift(...shifts: Shift[]): PointShape {
        for (const point of this._points) {
            let [pX, pY] = point;

            for (const [sX, sY] of shifts) {
                [pX, pY] = math.add([pX, pY], [sX, sY]);
                point[0] = pX;
                point[1] = pY;
            }
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
    }

    nextTo(shape: Shape | Point, direction: Point = RIGHT()): PointShape {
        let offsetX = 0, offsetY = 0;
        let [dX, dY] = direction;

        if (dX !== 0) {
            // Left or right side
            offsetX = math.add(math.pDivide(this.width(), 2), this._offsetGutter);
        } else {
            // Top or bottom side
            offsetY = math.add(math.pDivide(this.height(), 2), this._offsetGutter);
        }

        dX = math.add(dX, offsetX * Math.sign(dX));
        dY = math.add(dY, offsetY * Math.sign(dY));

        const dest = Array.isArray(shape) ? shape : shape.center();

        for (const point of this._points) {
            point[0] = math.add(point[0], math.add(dest[0], dX));
            point[1] = math.add(point[1], math.add(dest[1], dY));
        }

        return this;
    }

    center(): Point {
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        for (const point of this.points()) {
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

    public points(): Point[] {
        return this._points;
    }

    computedPoints(): Point[] {
        const [cX, cY] = this.center();
        const computedPoints = [];

        for (const point of this._points) {
            const [tX, tY] = [point[0] - cX, point[1] - cY];

            const rX = cX + (tX * Math.cos(this._angle) - tY * Math.sin(this._angle));
            const rY = cY + (tX * Math.sin(this._angle) + tY * Math.cos(this._angle));

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

    get smooth(): boolean {
        return this._smooth;
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

    lineWidth(): number {
        return this._lineWidth;
    }

    lineStyle(): LineStyle {
        return this._lineStyle;
    }

    changeLineWidth(newLineWidth: number): PointShape {
        this._lineWidth = newLineWidth;
        return this;
    }

    copy(): Shape {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}


export class CircleArc implements Shape, Styleable, PointsAware {
    private _angle: number = 0;
    private _currentScale: number = 1;
    private cX: number;
    private cY: number;
    private radius: number;
    private _color: RGBA = Colors.black();
    private _lineColor: RGBA;
    private _lineWidth: number;

    constructor({ x = 0, y = 0, radius = 1, ...styleArgs }: { x?: number, y?: number, radius?: number } & Prettify<StyleArgs> = {}) {
        this.cX = x;
        this.cY = y;
        this.radius = radius;

        const a = { ...defaultStyleArgs, ...styleArgs };
        this._color = parseColor(a.color);
        this._lineColor = parseColor(a.lineColor);
        this._lineWidth = a.lineWidth;
    }

    shift(...shifts: Shift[]): Shape {
        for (const shift of shifts) {
            [this.cX, this.cY] = math.add(this.center(), shift);
        }

        return this;
    }

    moveTo(point: Point): Shape {
        [this.cX, this.cY] = point;
        return this;
    }

    scale(factor: number): Shape {
        this._currentScale = factor;

        return this;
    }

    rotate(angle: number): Shape {
        this._angle = angle;
        return this;
    }

    nextTo(shape: Shape | Point, direction: Point = RIGHT()): Shape {
        let offsetX = 0, offsetY = 0;
        let [dX, dY] = direction;

        if (dX !== 0) {
            // Left or right side
            offsetX = math.add(this.scaledRadius(), OFFSET_GUTTER);
        } else {
            // Top or bottom side
            offsetY = math.add(this.scaledRadius(), OFFSET_GUTTER);
        }

        dX = math.add(dX, offsetX * Math.sign(dX));
        dY = math.add(dY, offsetY * Math.sign(dY));

        const dest = Array.isArray(shape) ? shape : shape.center();
        const center = this.center();

        const nX = math.add(center[0], math.add(dest[0], dX));
        const nY = math.add(center[1], math.add(dest[1], dY));

        this.moveCenter([nX, nY]);

        return this;
    }

    center(): Point {
        return [this.cX, this.cY];
    }

    moveCenter(newCenter: Point): Shape {
        [this.cX, this.cY] = newCenter;
        return this;
    }

    top(): Point {
        return [this.cX, this.cY + this.scaledRadius()];
    }

    bottom(): Point {
        return [this.cX, this.cY - this.scaledRadius()];
    }

    left(): Point {
        return [this.cX - this.scaledRadius(), this.cY];
    }

    right(): Point {
        return [this.cX + this.scaledRadius(), this.cY];
    }

    width(): number {
        return this.scaledRadius() * 2;
    }

    height(): number {
        return this.scaledRadius() * 2;
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

    lineWidth(): number {
        return this._lineWidth;
    }

    get angle() {
        return this._angle;
    }

    get currentScale() {
        return this._currentScale;
    }

    copy(): Shape {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    points(): Point[] {
        const numPoints = 100;
        const points = [];

        for (let i = 0; i < numPoints; i++) {
            const a = (i / numPoints) * Math.PI * 2;
            const [dx, dy] = [this.cX + Math.cos(a) * this.scaledRadius(), this.cY + Math.sin(a) * this.scaledRadius()];

            points.push([dx, dy]);
        }

        points.push([this.cX + this.scaledRadius(), this.cY]);

        return points as Point[];
    }

    private scaledRadius(): number {
        return this.radius * this.currentScale;
    }
}


export class Circle extends PointShape {
    constructor({ x = 0, y = 0, radius = 1, numVertices = 100, ...styleArgs }: { x?: number, y?: number, radius?: number, numVertices?: number } & Prettify<StyleArgs> = {}) {
        super({ points: Circle.points(x, y, radius, numVertices), ...styleArgs });
    }

    private static points(x: number, y: number, radius: number, numPoints: number): Point[] {
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
    constructor({ from, to, ...styleArgs }: { from: Point, to: Point } & Prettify<StyleArgs>) {
        super({ points: Line.points(from, to), ...styleArgs });
    }

    private static points(from: Point, to: Point): Point[] {
        return [from, to];
    }
}


export class Triangle extends PointShape {
    constructor({ x = 0, y = 0, height = 2, ...styleArgs }: { x?: number, y?: number, height?: number } & Prettify<StyleArgs> = {}) {
        super({ points: Triangle.points(x, y, height), ...styleArgs });
    }

    private static points(x: number, y: number, size: number): Point[] {
        const hs = size / 2;
        return [
            [x, y + hs],
            [x + hs, y - hs],
            [x - hs, y - hs],
        ];
    }
}


export class Square extends PointShape {
    constructor({ x = 0, y = 0, size = 2, ...styleArgs }: { x?: number, y?: number, size?: number } & StyleArgs = {}) {
        // super({ x, y, radius: size, sides: 4, strokeColor, fill, lineWidth, hoverable, fillHoverable });
        super({ points: Square.points(x, y, size), ...styleArgs });
    }

    private static points(x: number, y: number, size: number): Point[] {
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
    constructor({ sides, x = 0, y = 0, radius = 1, ...styleArgs }: { sides: number, x?: number, y?: number, radius?: number } & StyleArgs) {
        super({ points: NSidedPolygon.points(x, y, radius, sides), ...styleArgs });
    }

    private static points(x: number, y: number, radius: number, sides: number): Point[] {
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
