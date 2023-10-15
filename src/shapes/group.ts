import { OFFSET_GUTTER, Point, RIGHT, Shift } from '../base';
import { Shape } from './base_shapes';
import * as math from '../math';


export class Group implements Shape {
    private _angle: number = 0;
    private _currentScale: number = 1;
    private _els: Shape[] = [];
    // private cX: number;
    // private cY: number;
    // private radius: number;

    // constructor({ x = 0, y = 0, radius = 1, ...styleArgs }: { x?: number, y?: number, radius?: number } & Prettify<StyleArgs> = {}) {
    //     this.cX = x;
    //     this.cY = y;
    // }
    constructor(...els: Shape[]) {
        this.add(...els);
    }

    add(...els: Shape[]): Shape {
        els.forEach(e => this._els.push(e));
        return this;
    }

    shift(...shifts: Shift[]): Shape {
        for (const el of this._els) {
            el.shift(...shifts);
        }

        return this;
    }

    moveTo(point: Point): Shape {
        return this;
    }

    scale(factor: number): Shape {
        this._currentScale = factor;
        return this;
    }

    rotate(angle: number): Shape {
        this._angle = angle;
        return this;
    }

    nextTo(shape: Shape, direction: Point = RIGHT()): Shape {
        return this;
    }

    center(): Point {
        const avgX = this.top()[0];
        const avgY = this.left()[1];

        return [avgX, avgY];
    }

    moveCenter(newCenter: Point): Shape {
        return this;
    }

    top(): Point {
        const tops = this._els.map(e => e.top());
        const avgX = math.sum(tops, 0) / tops.length;

        return [avgX, math.max(tops, 1)];
    }

    bottom(): Point {
        const bottoms = this._els.map(e => e.bottom());
        const avgX = math.sum(bottoms, 0) / bottoms.length;

        return [avgX, math.min(bottoms, 1)];
    }

    left(): Point {
        const lefts = this._els.map(e => e.left());
        const avgY = math.sum(lefts, 1) / lefts.length;

        return [math.min(lefts, 0), avgY];
    }

    right(): Point {
        const rights = this._els.map(e => e.right());
        const avgY = math.sum(rights, 1) / rights.length;

        return [math.max(rights, 0), avgY];
    }

    width(): number {
        return 0;
    }

    height(): number {
        return 0;
    }

    get angle() {
        return this._angle;
    }

    get currentScale() {
        return this._currentScale;
    }
}