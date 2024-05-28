import { BezierSegment, ORIGIN, Point, Prettify } from '@/base';
import { Locatable, ShapeStyles, locatableToPoint } from '@/shapes/shape';
import { PointShape} from './point_shape';


type ArcArgs = {
    center?: Locatable;
    radius?: number;
    startAngle?: number;
    endAngle?: number;
    selectable?: boolean;
};


class Arc extends PointShape {
    private _center: Point;
    private _radius: number;
    private _startAngle: number;
    private _endAngle: number;

    // constructor();
    constructor({ center = ORIGIN, radius = 2, startAngle = 0, endAngle = 2 * Math.PI, selectable = false, ...styleArgs }: Prettify<ArcArgs & ShapeStyles> = {}) {
        const points = Arc.createBezierPointsWithSegments(locatableToPoint(center), radius, startAngle, endAngle);
        super({ points, selectable, ...styleArgs });

        this._center = locatableToPoint(center);
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
        const [cX, cY] = this._center;

        return [
            cX + this._radius * Math.cos(angle),
            cY + this._radius * Math.sin(angle)
        ];
    }

    changeAngle(newAngle: number): this {
        this.changePoints(Arc.createBezierPointsWithSegments(this._center, this._radius, this._startAngle, newAngle));
        this._endAngle = newAngle;

        return this;
    }

    private static createBezierPointsForCircle(center: Point, r: number): BezierSegment[] {
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

    private static createBezierPointsWithSegments(center: Point, r: number, startAngle: number, endAngle: number): BezierSegment[] {
        if (startAngle == 0 && endAngle == 2 * Math.PI) {
            return Arc.createBezierPointsForCircle(center, r);
        }

        const segments: BezierSegment[] = [];
        const [cX, cY] = center;

        // Normalize angles to be within [0, 2 * Math.PI)
        startAngle = startAngle % (2 * Math.PI);
        endAngle = endAngle % (2 * Math.PI);
        if (startAngle < 0) startAngle += 2 * Math.PI;
        if (endAngle < 0) endAngle += 2 * Math.PI;

        // Determine total angle to sweep
        let totalAngle = endAngle - startAngle;
        if (totalAngle <= 0) {
            totalAngle += 2 * Math.PI;
        }

        // Divide the arc into segments
        const numSegments = Math.ceil(totalAngle / (Math.PI / 2));
        const segmentAngle = totalAngle / numSegments;

        for (let i = 0; i < numSegments; i++) {
            const angle1 = startAngle + i * segmentAngle;
            const angle2 = startAngle + (i + 1) * segmentAngle;

            const x1 = cX + r * Math.cos(angle1);
            const y1 = cY + r * Math.sin(angle1);
            const x4 = cX + r * Math.cos(angle2);
            const y4 = cY + r * Math.sin(angle2);

            const deltaAngle = angle2 - angle1;
            const alpha = (4 / 3) * Math.tan(deltaAngle / 4);

            const x2 = x1 - r * alpha * Math.sin(angle1);
            const y2 = y1 + r * alpha * Math.cos(angle1);
            const x3 = x4 + r * alpha * Math.sin(angle2);
            const y3 = y4 - r * alpha * Math.cos(angle2);

            const segment: BezierSegment = i === 0
                ? [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
                : [null, [x2, y2], [x3, y3], [x4, y4]];

            segments.push(segment);
        }

        return segments;
    }
}


export { Arc, type ArcArgs };
