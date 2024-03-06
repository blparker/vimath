import { Point, Prettify } from '../base';
import { PointsAware, StyleArgs, defaultStyleArgs } from './shape';
import { Line } from './primitives/line';
import { CircleArc } from './primitives/circle_arc';
import * as math from '../math';


export type DotArgs = Prettify<({ x?: number, y?: number } | { pt?: Point }) & { radius?: number } & StyleArgs>;
const defaultDotArgs = {
    x: 0,
    y: 0,
    radius: 0.1,
};


export class Dot extends CircleArc {
    constructor(args: DotArgs = {}) {
        const color = args.color ?? defaultStyleArgs.lineColor;
        const lineColor = args.lineColor ?? color;

        let [x, y] = [defaultDotArgs.x, defaultDotArgs.y];
        if ('pt' in args && args.pt) {
            [x, y] = args.pt;
        } else if ('x' in args && 'y' in args && args.x !== undefined && args.y !== undefined) {
            [x, y] = [args.x, args.y];
        }

        const radius = args.radius ?? defaultDotArgs.radius;
        const lineWidth = args.lineWidth ?? defaultStyleArgs.lineWidth;

        super({ x, y, radius, lineColor, color, lineWidth });
    }
}


export class TangentLine extends Line {
    constructor({ shape, length = 3, x, alpha, ...styleArgs }: { shape: PointsAware, length: number, x?: number, alpha?: number } & Prettify<StyleArgs>) {
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


export class LineThroughPoints extends Line {
    constructor({ p1, p2, length = 3, ...styleArgs }: { p1: Point, p2: Point, length: number } & Prettify<StyleArgs>) {
        const [from, to] = LineThroughPoints.linePoints(p1, p2, length);
        super({ from, to, ...styleArgs });
    }

    private static linePoints(p1: Point, p2: Point, length: number): [Point, Point] {
        // https://math.stackexchange.com/questions/9365/endpoint-of-a-line-knowing-slope-start-and-distance
        const slope = (p2[1] - p1[1]) / (p2[0] - p1[0]);
        const midPoint = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
        const halfLength = length / 2;

        // Cosine
        const c = 1 / Math.sqrt(1 + Math.pow(slope, 2));
        // Sine
        const s = slope / Math.sqrt(1 + Math.pow(slope, 2));

        const e1 = math.subtract(midPoint, [halfLength * c, halfLength * s]);
        const e2 = math.add(midPoint, [halfLength * c, halfLength * s]);

        return [e1 as Point, e2 as Point];
    }
}
