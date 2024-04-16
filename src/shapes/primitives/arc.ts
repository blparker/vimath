import { ORIGIN, Point, Prettify } from '@/base';
import { RGBA } from '@/colors';
import { PointShape, ShapeStyles, locatableToPoint } from '@/shapes/primitives/point_shape';
import { Locatable, Shape } from '@/shapes/shape';


class Arc extends PointShape {
    private _radius: number;
    private _startAngle: number;
    private _endAngle: number;


    constructor({ center = ORIGIN, radius = 2, startAngle = 0, endAngle = 2 * Math.PI, selectable = false, ...styleArgs }: { center?: Locatable; radius?: number; startAngle?: number; endAngle?: number; selectable?: boolean; } & Prettify<ShapeStyles> = {}) {
        super({ points: [locatableToPoint(center)], selectable, ...styleArgs });

        this._radius = radius;
        this._startAngle = startAngle;
        this._endAngle = endAngle;
    }

    radius(): number {
        return this._radius;
    }

    startAngle(): number {
        return this._startAngle;
    }

    endAngle(): number {
        return this._endAngle;
    }

    isPointOnEdge(point: Point): boolean {
        const [cX, cY] = this.points()[0];
        const [pX, pY] = point;

        const d = Math.sqrt((pX - cX) ** 2 + (pY - cY) ** 2);
        return Math.abs(d - this._radius) < 0.1;
    }

    changeColor(color: RGBA): Shape {
        super.changeColor(color);
        this.changeLineColor(color);

        return this;
    }

    pointAtAngle(angle: number): Point {
        const [cX, cY] = this.points()[0];

        return [cX + this._radius * Math.cos(angle), cY + this._radius * Math.sin(angle)];
    }

    width(): number {
        return 2 * this._radius;
    }

    height(): number {
        return 2 * this._radius;
    }

    top(): Point {
        const [cX, cY] = this.points()[0];
        return [cX, cY + this._radius];
    }

    right(): Point {
        const [cX, cY] = this.points()[0];
        return [cX + this._radius, cY];
    }

    bottom(): Point {
        const [cX, cY] = this.points()[0];
        return [cX, cY - this._radius];
    }

    left(): Point {
        const [cX, cY] = this.points()[0];
        return [cX - this._radius, cY];
    }
}


export { Arc };
