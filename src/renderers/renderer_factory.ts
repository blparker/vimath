import { CircleArc } from '../shapes/primitives/circle_arc';
import { PointShape } from '../shapes/primitives/point_shape';
import { Shape } from '../shapes/shape';
import { isSvgShape } from '../shapes/brace';
import { Text } from '../shapes/primitives/text';
import { ComposableRenderer } from './composable_renderer';
import { Canvas, ShapeRenderer } from './renderer';
import { CircleRenderer, PointShapeRenderer, SvgShapeRenderer } from './shape';
import { TextRenderer } from './text';


export function getRenderer(canvas: Canvas, shape: Shape): ShapeRenderer<Shape> {
    if (shape instanceof PointShape) {
        return new PointShapeRenderer(canvas);
    } else if (shape instanceof Text) {
        return new TextRenderer(canvas);
    } else if (shape instanceof CircleArc) {
        return new CircleRenderer(canvas);
    } else if (isSvgShape(shape)) {
        return new SvgShapeRenderer(canvas);
    } else if ('children' in shape) {
        // Composable
        return new ComposableRenderer(canvas, getRenderer);
    }

    throw new Error('Unknown shape');
}