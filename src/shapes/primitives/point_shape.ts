import { Colors, RGBA, parseColor } from '@/colors';
import { Point, Shift, RIGHT, OFFSET_GUTTER, Prettify } from '@/base';
import * as math from '@/math';
import { LineStyle, PointsAware, Shape, StyleArgs, Styleable, defaultStyleArgs } from '@/shapes/shape';

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
    constructor({ points, closePath = true, offsetGutter = OFFSET_GUTTER, smooth = false, ...styleArgs }: { points: Point[]; closePath?: boolean; offsetGutter?: number; smooth?: boolean; } & Prettify<StyleArgs>) {
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

    public setPoints(points: Point[]) {
        this._points = points;
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
