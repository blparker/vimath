import { BezierSegment, ORIGIN, Point, Prettify } from '@/base';
import { RGBA } from '@/colors';
import { ShapeStyles, locatableToPoint } from '@/shapes/primitives/point_shape';
import { Locatable, Shape } from '@/shapes/shape';
import { PointShape } from '@/shapes/primitives/bezier_point_shape';


class Arc extends PointShape {
    private _radius: number;
    private _startAngle: number;
    private _endAngle: number;

    constructor({ center = ORIGIN, radius = 2, startAngle = 0, endAngle = 2 * Math.PI, selectable = false, ...styleArgs }: { center?: Locatable; radius?: number; startAngle?: number; endAngle?: number; selectable?: boolean; } & Prettify<ShapeStyles> = {}) {
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

    private static createBezierPoints(center: Point, r: number, startAngle: number, endAngle: number): BezierSegment[] {
        const [cX, cY] = center;
        const k = (4 / 3) * Math.tan(Math.PI / 8);

        return [
            // Right to bottom
            [[cX, cY + r], [cX + k * r, cY + r], [cX + r, cY + k * r], [cX + r, cY]],
            // Right to top
            [null, [cX + r, cY - k * r], [cX + k * r, cY - r], [cX, cY - r]],
            // Top to left
            [null, [cX - k * r, cY - r], [cX - r, cY -k * r], [cX - r, cY]],
            // Left to bottom
            [null, [cX - r, cY + k * r], [cX - k * r, cY + r], [cX, cY + r]]
        ];
    }
}


export { Arc };
