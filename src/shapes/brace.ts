import { Shift, Point, Prettify } from '../base';
import { Shape, StyleArgs, Styleable } from './shape';
import * as math from '../math';
import { RGBA } from '../colors';


export type SvgCommand = [string, ...number[]];

export interface SvgShape extends Shape, Styleable {
    svgPath(): SvgCommand[];
}


export function isSvgShape(o: any): o is SvgShape {
    return 'svgPath' in o && typeof o.svgPath === 'function';
}


type BraceArgs = Prettify<({ shape: Shape } | { p1: Point; p2: Point}) & { direction: Point } & StyleArgs>;


export class Brace implements SvgShape {
    private shape?: Shape;
    private p1?: Point;
    private p2?: Point;
    private direction: Point;
    private _lineWidth: number;
    angle: number = 0;
    currentScale: number = 1;

    // constructor({ shape, p1, p2, direction, ...styleArgs }: BraceArgs) {
    constructor(args: BraceArgs) {
        if ('shape' in args) {
            this.shape = args.shape;
        } else {
            this.p1 = args.p1;
            this.p2 = args.p2;
        }

        // this.shape = shape;
        // this.direction = direction;
        this.direction = args.direction;
        this._lineWidth = args.lineWidth ?? 1;
    }

    color(): RGBA {
        throw new Error('Method not implemented.');
    }

    changeColor(newColor: RGBA): Styleable {
        throw new Error('Method not implemented.');
    }

    lineColor(): RGBA {
        throw new Error('Method not implemented.');
    }

    lineWidth(): number {
        return this._lineWidth;
    }

    changeLineColor(newColor: RGBA): Styleable {
        throw new Error('Method not implemented.');
    }

    shift(...shifts: Shift[]): Shape {
        throw new Error("Method not implemented.");
    }

    moveTo(point: Point): Shape {
        throw new Error("Method not implemented.");
    }

    scale(factor: number): Shape {
        throw new Error("Method not implemented.");
    }

    rotate(angle: number): Shape {
        throw new Error("Method not implemented.");
    }

    nextTo(shape: Shape | Point, direction?: Point | undefined): Shape {
        throw new Error("Method not implemented.");
    }

    center(): Point {
        if (this.shape) {
            return this.shape.center();
        } else if (this.p1 && this.p2) {
            return [(this.p1[0] + this.p2[0]) / 2, (this.p1[1] + this.p2[1]) / 2] as Point;
        } else {
            throw new Error('Need either shape or points');
        }
    }

    moveCenter(newCenter: Point): Shape {
        throw new Error("Method not implemented.");
    }

    top(): Point {
        throw new Error("Method not implemented.");
    }

    bottom(): Point {
        throw new Error("Method not implemented.");
    }

    left(): Point {
        throw new Error("Method not implemented.");
    }

    right(): Point {
        throw new Error("Method not implemented.");
    }

    width(): number {
        if (this.shape) {
            return this.shape.width();
        } else if (this.p1 && this.p2) {
            return this.p2[0] - this.p1[0] + 0.6;
        } else {
            throw new Error('Need either shape or points');
        }
    }

    height(): number {
        if (this.shape) {
            return this.shape.height();
        } else if (this.p1 && this.p2) {
            return this.p2[1] - this.p1[1] + 0.6;
        } else {
            throw new Error('Need either shape or points');
        }
    }

    copy(): Shape {
        throw new Error("Method not implemented.");
    }

    private getPoints(): [Point, Point] {
        const offset = 0.1;
        let [dX, dY] = this.direction;

        if (this.shape) {
            const lX = this.shape.left()[0];
            const rX = this.shape.right()[0];
            // const bY = this.shape.bottom()[1] + 0.1;
            const bY = this.shape.bottom()[1];
            const tY = this.shape.top()[1];

            let [x1, y1] = [0, 0];
            let [x2, y2] = [0, 0];

            if (dX < 0) {
                x1 = x2 = lX - offset;
            } else if (dX > 0) {
                x1 = x2 = rX + offset;
            } else {
                x1 = lX;
                x2 = rX;
            }

            if (dY < 0) {
                y1 = y2 = bY - offset;
            } else if (dY > 0) {
                y1 = y2 = tY + offset;
            } else {
                y1 = bY;
                y2 = tY;
            }

            return [[x1, y1], [x2, y2]];
        } else if (this.p1 && this.p2) {
            let [p1x, p1y] = this.p1;
            let [p2x, p2y] = this.p2;

            if (dY < 0) {
                p1y -= offset;
                p2y -= offset;
            } else if (dY > 0) {
                p1y += offset;
                p2y += offset;
            }

            if (dX < 0) {
                p1x -= offset;
                p2x -= offset;
            } else if (dX > 0) {
                p1x += offset;
                p2x += offset;
            }

            return [[p1x, p1y], [p2x, p2y]];

            // if (dY < 0) {
            //     return [math.subtract(this.p1, [0, offset]) as Point, math.subtract(this.p2, [0, offset]) as Point];
            // } else if (dY > 0) {
            //     return [math.add(this.p1, [0, offset]) as Point, math.add(this.p2, [0, offset]) as Point];
            // } else {
            //     return [this.p1, this.p2];
            // }
        } else {
            throw new Error('Need either shape or points');
        }
    }

    svgPath(): SvgCommand[] {
        let [dX, dY] = this.direction;
        let [[x1, y1], [x2, y2]] = this.getPoints();

        const q = 0.6;
        let w = 0.4;
        if (dY < 0) {
            w *= -1;
        }

        const mX = (x1 + x2) / 2;
        const mY = (y1 + y2) / 2;

        const _tx1 = x1 - mX;
        const _ty1 = y1 - mY;
        // this.angle = Math.PI;

        x1 = mX + (_tx1 * Math.cos(this.angle) - _ty1 * Math.sin(this.angle));
        y1 = mY + (_tx1 * Math.sin(this.angle) + _ty1 * Math.cos(this.angle));

        const _tx2 = x2 - mX;
        const _ty2 = y2 - mY;

        x2 = mX + (_tx2 * Math.cos(this.angle) - _ty2 * Math.sin(this.angle));
        y2 = mY + (_tx2 * Math.sin(this.angle) + _ty2 * Math.cos(this.angle));

        // Calculate unit vector
        let dx = x1 - x2;
        let dy = y1 - y2;
        const len = Math.sqrt(dx * dx + dy * dy);
        dx = dx / len;
        dy = dy / len;

        // Calculate control points of path,
        const qx1 = x1 + q * w * dy;
        const qy1 = y1 - q * w * dx;
        const qx2 = (x1 - 0.25 * len * dx) + (1 - q) * w * dy;
        const qy2 = (y1 - 0.25 * len * dy) - (1 - q) * w * dx;
        const tx1 = (x1 - 0.5 * len * dx) + w * dy;
        const ty1 = (y1 - 0.5 * len * dy) - w * dx;
        const qx3 = x2 + q * w * dy;
        const qy3 = y2 - q * w * dx;
        const qx4 = (x1 - 0.75 * len * dx) + (1 - q) * w * dy;
        const qy4 = (y1 - 0.75 * len * dy) - (1 - q) * w * dx;

        return [
            ['M', x1, y1],
            ['Q', qx1, qy1, qx2, qy2],
            ['T', tx1, ty1],
            ['M', x2, y2],
            ['Q', qx3, qy3, qx4, qy4],
            ['T', tx1, ty1],
        ];
    }
}
