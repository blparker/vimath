import { ORIGIN, Point } from '@/base';
import { PointShape, locatableToPoint } from '@/shapes/old/point_shape';
import { Locatable, ShapeStyles } from '@/shapes/shape';



class Square extends PointShape {
    constructor();
    constructor(args?: { size?: number; x?: number; y?: number; center?: Locatable } & ShapeStyles) {
        super({ points: Square.squarePoints(args?.size ?? 2, Square.getCenter(args ?? {})), ...args });
    }

    private static squarePoints(size: number, center: Point): Point[] {
        const half = size / 2;
        const [cX, cY] = center;

        return [
            [cX - half, cY - half],
            [cX + half, cY - half],
            [cX + half, cY + half],
            [cX - half, cY + half]
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
