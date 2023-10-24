import { OFFSET_GUTTER, Point, RIGHT, Shift } from '../base';
import { Shape } from './base_shapes';
import * as math from '../math';
import { Composable } from './composed_shape';


export class Group implements Shape, Composable {
    private _angle: number = 0;
    private _currentScale: number = 1;
    private _els: Shape[] = [];

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
        return this.moveCenter(point);
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
        let offsetX = 0, offsetY = 0;
        let [dX, dY] = direction ?? RIGHT();
        const offsetGutter = OFFSET_GUTTER;

        let newX = 0, newY = 0;

        if (dX > 0) {
            // Put to the right
            newX = shape.right()[0] + OFFSET_GUTTER + this.width() / 2;
        } else if (dX < 0) {
            // Put to the left
            newX = shape.left()[0] - OFFSET_GUTTER - this.width() / 2;
        } else if (dY > 0) {
            // Put above
            newY = shape.top()[1] + OFFSET_GUTTER + this.height() / 2;
        } else if (dY < 0) {
            // Put below
            newY = shape.bottom()[1] - OFFSET_GUTTER - this.height() / 2;
        } else {
            // [0, 0]?
            return this;
        }

        this.moveCenter([newX, newY]);

        return this;
    }

    center(): Point {
        const avgX = this.top()[0];
        const avgY = this.left()[1];

        return [avgX, avgY];
    }

    moveCenter(newCenter: Point): Shape {
        const shift = math.subtract(newCenter, this.center()) as Shift;
        return this.shift(shift);
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
        return this.right()[0] - this.left()[0];
    }

    height(): number {
        return this.top()[1] - this.bottom()[1];
    }

    children(): Shape[] {
        return this._els;
    }

    get angle() {
        return this._angle;
    }

    get currentScale() {
        return this._currentScale;
    }
}
