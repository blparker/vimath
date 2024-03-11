import { Point } from '@/base';
import { StyleArgs } from '@/shapes/shape';
import { PointShape } from './point_shape';



export class NSidedPolygon extends PointShape {
    constructor({ sides, x = 0, y = 0, radius = 1, ...styleArgs }: { sides: number; x?: number; y?: number; radius?: number; } & StyleArgs) {
        super({ points: NSidedPolygon.points(x, y, radius, sides), ...styleArgs });
    }

    private static points(x: number, y: number, radius: number, sides: number): Point[] {
        const points: Point[] = [];
        const angle = 2 * Math.PI / sides;

        function rotate(p: number[], theta: number): Point {
            const t = -(Math.PI / 2);
            return [
                Math.cos(theta + t) * p[0] - Math.sin(theta + t) * p[1],
                Math.sin(theta + t) * p[0] + Math.cos(theta + t) * p[1]
            ];
        }

        const base = [x + radius, y + radius * Math.tan((2 * Math.PI) / (sides * 2))];
        for (let i = 0; i < sides; i++) {
            points.push(rotate(base, i * angle));
        }

        return points;
    }
}
