import { Point, Prettify } from '@/base';
import { PointShape } from '@/shapes/primitives/point_shape';
import { Locatable, ShapeStyles } from '@/shapes/shape';

// type TriangleArgs = ({ x?: number; y?: number; } | { center?: Locatable; }) & Prettify<ShapeStyles>;
type TriangleArgs = { x?: number; y?: number; center?: Locatable; width?: number; height?: number; } & Prettify<ShapeStyles>;


class Triangle extends PointShape {
    constructor({ x = 0, y = 0, center = undefined, width = 1, height = 1, ...styleArgs }: TriangleArgs = {}) {
        super({ points: Triangle.trianglePoints(x, y, width, height), ...styleArgs });
    }

    private static trianglePoints(x: number, y: number, width: number, height: number): [Point, Point, Point, Point] {
        const hw = width / 2;
        const hh = height / 2;

        return [
            [x - hw, y - hh],
            [x + hw, y - hh],
            [x, y + hh],
            [x - hw, y - hh]
        ];
    }
}


export { Triangle, type TriangleArgs };
