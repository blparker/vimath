import { Point, HAlign, X_TICKS, Y_TICKS, DEFAULT_PADDING, FONT_STACK, VAlign, Config } from '../base';
import { Colors, RGBA, rgbaToString } from '../colors';
import { Shape, PointShape } from '../shapes/base_shapes.js';
import * as math from '../math.js';
import { Text, TextBaseline } from '../shapes/text';
import { TextRenderer } from './text';
import { MouseDown, MouseMove, MouseOut, MouseUp, MouseEventType } from '../animations/interactivity';


type ArcArgs = { center: Point; radius: number; angle: number; lineWidth: number; lineColor: RGBA, color: RGBA; };
type LineArgs = { from: Point; to: Point; lineWidth: number; color: RGBA; };
type PathArgs = { points: Point[]; lineWidth: number; lineColor: RGBA; color: RGBA; closePath: boolean; smooth: boolean; };
type TextArgs = { text: string; x: number; y: number; size: number; color: RGBA; align: HAlign; baseline: TextBaseline; vertical?: boolean };
type ImageArgs = { image: HTMLImageElement; x: number; y: number; align?: HAlign; verticalAlign?: VAlign };


export interface Canvas {
    arc({ center, radius, angle, lineWidth, lineColor, color }: ArcArgs): void;
    line({ from, to, lineWidth, color }: LineArgs): void;
    path({ points, lineWidth, lineColor, color, closePath, smooth }: PathArgs): void;
    text({ text, x, y, size, color, align, baseline, vertical }: TextArgs): void;
    image({ image, x, y, align, verticalAlign }: ImageArgs): void;
    clear(): void
    onMouseMove(listener: (pt: Point) => void): void;
    onMouseMove(listener: (pt: Point) => void): void;
    onMouseUp(listener: (pt: Point) => void): void;
    onMouseOut(listener: () => void): void;
}

// const textBaselineToCanvas: Record<TextBaseline, CanvasTextBaseline> = {
//     'top': 'top',
//     'middle': 'alphabetic',
//     'bottom': 'bottom',
// } as const;




export class HtmlCanvas implements Canvas {
    private readonly canvas: HTMLCanvasElement;
    private readonly mouseListeners: Record<MouseEventType, ((pt: Point) => void)[]> = {
        'mousedown': [],
        'mouseup': [],
        'mousemove': [],
        'mouseout': [],
    };
    public readonly ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Cannot get 2D context from canvas');
        }

        this.ctx = ctx;

        canvas.addEventListener('mousedown', this.handleMouseEvent.bind(this));
        canvas.addEventListener('mouseup', this.handleMouseEvent.bind(this));
        canvas.addEventListener('mousemove', this.handleMouseEvent.bind(this));
        canvas.addEventListener('mouseout', this.handleMouseEvent.bind(this));
    }

    handleMouseEvent(e: MouseEvent): void {
        if (Object.keys(this.mouseListeners).includes(e.type)) {
            for (const listener of this.mouseListeners[e.type as MouseEventType]) {
                listener(this.untranslate([e.offsetX, e.offsetY]));
            }
        }
    }

    arc({ center, radius, angle, lineWidth, lineColor, color }: ArcArgs): void {
        this.ctx.save();

        this.ctx.strokeStyle = rgbaToString(lineColor);
        this.ctx.lineWidth = lineWidth;
        this.ctx.fillStyle = rgbaToString(color);

        const path = new Path2D();

        const tRadius = Math.abs(this.translate([0, 0])[0] - this.translate([radius, 0])[0]);
        path.arc(...math.floor(this.translate(center)) as Point, tRadius, 0, angle)

        this.ctx.fill(path)
        this.ctx.stroke(path);

        this.ctx.restore();
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

    path({ points, lineWidth, lineColor, color, closePath, smooth }: PathArgs): void {
        if (points.length <= 1) {
            throw new Error('Path contains too few points. Expects a path consisting of at least 2 points');
        } else if (points.length === 2) {
            this.line({ from: points[0], to: points[1], lineWidth, color: lineColor });
            return;
        }

        this.ctx.save();
        this.ctx.strokeStyle = rgbaToString(lineColor);
        this.ctx.lineWidth = lineWidth;
        this.ctx.fillStyle = rgbaToString(color);

        const path = new Path2D();
        path.moveTo(...math.floor(this.translate(points[0])) as Point);

        if (smooth) {
            this.smoothPath(points, path);
        } else {
            for (let i = 1; i < points.length; i++) {
                const pt = points[i];
                path.lineTo(...math.floor(this.translate(pt)) as Point);
            }
        }

        if (closePath) {
            path.closePath();
        }

        this.ctx.fill(path);
        this.ctx.stroke(path);

        this.ctx.restore();
    }

    onMouseMove(listener: (pt: Point) => void): void {
        // this.mouseMoveListeners.push(listener);
        this.mouseListeners['mousemove'].push(listener);
    }

    onMouseDown(listener: (pt: Point) => void): void {
        this.mouseListeners['mousedown'].push(listener);
    }

    onMouseUp(listener: (pt: Point) => void): void {
        this.mouseListeners['mouseup'].push(listener);
    }

    onMouseOut(listener: () => void): void {
        this.mouseListeners['mouseout'].push(listener);
    }

    // https://stackoverflow.com/a/15528789/301302
    private smoothPath(points: Point[], path: Path2D) {
        const tension = 0.5;
        const isClosed = false;
        const numSegments = 8;
        const curvePoints: Point[] = [];

        const pts = structuredClone(points);
        if (isClosed) {
            pts.unshift(points[points.length - 1]);
            pts.unshift(points[points.length - 1]);
            pts.push(points[0]);
        } else {
            pts.unshift(points[0]);
            pts.push(points[points.length - 1]);
        }

        for (let i = 1; i < pts.length - 2; i++) {
            for (let t = 0; t < numSegments; t++) {
                const t1x = (pts[i + 1][0] - pts[i - 1][0]) * tension;
                const t2x = (pts[i + 2][0] - pts[i][0]) * tension;

                const t1y = (pts[i + 1][1] - pts[i - 1][1]) * tension;
                const t2y = (pts[i + 2][1] - pts[i][1]) * tension;

                const st = t / numSegments;

                const c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
                const c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
                const c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
                const c4 = Math.pow(st, 3) - Math.pow(st, 2);

                const x = c1 * pts[i][0] + c2 * pts[i + 1][0] + c3 * t1x + c4 * t2x;
                const y = c1 * pts[i][1] + c2 * pts[i + 1][1] + c3 * t1y + c4 * t2y;

                curvePoints.push([x, y]);
            }
        }

        path.moveTo(...this.translate(curvePoints[0]));

        for (let i = 1; i < curvePoints.length; i++) {
            const point = curvePoints[i];
            path.lineTo(...this.translate(point));
        }

        return path;
    }

    text({ text, x, y, size, color, align, baseline, vertical = false }: TextArgs): void {
        this.ctx.save();

        this.ctx.font = `${size}px ${FONT_STACK.join(', ')}`;
        this.ctx.fillStyle = rgbaToString(color);
        this.ctx.textAlign = align;
        // this.ctx.textBaseline = textBaselineToCanvas[baseline];
        this.ctx.textBaseline = baseline;

        if (vertical) {
            this.ctx.rotate(-Math.PI / 2);
            [x, y] = [-y, x];
        }

        this.ctx.fillText(text, ...this.translate([x, y]));

        // const m = this.ctx.measureText(text);
        // this.ctx.strokeRect(...this.translate([x, y]), m.width, m.actualBoundingBoxAscent + m.actualBoundingBoxDescent);
        this.ctx.restore();
    }

    image({ image, x, y, align = 'center', verticalAlign = 'middle' }: ImageArgs): void {
        let [tX, tY] = this.translate([x, y]);

        if (align == 'center') {
            tX -= image.naturalWidth / 2;
        } else if (align == 'right') {
            tX -= image.naturalWidth;
        }

        if (verticalAlign == 'middle') {
            tY -= image.naturalHeight / 2;
        } else if (verticalAlign == 'bottom') {
            tY -= image.naturalHeight;
        }

        this.ctx.drawImage(image, tX, tY);
        // this.ctx.strokeRect(tX, tY, image.naturalWidth, image.naturalHeight)
    }

    clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.fillStyle = rgbaToString(Colors.white());
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
        this.ctx.restore();
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

    private untranslate(point: Point): Point {
        const padding = Config.canvasPadding;

        const [xTicks, yTicks] = [
            (this.canvas.width - 2 * padding) / X_TICKS,
            (this.canvas.height - 2 * padding) / Y_TICKS
        ];

        const [oX, oY] = [X_TICKS / 2 * xTicks, Y_TICKS / 2 * yTicks];

        return [(point[0] - oX - padding) / xTicks, -(point[1] - oY - padding) / yTicks];
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
    render(shape: T): Promise<ShapeRenderer<T>>;
}


export abstract class NativeRenderer<T extends Shape> implements ShapeRenderer<T> {
    constructor(protected canvas: Canvas) {}

    abstract render(shape: T): Promise<ShapeRenderer<T>>;
}
