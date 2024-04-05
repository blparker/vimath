import { Line } from '@/shapes/derived/line';
import { Translation } from '@/translation';
import { config } from '@/config';
import { Shape } from '@/shapes';
import { rgbaToString } from '@/colors';

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
    renderShape(shape: Shape): void;

    line(line: Line): void;

    clear(): void;
    addInteraction(interation: Interaction): void;

    width(): Pixels;
    height(): Pixels;

    onMouseMove(cb: (state: MouseState) => void): void;
    onClick(cb: (state: MouseState) => void): void;
}


function isCanvas(o: any): o is Canvas {
    return 'renderShape' in o && typeof o.renderShape === 'function' &&
           'clear' in o && typeof o.clear === 'function';
}


// type MouseState = {
//     x: number;
//     y: number;
//     leftPressed: boolean;
// }


interface Interaction {

}

// abstract class MouseInteraction implements Interaction {
//     constructor() {
//         // canvas.addEventListener('mousemove', (e) => {
//         //     this.update({
//         //         x: e.clientX,
//         //         y: e.clientY,
//         //         leftPressed: e.buttons === 1,
//         //     });
//         // }
//     }

//     register(canvas: HTMLCanvasElement): void {
//         canvas.addEventListener('mousemove', (e) => {
//             this.update({
//                 x: e.clientX,
//                 y: e.clientY,
//                 leftPressed: e.buttons === 1,
//             });
//         });
//     }

//     abstract update(state: MouseState): void;
// }


// class MouseMoveInteraction extends MouseInteraction {
//     update(state: MouseState): void {
        
//     }
// }


// class InteractionManager {
//     private _shapes: Shape[] = [];

//     constructor(canvas: HTMLCanvasElement) {
//         canvas.addEventListener('mousemove', (e) => this.checkInteractions);
//     }

//     registerShape(shape: Shape): void {
//         this._shapes.push(shape);
//     }

//     private checkInteractions(e: MouseEvent): void {
//         console.log(e)
//     }
// }



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

    renderShape(shape: Shape): void {
        if (shape instanceof Line) {
            this.line(shape);
        } else {
            throw new Error(`Unsupported shape ${shape}`);
        }
    }

    line(line: Line): void {
        this._ctx.save();
        this.setContextStyles(line);

        const p = new Path2D();
        const [from, to] = line.points();
        p.moveTo(...this.t.translateRelative(from));
        p.lineTo(...this.t.translateRelative(to));
        this._ctx.stroke(p);

        const p2 = new Path2D();
        p2.arc(this._canvas.width / 2, this._canvas.height / 2, 5, 0, 2 * Math.PI);
        this._ctx.fill(p2);

        this._ctx.restore();
    }

    clear(): void {
        this._ctx.fillStyle = 'white';
        this._ctx.fillRect(0, 0, this.width(), this.height());
    }

    addInteraction(interation: Interaction): void {
        
    }

    width(): Pixels {
        return this._canvas.width;
    }

    height(): Pixels {
        return this._canvas.height;
    }

    private _mouseMoveListeners: ((state: MouseState) => void)[] = [];
    private _clickListeners: ((state: MouseState) => void)[] = [];

    onMouseMove(cb: (state: MouseState) => void): void {
        this._mouseMoveListeners.push(cb);
    }

    onClick(cb: (state: MouseState) => void): void {
        this._clickListeners.push(cb);
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
}


export { type Canvas, isCanvas, HtmlCanvas, type Interaction };
