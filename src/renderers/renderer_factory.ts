import { CircleArc, PointShape, Shape } from '../shapes/base_shapes';
import { Text } from '../shapes/text';
import { Canvas, ShapeRenderer } from './renderer';
import { CircleRenderer, PointShapeRenderer } from './shape';
import { TextRenderer } from './text';


export function getRenderer(canvas: Canvas, shape: Shape): ShapeRenderer<Shape> {
    if (shape instanceof PointShape) {
        return new PointShapeRenderer(canvas);
    } else if (shape instanceof Text) {
        return new TextRenderer(canvas);
    } else if (shape instanceof CircleArc) {
        return new CircleRenderer(canvas);
    }

    throw new Error('Unknown shape');
}