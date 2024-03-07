import { Point, Prettify } from '../base';
import { PointsAware, StyleArgs } from './shape';
import { Line } from './primitives/line';
import * as math from '../math';





export class TangentLine extends Line {
    constructor({ shape, length = 3, x, alpha, ...styleArgs }: { shape: PointsAware; length: number; x?: number; alpha?: number; } & Prettify<StyleArgs>) {
        const [from, to] = TangentLine.linePoints(shape, length, x, alpha);
        super({ from, to, ...styleArgs });
    }

    private static linePoints(shape: PointsAware, length: number, x?: number, alpha?: number): [Point, Point] {
        const points = shape.points();
        const idx = TangentLine.startingIndex(shape, x, alpha);

        const slope = (points[idx + 1][1] - points[idx][1]) / (points[idx + 1][0] - points[idx][0]);
        const c = 1 / Math.sqrt(1 + Math.pow(slope, 2));
        const s = slope / Math.sqrt(1 + Math.pow(slope, 2));

        const start = math.add(points[idx], [length / 2 * c, length / 2 * s]);
        const end = math.subtract(points[idx], [length / 2 * c, length / 2 * s]);

        return [start as Point, end as Point];
    }

    private static startingIndex(shape: PointsAware, x?: number, alpha?: number): number {
        const points = shape.points();

        if (x !== undefined) {
            for (let i = 0; i < points.length; i++) {
                if (points[i][0] >= x) {
                    return i;
                }
            }
            throw new Error('Could not find point to the right of x');
        } else if (alpha !== undefined) {
            if (alpha < 0 || alpha > 1) {
                throw new Error('alpha must be between 0 and 1');
            }

            return Math.floor(alpha * points.length);
        } else {
            throw new Error('Must provide either x or alpha');
        }
    }
}
