import { Point, Prettify } from '../../base.js';
import { StyleArgs } from '../shape.js';
import { PointShape } from './point_shape.js';



export class Circle extends PointShape {
    constructor({ x = 0, y = 0, radius = 1, numVertices = 100, ...styleArgs }: { x?: number; y?: number; radius?: number; numVertices?: number; } & Prettify<StyleArgs> = {}) {
        super({ points: Circle.points(x, y, radius, numVertices), ...styleArgs });
    }

    private static points(x: number, y: number, radius: number, numPoints: number): Point[] {
        const points = [];

        for (let i = 0; i < numPoints; i++) {
            const a = (i / numPoints) * Math.PI * 2;
            const [dx, dy] = [x + Math.cos(a) * radius, y + Math.sin(a) * radius];

            points.push([dx, dy]);
        }

        return points as Point[];
    }
}
