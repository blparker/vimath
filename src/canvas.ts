import { Colors, rgbaToString } from '@/colors';
import { config } from '@/config';
import { Shape } from '@/shapes/shape';
import { PointShape } from '@/shapes/primitives/point_shape';
import { ComposedShape } from '@/shapes/composed/composed_shape';
import { Text } from '@/shapes/primitives/text';
import { TexGenerator } from '@/tex_generator';
import { Translation } from '@/translation';
import math from '@/math';


type Pixels = number;

type MouseState = {
    absoluteX: number;
    absoluteY: number;
    x: number;
    y: number;
    canvasX: number;
    canvasY: number;
}


interface Canvas {
    renderShape(shape: Shape): Promise<void>;

    connectedPath(path: PointShape): void;
    text(text: Text): Promise<void>;

    clear(): void;

    width(): Pixels;
    height(): Pixels;

    onMouseMove(cb: (state: MouseState) => void): void;
    onClick(cb: (state: MouseState) => void): void;
    onResize(cb: () => void): void;
}


function isCanvas(o: any): o is Canvas {
    return 'renderShape' in o && typeof o.renderShape === 'function' &&
           'clear' in o && typeof o.clear === 'function';
}


class HtmlCanvas implements Canvas {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private t: Translation;

    constructor(canvas?: HTMLCanvasElement | string) {
        this._canvas = HtmlCanvas.getCanvas(canvas);
        this._ctx = this._canvas.getContext('2d')!;
        this.t = new Translation(this);

        this._initializeEventListeners();
    }

    async renderShape(shape: Shape) {
        if (shape instanceof ComposedShape) {
            for (const s of shape.composedShapes()) {
                this.renderShape(s);
            }
        } else if (shape instanceof PointShape) {
            this.connectedPath(shape);
        } else if (shape instanceof Text) {
            await this.text(shape);
        } else {
            throw new Error(`Unsupported shape ${shape}`);
        }
    }

    connectedPath(shape: PointShape): void {
        this._ctx.save();
        this.setContextStyles(shape);

        const points = shape.points();
        const p = new Path2D();

        for (let i = 0; i < points.length; i++) {
            const pt = points[i];

            if (pt[0] !== null) {
                p.moveTo(...this.t.translateRelative(pt[0]));
            }

            p.bezierCurveTo(...this.t.translateRelative(pt[1]), ...this.t.translateRelative(pt[2]), ...this.t.translateRelative(pt[3]));
        }

        const first = points[0];
        const last = points[points.length - 1];

        const start = first[0] ?? first[1];
        const end = last[3];

        if (math.approxEqual(start, end)) {
            p.closePath();
        }

        const styles = shape.styles();

        if (styles.color) {
            this._ctx.fill(p);
        }

        if (styles.lineColor) {
            this._ctx.stroke(p);
        }

        this._ctx.restore();
    }

    /*private smoothPath(shape: PointShape): void {
        this._ctx.save();
        this.setContextStyles(shape);

        const points = shape.points();
        const p = new Path2D();

        p.moveTo(...this.t.translateRelative(points[0]));
        if (points.length === 2) {
            p.lineTo(...this.t.translateRelative(points[1]));
        } else {
            for (let i = 1; i < points.length - 1; i++) {
                let midpoint = [(points[i][0] + points[i + 1][0]) / 2, (points[i][1] + points[i + 1][1]) / 2] as Point;
                p.quadraticCurveTo(...this.t.translateRelative(points[i]), ...this.t.translateRelative(midpoint));
            }

            p.lineTo(...this.t.translateRelative(points[points.length - 1]));
        }

        this._ctx.stroke(p);

        this._ctx.restore();
    }*/

    async text(text: Text) {
        const showBoundingBox = false;

        let [xDraw, yDraw] = text.position();
        const [w, h] = [text.width(), text.height()];

        if (text.align() === 'center') {
            xDraw -= w / 2;
        } else if (text.align() === 'right') {
            xDraw -= w;
        }

        if (text.baseline() === 'middle') {
            yDraw += h / 2;
        } else if (text.baseline() === 'bottom') {
            yDraw += h;
        }

        this._ctx.save();

        if (text.isTex()) {
            const img = await TexGenerator.generate({ text: text.text(), size: text.fontSize(), color: text.styles().color, scale: text.currentScale() });

            this._ctx.drawImage(img, ...this.t.translateRelative([xDraw, yDraw]));
        } else {
            const styles = text.styles();

            this._ctx.font = `${text.fontSize() * text.currentScale()}px ${text.fontFamily()}`;
            this._ctx.textBaseline = 'top';
            this._ctx.textAlign = 'left';
            this._ctx.fillStyle = rgbaToString(styles.color ?? styles.lineColor ?? Colors.black() )

            this._ctx.fillText(text.text(), ...this.t.translateRelative([xDraw, yDraw]));
        }

        this._ctx.restore();

        if (showBoundingBox) {
            this._ctx.save();
            const bb = new Path2D();
            bb.rect(...this.t.translateRelative([text.left()[0], text.top()[1]]), this.t.translateRelWidth(w), this.t.translateRelHeight(h));
            this._ctx.stroke(bb);
            this._ctx.restore();
        }
    }

    clear(): void {
        this._ctx.fillStyle = 'white';
        this._ctx.fillRect(0, 0, this.width(), this.height());
    }

    width(): Pixels {
        return this._canvas.width;
    }

    height(): Pixels {
        return this._canvas.height;
    }

    private _mouseMoveListeners: ((state: MouseState) => void)[] = [];
    private _clickListeners: ((state: MouseState) => void)[] = [];
    private _resizeListeners: (() => void)[] = [];

    onMouseMove(cb: (state: MouseState) => void): void {
        this._mouseMoveListeners.push(cb);
    }

    onClick(cb: (state: MouseState) => void): void {
        this._clickListeners.push(cb);
    }

    onResize(cb: () => void): void {
        this._resizeListeners.push(cb);
    }

    private _initializeEventListeners() {
        const collectMouseState = (e: MouseEvent) => {
            const absX = e.offsetX;
            const absY = e.offsetY;
            const [relX, relY] = this.t.translateAbsolute(absX, absY);

            return {
                absoluteX: absX,
                absoluteY: absY,
                x: relX,
                y: relY,
                canvasX: e.offsetX,
                canvasY: e.offsetY,
            };
        }

        this._canvas.addEventListener('mousemove', e => {
            const state = collectMouseState(e);
            this._mouseMoveListeners.forEach(cb => cb(state));
        });

        this._canvas.addEventListener('click', e => {
            const state = collectMouseState(e);
            this._clickListeners.forEach(cb => cb(state));
        });

        const canvasRatio = this._canvas.clientHeight / this._canvas.clientWidth;
        const initialWidth = this._canvas.clientWidth;

        window.addEventListener('resize', e => {
            if (this._canvas.parentElement) {
                const parent = this._canvas.parentElement!;

                if (parent.clientWidth < this._canvas.clientWidth || parent.clientWidth < initialWidth) {
                    this._canvas.width = parent.clientWidth;
                    this._canvas.height = parent.clientWidth * canvasRatio;
                    config.canvasWidth = parent.clientWidth;
                    config.canvasHeight = parent.clientWidth * canvasRatio;

                    this._resizeListeners.forEach(cb => cb());
                } else if (parent.clientWidth > initialWidth && this._canvas.width !== initialWidth) {
                    this._canvas.width = initialWidth;
                    this._canvas.height = initialWidth * canvasRatio;
                    config.canvasWidth = parent.clientWidth;
                    config.canvasHeight = parent.clientWidth * canvasRatio;

                    this._resizeListeners.forEach(cb => cb());
                }
            }
        });
    }

    private static getCanvas(canvas?: HTMLCanvasElement | string): HTMLCanvasElement {
        if (canvas === undefined) {
            const canvas = document.createElement('canvas');
            canvas.width = config.canvasWidth;
            canvas.height = config.canvasHeight;
            document.body.appendChild(canvas);

            return canvas;
        } else if (typeof canvas === 'string') {
            const el = document.querySelector(canvas);

            if (el instanceof HTMLCanvasElement) {
                return el;
            } else {
                throw new Error(`Element ${canvas} is not a HTMLCanvasElement`);
            }
        } else {
            return canvas;
        }
    }

    private setContextStyles(shape: Shape): void {
        // const styles = isShape(shape) ? shape.styles() : shape;
        const styles = shape.styles();

        if (styles.color) {
            this._ctx.fillStyle = rgbaToString(styles.color);
        }

        if (styles.lineColor) {
            this._ctx.strokeStyle = rgbaToString(styles.lineColor);
        }

        if (styles.lineWidth) {
            this._ctx.lineWidth = styles.lineWidth;
        }

        if (styles.lineCap) {
            this._ctx.lineCap = styles.lineCap;
        }

        if (styles.lineStyle === 'dashed') {
            this._ctx.setLineDash([5, 5]);
        } else if (styles.lineStyle === 'dotted') {
            this._ctx.setLineDash([1, 5]);
        } else if (styles.lineStyle === 'solid') {
            this._ctx.setLineDash([]);
        } else if (styles.lineStyle === 'dashedsmall') {
            this._ctx.setLineDash([3, 2]);
        }
    }

    // private debugDot(x: number, y: number, color: RGBA = Colors.black()) {
    //     this._ctx.save();
    //     const cd = new Path2D();
    //     cd.arc(x, y, 5, 0, 2 * Math.PI);
    //     this._ctx.fillStyle = rgbaToString(color);
    //     this._ctx.fill(cd);
    //     this._ctx.restore();
    // }
}


export { HtmlCanvas, isCanvas, type Canvas };

