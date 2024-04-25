import { BezierSegment, ORIGIN, Point, Prettify } from '@/base';
import { Locatable, ShapeStyles, locatableToPoint } from '@/shapes/shape';
import { PointShape} from './bezier_point_shape';


type ArcArgs = {
    center?: Locatable;
    radius?: number;
    startAngle?: number;
    endAngle?: number;
    selectable?: boolean;
};


class Arc extends PointShape {
    private _radius: number;
    private _startAngle: number;
    private _endAngle: number;

    // constructor();
    constructor({ center = ORIGIN, radius = 2, startAngle = 0, endAngle = 2 * Math.PI, selectable = false, ...styleArgs }: Prettify<ArcArgs & ShapeStyles> = {}) {
        const points = Arc.createBezierPoints(locatableToPoint(center), radius, startAngle, endAngle);
        super({ points, selectable, ...styleArgs });

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

    pointAtAngle(angle: number): Point {
        const [cX, cY] = this.center();

        return [
            cX + this._radius * Math.cos(angle),
            cY + this._radius * Math.sin(angle)
        ];
    }

    private static createBezierPoints(center: Point, r: number, startAngle: number, endAngle: number): BezierSegment[] {
        const [cX, cY] = center;
        const k = (4 / 3) * Math.tan(Math.PI / 8);

        return [
            // Top to right
            [[cX, cY + r], [cX + k * r, cY + r], [cX + r, cY + k * r], [cX + r, cY]],
            // Right to bottom
            [null, [cX + r, cY - k * r], [cX + k * r, cY - r], [cX, cY - r]],
            // Bottom to left
            [null, [cX - k * r, cY - r], [cX - r, cY -k * r], [cX - r, cY]],
            // Left to top
            [null, [cX - r, cY + k * r], [cX - k * r, cY + r], [cX, cY + r]]
        ];
    }
}


export { Arc, type ArcArgs };
