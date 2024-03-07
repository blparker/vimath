import { StyleArgs, defaultStyleArgs } from './shape';
import { CircleArc } from './primitives/circle_arc';
import { Point, Prettify } from '@/base';


export type DotArgs = Prettify<({ x?: number, y?: number } | { pt?: Point }) & { radius?: number } & StyleArgs>;
export const defaultDotArgs = {
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
