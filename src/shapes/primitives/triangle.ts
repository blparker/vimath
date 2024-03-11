import { Point, Prettify } from '@/base';
import { StyleArgs } from '@/shapes/shape';
import { PointShape } from './point_shape';



export class Triangle extends PointShape {
    constructor({ x = 0, y = 0, height = 2, ...styleArgs }: { x?: number; y?: number; height?: number; } & Prettify<StyleArgs> = {}) {
        super({ points: Triangle.points(x, y, height), ...styleArgs });
    }

    private static points(x: number, y: number, size: number): Point[] {
        const hs = size / 2;
        return [
            [x, y + hs],
            [x + hs, y - hs],
            [x - hs, y - hs],
        ];
    }
}
