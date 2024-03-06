import { Point, Prettify } from '../../base.js';
import * as math from '../../math.js';
import { Shape, StyleArgs, isShape } from '../shape.js';
import { PointShape } from './point_shape.js';



export class Line extends PointShape {
    constructor({ from, to, length = undefined, ...styleArgs }: { from: Point | Shape; to: Point | Shape; length?: number; } & Prettify<StyleArgs>) {
        if (isShape(from)) {
            from = from.center();
        }

        if (isShape(to)) {
            to = to.center();
        }

        if (length !== undefined) {
            const dist = math.distance(from, to);

            function magnitude(p: Point): number {
                return Math.sqrt(Math.pow(p[0], 2) + Math.pow(p[1], 2));
            }

            if (length > dist) {
                const ab = [to[0] - from[0], to[1] - from[1]] as Point;
                const u = [ab[0] / magnitude(ab), ab[1] / magnitude(ab)];
                const scaledU = math.scalarMultiply(u, length / 2);
                const midPoint = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];

                from = math.subtract(midPoint, scaledU) as Point;
                to = math.add(midPoint, scaledU) as Point;
            }
        }

        super({ points: Line.points(from, to), ...styleArgs });
    }

    private static points(from: Point, to: Point): Point[] {
        return [from, to];
    }
}
