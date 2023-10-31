import { Composable, ComposableShape } from "../shapes/composed_shape";
import { Point } from '../base';
import { Circle, CircleArc, PointShape, Shape } from '../shapes/base_shapes';
import { Canvas, NativeRenderer, ShapeRenderer } from './renderer';

export class ComposableRenderer extends NativeRenderer<ComposableShape> {
    constructor(canvas: Canvas, private getRenderer: (canvas: Canvas, shape: Shape) => ShapeRenderer<Shape>) {
        super(canvas);
    }

    async render(shape: ComposableShape): Promise<ShapeRenderer<ComposableShape>> {
        for (const child of shape.composedShapes()) {
            this.getRenderer(this.canvas, child).render(child);
        }

        return this;
    }
}

