import { ComposableShape } from '@/shapes/composable_shape';
import { Shape } from '@/shapes/shape';
import { Canvas, NativeRenderer, ShapeRenderer } from '@/renderers/renderer';


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

