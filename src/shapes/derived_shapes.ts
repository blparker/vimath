import { Point, Prettify } from '../base';
import { CircleArc, Line, PointsAware, StyleArgs, defaultStyleArgs } from './base_shapes';
import * as math from '../math';

export class Dot extends CircleArc {
    constructor({ x = 0, y = 0, radius = 0.1, lineColor = undefined, color = undefined, lineWidth = defaultStyleArgs.lineWidth }: { x?: number, y?: number, radius?: number } & Prettify<StyleArgs> = {}) {
        color = color ?? defaultStyleArgs.lineColor;
        lineColor = lineColor ?? color;

        super({ x, y, radius, lineColor, color, lineWidth });
    }
}


export class TangentLine extends Line {
    constructor({ shape, x, length = 3, ...styleArgs }: { shape: PointsAware, x: number, length: number } & Prettify<StyleArgs>) {
        const [from, to] = TangentLine.linePoints(shape, x, length);
        super({ from, to, ...styleArgs });
    }

    private static linePoints(shape: PointsAware, x: number, length: number): [Point, Point] {
        let idx = -1;
        const points = shape.points();

        for (let i = 0; i < points.length; i++) {
            if (points[i][0] >= x) {
                idx = i;
                break;
            }
        }

        if (idx === -1) {
            throw new Error('Could not find point to the right of x');
        }

        const slope = (points[idx + 1][1] - points[idx][1]) / (points[idx + 1][0] - points[idx][0]);
        const c = 1 / Math.sqrt(1 + Math.pow(slope, 2));
        const s = slope / Math.sqrt(1 + Math.pow(slope, 2));

        const start = math.add(points[idx], [length / 2 * c, length / 2 * s]);
        const end = math.subtract(points[idx], [length / 2 * c, length / 2 * s]);

        return [start as Point, end as Point];
    }
}
