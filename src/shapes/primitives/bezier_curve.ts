import { Point } from '@/base';
import { PointShape } from '@/shapes/primitives/point_shape';
import { ShapeStyles } from '@/shapes/shape';


class BezierCurve extends PointShape {
    constructor({ start, control1, control2, end, ...styles }: { start: Point, control1: Point, control2: Point, end: Point } & ShapeStyles) {
        super({ points: [[start, control1, control2, end]], ...styles });
    }
}


export { BezierCurve };
