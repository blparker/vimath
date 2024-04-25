import { Point } from '@/base';
import { RGBA } from '@/colors';
import { Locatable, Shape, ShapeStyles, isShape, locatableToPoint } from '@/shapes/shape';
import { config } from '@/config';
import utils from '@/utils';


class BezierCurve implements Shape {
    private _start: Point;
    private _control1: Point;
    private _control2: Point;
    private _end: Point;
    private _styles: ShapeStyles;
    private _angle = 0;
    private _scale = 1;
    private _bbox: { minX: number, maxX: number, minY: number, maxY: number };

    constructor({ start, control1, control2, end, ...styles }: { start: Point, control1: Point, control2: Point, end: Point } & ShapeStyles) {
        this._start = start;
        this._control1 = control1;
        this._control2 = control2;
        this._end = end;
        this._styles = styles;

        this._bbox = this.boundingBox();
    }

    center(): Point {
        const { minX, maxX, minY, maxY } = this._bbox;

        return [(minX + maxX) / 2, (minY + maxY) / 2];
    }

    top(): Point {
        const { minX, maxX, maxY } = this._bbox;
        return [(minX + maxX) / 2, maxY] as Point;
    }

    right(): Point {
        const { maxX, minY, maxY } = this._bbox;
        return [maxX, (minY + maxY) / 2];
    }

    bottom(): Point {
        const { minX, maxX, minY } = this._bbox;
        return [(minX + maxX) / 2, minY];
    }

    left(): Point {
        const { minX, minY, maxY } = this._bbox;
        return [minX, (minY + maxY) / 2];
    }

    width(): number {
        return this.right()[0] - this.left()[0];
    }

    height(): number {
        return this.top()[1] - this.bottom()[1];
    }

    moveTo(point: Point): Shape {
        const [cX, cY] = this.center();

        for (const p of this.pointsArray()) {
            p[0] = p[0] + (point[0] - cX);
            p[1] = p[1] + (point[1] - cY);
        }

        this._bbox = this.boundingBox();
        return this;
    }

    shift(...shifts: Point[]): Shape {
        const [sX, sY] = shifts.reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]);

        for (const p of this.pointsArray()) {
            p[0] += sX;
            p[1] += sY;
        }

        this._bbox = this.boundingBox();
        return this;
    }

    scale(factor: number): Shape {
        for (const p of this.pointsArray()) {
            p[0] *= factor;
            p[1] *= factor;
        }

        this._scale += factor;

        this._bbox = this.boundingBox();
        return this;
    }

    rotate(angle: number): Shape {
        const [cX, cY] = this.center();

        for (const p of this.pointsArray()) {
            const [x, y] = p;
            const [xT, yT] = [x - cX, y - cY];

            const [xR, yR] = [
                xT * Math.cos(angle) - yT * Math.sin(angle),
                xT * Math.sin(angle) + yT * Math.cos(angle)
            ];

            p[0] = xR + cX;
            p[1] = yR + cY;
        }

        this._angle += angle;

        this._bbox = this.boundingBox();
        return this;
    }

    nextTo(other: Locatable, direction: Point): Shape {
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

        this._bbox = this.boundingBox();
        return this;
    }

    angle(): number {
        return this._angle;
    }

    currentScale(): number {
        return this._scale;
    }

    styles(): ShapeStyles {
        return this._styles;;
    }

    changeColor(color: RGBA): Shape {
        this.styles().color = color;
        return this;
    }

    changeLineColor(color: RGBA): Shape {
        this.styles().lineColor = color;
        return this;
    }

    copy(): this {
        return utils.deepCopy(this);
    }

    startPoint(): Point | undefined {
        return this._start;
    }

    controlPoint1(): Point {
        return this._control1;
    }

    controlPoint2(): Point {
        return this._control2;
    }

    endPoint(): Point {
        return this._end;
    }

    points(): { start?: Point; control1: Point; control2: Point; end: Point; } {
        return { start: this._start, control1: this._control1, control2: this._control2, end: this._end };
    }

    private pointsArray(): Point[] {
        return [this._start, this._control1, this._control2, this._end];
    }

    // private equation(t: number, p0: Point, p1: Point, p2: Point, p3: Point): number {
    //     return (1 - t)**3 * p0[0] + 3 * (1 - t)**2 * t * p1[0] + 3 * (1 - t) * t**2 * p2[0] + t**3 * p3[0];
    // }

    private equation(t: number, p0: Point, p1: Point, p2: Point, p3: Point, i: number): number {
        return (1 - t)**3 * p0[i] + 3 * (1 - t)**2 * t * p1[i] + 3 * (1 - t) * t**2 * p2[i] + t**3 * p3[i];
    }

    private derivative(t: number, p0: Point, p1: Point, p2: Point, p3: Point, i: number): number {
        return 3 * ((-1 + 2 * t - 3 * t**2)) * p0[i] + (1 - 4 * t + 3 * t**2) * p1[i] + (2 * t - 3 * t**2) * p2[i] + t**2 * p3[i];
    }

    private findCriticalPoints(p0: Point, p1: Point, p2: Point, p3: Point): [number[], number[]] {
        let criticalPointsX: number[] = [];
        let criticalPointsY: number[] = [];
        let tX = 0, tY = 0, step = 0.01;

        while (tX <= 1 || tY <= 1) {
            const dX = tX <= 1 ? this.derivative(tX, p0, p1, p2, p3, 0) : Number.POSITIVE_INFINITY;
            const dY = tY <= 1 ? this.derivative(tY, p0, p1, p2, p3, 1) : Number.POSITIVE_INFINITY;

            if (dX < 0.001) {
                criticalPointsX.push(tX);
                tX += 1;
            }

            if (dY < 0.001) {
                criticalPointsY.push(tY);
                tY += 1;
            }

            tX += step;
            tY += step;
        }

        return [criticalPointsX, criticalPointsY];
    }

    private boundingBox(): { minX: number, maxX: number, minY: number, maxY: number } {
        const [critX, critY] = this.findCriticalPoints(this._start, this._control1, this._control2, this._end);
        critX.push(0, 1);
        critY.push(0, 1);

        // Find the min/max X-values
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;

        for (let p of critX) {
            const xValue = this.equation(p, this._start, this._control1, this._control2, this._end, 0);
            if (xValue < minX) minX = xValue;
            if (xValue > maxX) maxX = xValue;
        }

        let minY = Number.POSITIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;

        for (let p of critY) {
            const yValue = this.equation(p, this._start, this._control1, this._control2, this._end, 1);
            if (yValue < minX) minY = yValue;
            if (yValue > maxX) maxY = yValue;
        }

        return { minX, maxX, minY, maxY };
    }
}


export { BezierCurve };
