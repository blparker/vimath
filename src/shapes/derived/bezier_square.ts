import { BezierSegment, ORIGIN, Point } from '@/base';
import { Locatable, ShapeStyles, locatableToPoint } from '@/shapes/shape';
import { PointShape } from '@/shapes/primitives/bezier_point_shape';


class Square extends PointShape {
    constructor();
    constructor(args?: { size?: number; x?: number; y?: number; center?: Locatable } & ShapeStyles) {
        const points = Square.squarePoints(args?.size ?? 2, Square.getCenter(args ?? {}));
        super({ points, ...args });
    }

    private static squarePoints(size: number, center: Point): BezierSegment[] {
        const half = size / 2;
        const [cX, cY] = center;

        return [
            [[cX + half, cY + half], [cX + half, cY + half], [cX + half, cY - half], [cX + half, cY - half]],
            [null, [cX + half, cY - half], [cX - half, cY - half], [cX - half, cY - half]],
            [null, [cX - half, cY - half], [cX - half, cY + half], [cX - half, cY + half]],
            [null, [cX - half, cY + half], [cX + half, cY + half], [cX + half, cY + half]]
        ];
    }

    private static getCenter(args: { x?: number; y?: number; center?: Locatable }): Point {
        if (args.center) {
            return locatableToPoint(args.center);
        } else if (args.x !== undefined && args.y !== undefined) {
            return [args.x, args.y];
        } else {
            return ORIGIN;
        }
    }
}


export { Square };
