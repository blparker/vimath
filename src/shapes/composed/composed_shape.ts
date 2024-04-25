import { Point, Prettify } from '@/base';
import { RGBA } from '@/colors';
import { Locatable, Shape, ShapeStyles, defaultShapeStyles, isShape, locatableToPoint } from '@/shapes/shape';
import math from '@/math';
import utils from '@/utils';
import { config } from '@/config';


class ComposedShape implements Shape {
    private _shapes: Shape[] = [];
    private _composed: boolean = false;
    private _styles: ShapeStyles;
    private _angle = 0;
    private _scale = 1;

    constructor({ ...styleArgs }: Prettify<ShapeStyles> = {}) {
        this._styles = Object.assign({}, defaultShapeStyles, styleArgs);
    }

    center(): Point {
        const { minX, maxX, minY, maxY } = this.boundingBox();

        return [(minX + maxX) / 2, (minY + maxY) / 2];
    }

    top(): Point {
        const { minX, maxX, maxY } = this.boundingBox();

        return [(minX + maxX) / 2, maxY];
    }

    right(): Point {
        const { maxX, minY, maxY } = this.boundingBox();

        return [maxX, (minY + maxY) / 2];
    }

    bottom(): Point {
        const { minX, maxX, minY } = this.boundingBox();

        return [(minX + maxX) / 2, minY];
    }

    left(): Point {
        const { minX, minY, maxY } = this.boundingBox();

        return [minX, (minY + maxY) / 2];
    }

    width(): number {
        const { minX, maxX } = this.boundingBox();

        return maxX - minX;
    }

    height(): number {
        const { minY, maxY } = this.boundingBox();

        return maxY - minY;
    }

    moveTo(point: Point): this {
        const [cX, cY] = this.center();
        const shift = [point[0] - cX, point[1] - cY] as Point;

        this.shift(shift);

        return this;
    }

    shift(...shifts: Point[]): this {
        for (const s of this.composedShapes()) {
            s.shift(...shifts);
        }

        return this;
    }

    scale(factor: number): this {
        for (const shape of this.composedShapes()) {
            // When scaling, the centers of the constituent shapes get translated
            shape.moveTo(math.multScalar(shape.center(), factor) as Point);
            shape.scale(factor);
        }

        this._scale += factor;
        return this;
    }

    rotate(angle: number): this {
        const center = this.center();

        for (const s of this.composedShapes()) {
            const shapeCenter = s.center();
            const [vX, vY] = math.subVec(shapeCenter, center)

            const r = [
                vX * Math.cos(angle) - vY * Math.sin(angle),
                vX * Math.sin(angle) + vY * Math.cos(angle)
            ] as Point;

            const newCenter = math.addVec(center, r);

            s.moveTo(newCenter);
            s.rotate(angle);
        }

        this._angle += angle;
        return this;
    }

    nextTo(other: Locatable, direction: Point): this {
        let [toX, toY] = locatableToPoint(other);
        let [sW, sH] = [0, 0];
        const [w, h] = [this.width(), this.height()];

        if (isShape(other)) {
            sW = other.width();
            sH = other.height();
        }

        const [dX, dY] = direction;

        if (dX > 0) {
            toX += sW / 2 + w / 2 + config.standoff;
        } else if (dX < 0) {
            toX -= sW / 2 + w / 2 + config.standoff;
        }

        if (dY > 0) {
            toY += sH / 2 + h / 2 + config.standoff;
        } else if (dY < 0) {
            toY -= sH / 2 + h / 2 + config.standoff;
        }

        const adjStandoff = Math.sqrt(config.standoff ** 2 / 2);

        if (direction[0] !== 0 && direction[1] !== 0) {
            const xDir = Math.sign(direction[0]);
            const yDir = Math.sign(direction[1]);

            toX += -xDir * config.standoff;
            toY += -yDir * config.standoff;

            toX += xDir * adjStandoff;
            toY += yDir * adjStandoff;
        }

        this.moveTo([toX, toY]);

        return this;
    }

    angle(): number {
        return this._angle;
    }

    currentScale(): number {
        return this._scale;
    }

    styles(): ShapeStyles {
        return this._styles;
    }

    changeColor(color: RGBA): this {
        this.styles().color = color;
        return this;
    }

    changeLineColor(color: RGBA): this {
        this.styles().lineColor = color;
        return this;
    }

    copy(): this {
        return utils.deepCopy(this);
    }

    add(...els: Shape[]): Shape {
        this._shapes.push(...els);
        return this;
    }

    compose(): Shape {
        return this;
    }

    composedShapes(): Shape[] {
        if (!this._composed) {
            this.compose();
            this._composed = true;
        }

        return this._shapes;
    }

    private boundingBox(): { minX: number, minY: number, maxX: number, maxY: number } {
        // const xs = this._points.map(p => p[0]);
        // const ys = this._points.map(p => p[1]);
        const lefts = this.composedShapes().map(s => s.left()[0]);
        const rights = this.composedShapes().map(s => s.right()[0]);
        const tops = this.composedShapes().map(s => s.top()[1]);
        const bottoms = this.composedShapes().map(s => s.bottom()[1]);

        const xs = lefts.concat(rights);
        const ys = tops.concat(bottoms);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        // return [[minX, minY], [maxX, maxY]];
        return { minX, minY, maxX, maxY };
    }
}


export { ComposedShape };
