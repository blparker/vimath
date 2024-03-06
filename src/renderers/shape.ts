import { Point } from '../base';
import { Circle } from '../shapes/primitives/circle';
import { CircleArc } from '../shapes/primitives/circle_arc';
import { PointShape } from '../shapes/primitives/point_shape';
import { SvgShape } from '../shapes/brace';
import { NativeRenderer, ShapeRenderer } from './renderer';


export class PointShapeRenderer extends NativeRenderer<PointShape> {
    async render(shape: PointShape): Promise<ShapeRenderer<PointShape>> {
        const points = shape.computedPoints();

        if (points.length <= 1) {
            throw new Error('Two or more points required to render PointShape');
        } else if (points.length > 2) {
            // Connect the last point back to the first point
            // points.push(points[0]);
        }

        this.canvas.path({
            points,
            lineWidth: shape.lineWidth(),
            lineColor: shape.lineColor(),
            lineStyle: shape.lineStyle(),
            color: shape.color(),
            closePath: shape.closePath,
            smooth: shape.smooth,
        });

        // const line = (p1: Point, p2: Point) => this.canvas.line({ from: p1, to: p2, lineWidth: shape.lineWidth(), color: shape.lineColor() });

        // for (let i = 1; i < points.length; i++) {
        //     const p1 = points[i - 1];
        //     const p2 = points[i];

        //     line(p1, p2);
        // }

        // if (points.length > 2) {
        //     // Connect the last point back to the first point
        //     line(points[points.length - 1], points[0]);
        // }

        return this;
    }
}


export class CircleRenderer extends NativeRenderer<CircleArc> {
    async render(shape: CircleArc): Promise<ShapeRenderer<CircleArc>> {
        this.canvas.arc({ center: shape.center(), radius: shape.width() / 2, angle: Math.PI * 2, lineWidth: shape.lineWidth(), lineColor: shape.lineColor(), color: shape.color() });

        return this;
    }
}


export class SvgShapeRenderer extends NativeRenderer<SvgShape> {
    async render(shape: SvgShape): Promise<ShapeRenderer<SvgShape>> {
        this.canvas.svgPath({ path: shape.svgPath(), lineWidth: shape.lineWidth() });
        return this;
    }
}
