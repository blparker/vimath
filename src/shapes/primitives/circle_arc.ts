import { Colors, RGBA, parseColor } from '@/colors';
import { Point, Shift, RIGHT, OFFSET_GUTTER, Prettify } from '@/base';
import * as math from '@/math';
import { PointsAware, Shape, StyleArgs, Styleable, defaultStyleArgs } from '@/shapes/shape';



export class CircleArc implements Shape, Styleable, PointsAware {
    private _angle: number = 0;
    private _currentScale: number = 1;
    private cX: number;
    private cY: number;
    private radius: number;
    private _color: RGBA = Colors.black();
    private _lineColor: RGBA;
    private _lineWidth: number;

    constructor({ x = 0, y = 0, radius = 1, ...styleArgs }: { x?: number; y?: number; radius?: number; } & Prettify<StyleArgs> = {}) {
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
