import { Prettify } from '../base';
import { CircleArc, StyleArgs, defaultStyleArgs } from './base_shapes';

export class Dot extends CircleArc {
    constructor({ x = 0, y = 0, radius = 0.1, lineColor = undefined, color = undefined, lineWidth = defaultStyleArgs.lineWidth }: { x?: number, y?: number, radius?: number } & Prettify<StyleArgs> = {}) {
        color = color ?? defaultStyleArgs.lineColor;
        lineColor = lineColor ?? color;

        super({ x, y, radius, lineColor, color, lineWidth });
    }
}
