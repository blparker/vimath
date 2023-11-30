import { Shift, Point, RIGHT, OFFSET_GUTTER } from '../base.js';
import { PointsAware, Shape } from './base_shapes.js';
import * as math from '../math.js';


export interface Composable extends Shape {
    compose(): Composable;
    children(): Shape[];
}


export abstract class ComposableShape implements Shape, Composable, PointsAware {
    private maxTop: number = -Infinity;
    private maxBottom: number = Infinity;
    private maxLeft: number = Infinity;
    private maxRight: number = -Infinity;
    private _angle: number = 0;
    private _currentScale: number = 1;
    protected composed: boolean = false;
    protected shapes: Shape[] = [];

    abstract compose(): ComposableShape;

    composedShapes(): Shape[] {
        if (! this.composed) {
            this.compose();
            this.composed = true;
        }

        return this.shapes;
    }

    add(...shapes: Shape[]): ComposableShape {
        this.shapes.push(...shapes);

        this._setMaxes();
        return this;
    }

    shift(...shifts: Shift[]): Shape {
        for (const shape of this.composedShapes()) {
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
        for (const shape of this.composedShapes()) {
            // When scaling, the centers of the constituent shapes get translated
            shape.moveTo(math.scalarMultiply(shape.center(), factor) as Point);
            shape.scale(factor);
        }

        this._setMaxes();
        return this;
    }

    rotate(angle: number): Shape {
        const [cX, cY] = this.center();

        for (const shape of this.composedShapes()) {
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

    nextTo(shape: Shape | Point, direction?: Point | undefined): Shape {
        // let offsetX = 0, offsetY = 0;
        let [dX, dY] = direction ?? RIGHT();
        // const offsetGutter = OFFSET_GUTTER;

        // if (dX !== 0) {
        //     // Left or right side
        //     offsetX = math.add(math.pDivide(this.width(), 2), offsetGutter);
        // } else {
        //     // Top or bottom side
        //     offsetY = math.add(math.pDivide(this.height(), 2), offsetGutter);
        // }

        // dX = math.add(dX, offsetX * Math.sign(dX));
        // dY = math.add(dY, offsetY * Math.sign(dY));

        // const dest = Array.isArray(shape) ? shape : shape.center();
        // const [cX, cY] = this.center();

        // console.log(dest, dX, dY)

        // this.moveTo([
        //     math.add(cX, math.add(dest[0], dX)),
        //     math.add(cY, math.add(dest[1], dY))
        // ]);
        // const [sCx, sCy] = Array.isArray(shape) ? shape : shape.center();
        // const w = Array.isArray(shape) ? 0 : shape.width();

        const shapeCenter = Array.isArray(shape) ? shape : shape.center();
        const [shapeWidth, shapeHeight] = [
            Array.isArray(shape) ? 0 : shape.width(),
            Array.isArray(shape) ? 0 : shape.height(),
        ];

        const width = this.width();
        const height = this.height();

        const nX = dX * (shapeCenter[0] + shapeWidth / 2) + (dX * width / 2) + (dX * OFFSET_GUTTER);
        const nY = dY * (shapeCenter[1] + shapeHeight / 2) + (dY * height / 2) + (dY * OFFSET_GUTTER);

        this.moveTo([nX, nY]);

        this._setMaxes();
        return this;
    }

    center(): Point {
        // return [
        //     (this.maxRight + this.maxLeft) / 2,
        //     (this.maxTop + this.maxBottom) / 2
        // ];
        const avgX = this.top()[0];
        const avgY = this.left()[1];

        return [avgX, avgY];
    }

    moveCenter(newCenter: Point): Shape {
        this.shift(math.subtract(newCenter, this.center()) as Shift);
        return this;
    }

    top(): Point {
        // return [(this.maxRight + this.maxLeft) / 2, this.maxTop];
        const tops = this.composedShapes().map(e => e.top());
        const avgX = math.sum(tops, 0) / tops.length;

        return [avgX, math.max(tops, 1)];
    }

    bottom(): Point {
        // return [(this.maxRight + this.maxLeft) / 2, this.maxBottom];
        const bottoms = this.composedShapes().map(e => e.bottom());
        const avgX = math.sum(bottoms, 0) / bottoms.length;

        return [avgX, math.min(bottoms, 1)];
    }

    left(): Point {
        // return [this.maxLeft, (this.maxTop + this.maxBottom) / 2];
        const lefts = this.composedShapes().map(e => e.left());
        const avgY = math.sum(lefts, 1) / lefts.length;

        return [math.min(lefts, 0), avgY];
    }

    right(): Point {
        // return [this.maxRight, (this.maxTop + this.maxBottom) / 2];
        const rights = this.composedShapes().map(e => e.right());
        const avgY = math.sum(rights, 1) / rights.length;

        return [math.max(rights, 0), avgY];
    }

    width(): number {
        return this.maxRight - this.maxLeft;
    }

    height(): number {
        return this.maxTop - this.maxBottom;
    }

    children(): Shape[] {
        return this.composedShapes();
    }

    copy(): Shape {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    points(): Point[] {
        return [this.top(), this.bottom(), this.left(), this.right()];
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
