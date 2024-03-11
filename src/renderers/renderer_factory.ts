import { CircleArc } from '@/shapes/primitives/circle_arc';
import { PointShape } from '@/shapes/primitives/point_shape';
import { Shape } from '@/shapes/shape';
import { isSvgShape } from '@/shapes/brace';
import { Text } from '@/shapes/primitives/text';
import { ComposableRenderer } from '@/renderers/composable_renderer';
import { Canvas, ShapeRenderer } from '@/renderers/renderer';
import { CircleRenderer, PointShapeRenderer, SvgShapeRenderer } from '@/renderers/shape';
import { TextRenderer } from '@/renderers/text';


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
