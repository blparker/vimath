import { Shift, Point, RIGHT, OFFSET_GUTTER } from '../base.js';
import { Shape } from './base_shapes.js';
import * as math from '../math.js';


export interface Composable extends Shape {
    children(): Shape[];
}


export abstract class ComposableShape implements Shape, Composable {
    private composed: boolean = false;
    private shapes: Shape[] = [];
    private maxTop: number = -Infinity;
    private maxBottom: number = Infinity;
    private maxLeft: number = Infinity;
    private maxRight: number = -Infinity;
    private _angle: number = 0;
    private _currentScale: number = 1;

    abstract compose(): ComposableShape;

    composedShapes(): Shape[] {
        if (! this.composed) {
            this.compose();
        }

        return this.shapes;
    }

    add(...shapes: Shape[]): ComposableShape {
        this.shapes.push(...shapes);

        this._setMaxes();
        return this;
    }

    shift(...shifts: Shift[]): Shape {
        for (const shape of this.shapes) {
            shape.shift(...shifts);
        }

        this._setMaxes();
        return this;
    }

    moveTo(point: Point): Shape {
        const [cX, cY] = this.center();
        const shift = [point[0] - cX, point[1] - cY] as Shift;

        this.shift(shift);

        this._setMaxes();
        return this;
    }

    scale(factor: number): Shape {
        for (const shape of this.shapes) {
            // When scaling, the centers of the constituent shapes get translated
            shape.moveTo(math.scalarMultiply(shape.center(), factor) as Point);
            shape.scale(factor);
        }

        this._setMaxes();
        return this;
    }

    rotate(angle: number): Shape {
        const [cX, cY] = this.center();

        for (const shape of this.shapes) {
            const [sX, sY] = shape.center();
            // const [tX, tY] = [sX - cX, sY - cY];
            const [tX, tY] = [math.subtract(sX, cX), math.subtract(sY, cY)];

            // const nX = tX * Math.cos(angle) - tY * Math.sin(angle);
            // const nY = tX * Math.sin(angle) + tY * Math.cos(angle);
            const nX = math.subtract(math.mult(tX, Math.cos(angle)), math.mult(tY, Math.sin(angle)));
            const nY = math.add(math.mult(tX, Math.sin(angle)), math.mult(tY, Math.cos(angle)));

            shape.moveTo([math.add(cX, nX), math.add(cY, nY)]);
            shape.rotate(angle);
        }

        return this;
    }

    nextTo(shape: Shape, direction?: Point | undefined): Shape {
        let offsetX = 0, offsetY = 0;
        let [dX, dY] = direction ?? RIGHT();
        const offsetGutter = OFFSET_GUTTER;

        if (dX !== 0) {
            // Left or right side
            offsetX = math.add(math.pDivide(this.width(), 2), offsetGutter);
        } else {
            // Top or bottom side
            offsetY = math.add(math.pDivide(this.height(), 2), offsetGutter);
        }

        dX = math.add(dX, offsetX * Math.sign(dX));
        dY = math.add(dY, offsetY * Math.sign(dY));

        const dest = shape.center();
        const [cX, cY] = this.center();

        this.moveTo([
            math.add(cX, math.add(dest[0], dX)),
            math.add(cY, math.add(dest[1], dY))
        ]);

        this._setMaxes();
        return this;
    }

    center(): Point {
        return [
            (this.maxRight + this.maxLeft) / 2,
            (this.maxTop + this.maxBottom) / 2
        ];
    }

    moveCenter(newCenter: Point): Shape {
        this.shift(math.subtract(newCenter, this.center()) as Shift);
        return this;
    }

    top(): Point {
        return [(this.maxRight + this.maxLeft) / 2, this.maxTop];
    }

    bottom(): Point {
        return [(this.maxRight + this.maxLeft) / 2, this.maxBottom];
    }

    left(): Point {
        return [this.maxLeft, (this.maxTop + this.maxBottom) / 2];
    }

    right(): Point {
        return [this.maxRight, (this.maxTop + this.maxBottom) / 2];
    }

    width(): number {
        return this.maxRight - this.maxLeft;
    }

    height(): number {
        return this.maxTop - this.maxBottom;
    }

    children(): Shape[] {
        return this.shapes;
    }

    get angle(): number {
        return this._angle;
    }

    get currentScale(): number {
        return this._currentScale;
    }

    private _setMaxes(): void {
        this.maxTop = this.maxRight = -Infinity;
        this.maxBottom = this.maxLeft = Infinity;

        for (const shape of this.shapes) {
            this.maxTop = Math.max(this.maxTop, shape.top()[1]);
            this.maxBottom = Math.min(this.maxBottom, shape.bottom()[1]);
            this.maxLeft = Math.min(this.maxLeft, shape.left()[0]);
            this.maxRight = Math.max(this.maxRight, shape.right()[0]);
        }
    }
}
