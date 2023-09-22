import { Point, HAlign, X_TICKS, Y_TICKS, DEFAULT_PADDING, FONT_STACK } from "../base";
import { RGBA, rgbaToString } from "../colors";
import { Shape, PointShape } from "../shapes/base_shapes.js";
import * as math from '../math.js';
import { Text, TextBaseline } from "../shapes/text";


type LineArgs = { from: Point; to: Point; lineWidth: number; color: RGBA; };
type TextArgs = { text: string, x: number, y: number, size: number, color: RGBA, align: HAlign, baseline: TextBaseline, vertical?: boolean };
type ImageArgs = { image: HTMLImageElement, x: number, y: number, align: HAlign };

export interface Canvas {
    line({ from, to, lineWidth, color }: LineArgs): void;
    text({ text, x, y, size, color, align, baseline, vertical = false }: TextArgs): void;
    image({ image, x, y, align = 'center' }: ImageArgs): void;
}


export class HtmlCanvas implements Canvas {
    private readonly canvas: HTMLCanvasElement;
    public readonly ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Cannot get 2D context from canvas');
        }

        this.ctx = ctx;
    }

    line({ from, to, lineWidth, color }: LineArgs): void {
        this.ctx.save();

        this.ctx.strokeStyle = rgbaToString(color);
        this.ctx.lineWidth = lineWidth;

        const path = new Path2D();
        path.moveTo(...math.floor(this.translate(from)) as Point);
        path.lineTo(...math.floor(this.translate(to)) as Point);

        this.ctx.stroke(path);

        this.ctx.restore();
    }

    text({ text, x, y, size, color, align, baseline, vertical = false }: TextArgs): void {
        this.ctx.save();

        this.ctx.font = `${size}px ${FONT_STACK.join(', ')}`;
        this.ctx.fillStyle = rgbaToString(color);
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseline;

        if (vertical) {
            this.ctx.rotate(-Math.PI / 2);
            [x, y] = [-y, x];
        }

        this.ctx.fillText(text, x, y);

        this.ctx.restore();
    }

    image({ image, x, y, align = 'center' }: ImageArgs): void {
        if (align == 'center') {
            x -= image.naturalWidth / 2;
            y -= image.naturalHeight / 2;
        }

        this.ctx.drawImage(image, x, y);
    }

    private translate(point: Point): Point {
        const padding = 20;

        const [xTicks, yTicks] = [
            (this.canvas.width - 2 * padding) / X_TICKS,
            (this.canvas.height - 2 * padding) / Y_TICKS
        ];

        const [oX, oY] = [X_TICKS / 2 * xTicks, Y_TICKS / 2 * yTicks];
        return [padding + oX + point[0] * xTicks, padding + oY - point[1] * yTicks];
    }

    public get xIncrements(): number {
        return (this.canvas.width - 2 * DEFAULT_PADDING) / X_TICKS;
    }

    public get yIncrements(): number {
        return (this.canvas.height - 2 * DEFAULT_PADDING) / Y_TICKS;
    }
}


export interface ShapeRenderer<T extends Shape> {
    // readonly canvas: Canvas;
    render(shape: T): ShapeRenderer<T>;
}


abstract class NativeRenderer<T extends Shape> implements ShapeRenderer<T> {
    constructor(protected canvas: Canvas) {}

    abstract render(shape: T): ShapeRenderer<T>;
}


export class PointShapeRenderer extends NativeRenderer<PointShape> {
    render(shape: PointShape): ShapeRenderer<PointShape> {
        const points = shape.computedPoints();

        if (points.length <= 1) {
            throw new Error('Two or more points required to render PointShape');
        }

        const line = (p1: Point, p2: Point) => this.canvas.line({ from: p1, to: p2, lineWidth: 2, color: shape.lineColor() });

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


export class TextRenderer extends NativeRenderer<Text> {
    render(shape: Text): ShapeRenderer<Text> {
        const [x, y] = shape.center()
        this.canvas.text({
            text: shape.text,
            x,
            y,
            size: shape.size,
            color: shape.color,
            align: shape.align,
            baseline: shape.baseline,
            vertical: shape.vertical
        });

        return this;
    }
}
