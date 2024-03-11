import { Point, Prettify } from '@/base';
import { StyleArgs } from './shape';
import { Line } from './primitives/line';
import * as math from '@/math';


export class LineThroughPoints extends Line {
    constructor({ p1, p2, length = 3, ...styleArgs }: { p1: Point; p2: Point; length: number; } & Prettify<StyleArgs>) {
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

        return [e1, e2] as [Point, Point];
    }
}
