import { Point } from '../../base.js';
import { StyleArgs } from '../shape.js';
import { PointShape } from './point_shape.js';



export class Square extends PointShape {
    constructor({ x = 0, y = 0, size = 2, ...styleArgs }: { x?: number; y?: number; size?: number; } & StyleArgs = {}) {
        // super({ x, y, radius: size, sides: 4, strokeColor, fill, lineWidth, hoverable, fillHoverable });
        super({ points: Square.points(x, y, size), ...styleArgs });
    }

    private static points(x: number, y: number, size: number): Point[] {
        const hs = size / 2;
        return [
            [x - hs, y + hs],
            [x + hs, y + hs],
            [x + hs, y - hs],
            [x - hs, y - hs]
        ];
    }
}
