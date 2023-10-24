import { Composable } from "../shapes/composed_shape";
import { Point } from '../base';
import { Circle, CircleArc, PointShape, Shape } from '../shapes/base_shapes';
import { Canvas, NativeRenderer, ShapeRenderer } from './renderer';

export class ComposableRenderer extends NativeRenderer<Composable> {
    constructor(canvas: Canvas, private getRenderer: (canvas: Canvas, shape: Shape) => ShapeRenderer<Shape>) {
        super(canvas);
    }

    async render(shape: Composable): Promise<ShapeRenderer<Composable>> {
        for (const child of shape.children()) {
            this.getRenderer(this.canvas, child).render(child);
        }

        return this;
    }
}

