import { PointShape, Shape } from '../shapes/base_shapes';
import { Text } from '../shapes/text';
import { Canvas, ShapeRenderer } from './renderer';
import { PointShapeRenderer } from './shape';
import { TextRenderer } from './text';


export function getRenderer(canvas: Canvas, shape: Shape): ShapeRenderer<Shape> {
    if (shape instanceof PointShape) {
        return new PointShapeRenderer(canvas);
    } else if (shape instanceof Text) {
        return new TextRenderer(canvas);
    }

    throw new Error('Unknown shape');
}