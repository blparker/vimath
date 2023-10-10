import { Point } from '../base';
import { PointShape } from '../shapes/base_shapes';
import { NativeRenderer, ShapeRenderer } from './renderer';


export class PointShapeRenderer extends NativeRenderer<PointShape> {
    async render(shape: PointShape): Promise<ShapeRenderer<PointShape>> {
        const points = shape.computedPoints();

        if (points.length <= 1) {
            throw new Error('Two or more points required to render PointShape');
        }

        const line = (p1: Point, p2: Point) => this.canvas.line({ from: p1, to: p2, lineWidth: shape.lineWidth(), color: shape.lineColor() });

        for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];

            line(p1, p2);
        }

        if (points.length > 2) {
            // Connect the last point back to the first point
            line(points[points.length - 1], points[0]);
        }

        return this;
    }
}
