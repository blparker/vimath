import { DOWN, Point, Prettify, RIGHT } from '@/base';
import { Colors, RGBA } from '@/colors';
import { Locatable, SelectableShape, Shape, ShapeStyles, defaultShapeStyles, isShape } from '@/shapes/shape';
import { Text } from './text';
import utils from '@/utils';
import math from '@/math';
import { config } from '@/config';


class PointShape implements Shape, SelectableShape {
    private readonly _points: Point[];
    private _styles: ShapeStyles;
    private _canSelect: boolean = true;
    private _smooth: boolean;
    private _allStyles: ShapeStyles[] = [];
    private _selected: boolean = false;
    private _angle = 0;
    private _scale = 1;

    constructor({ points, selectable = false, smooth = false, ...styleArgs }: { points: Point[]; selectable?: boolean; smooth?: boolean; } & Prettify<ShapeStyles>) {
        this._points = structuredClone(points);
        this._canSelect = selectable;
        this._smooth = smooth;
        this._styles = Object.assign({}, defaultShapeStyles, styleArgs);
        this._allStyles.push(this._styles);
    }

    center(): Point {
        let xMean = 0;
        let yMean = 0;

        for (let i = 0; i < this._points.length; i++) {
            xMean += (this._points[i][0] - xMean) / (i + 1);
            yMean += (this._points[i][1] - yMean) / (i + 1);
        }

        return [xMean, yMean];
    }

    top(): Point {
        const { minX, maxX, maxY } = this.boundingBox();
        return [(minX + maxX) / 2, maxY] as Point;
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
        return this.right()[0] - this.left()[0];
    }

    height(): number {
        return this.top()[1] - this.bottom()[1];
    }

    moveTo(point: Point): Shape {
        const [cX, cY] = this.center();

        for (const p of this._points) {
            p[0] = p[0] + (point[0] - cX);
            p[1] = p[1] + (point[1] - cY);
        }

        return this;
    }

    shift(...shifts: Point[]): Shape {
        const [sX, sY] = shifts.reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]);

        for (const p of this._points) {
            p[0] += sX;
            p[1] += sY;
        }

        return this;
    }

    scale(factor: number): Shape {
        for (const p of this._points) {
            p[0] *= factor;
            p[1] *= factor;
        }

        this._scale += factor;
        return this;
    }

    rotate(angle: number): Shape {
        const [cX, cY] = this.center();

        for (const p of this._points) {
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
        return this;
    }

    nextTo(other: Locatable, direction: Point = RIGHT()): Shape {
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

    points(): Point[] {
        return this._points;
    }

    styles(): ShapeStyles {
        // return this._styles;
        return this._allStyles[this._allStyles.length - 1];
    }

    changeColor(color: RGBA): Shape {
        // this._styles.color = color;
        this.styles().color = color;
        return this;
    }

    changeLineColor(color: RGBA): Shape {
        // this._styles.lineColor = color;
        this.styles().lineColor = color;
        return this;
    }

    changeLineWidth(width: number): Shape {
        this.styles().lineWidth = width;
        return this;
    }

    select(): void {
        if (!this._selected) {
            this._allStyles.push(this.selectStyles());
            this._selected = true;
        }
    }

    deselect(): void {
        if (this._selected) {
            this._allStyles.pop();
            this._selected = false;
        }
    }

    selectStyles(): ShapeStyles {
        return Object.assign({}, this._styles, {
            color: Colors.red(),
            lineColor: Colors.red(),
        });
    }

    isPointOnEdge(point: Point): boolean {
        const points = this.points();

        function dist(a: Point, b: Point) {
            const [x1, y1] = a;
            const [x2, y2] = b;

            const A = point[0] - x1;
            const B = point[1] - y1;
            const C = x2 - x1;
            const D = y2 - y1;

            const dot = A * C + B * D;
            const lenSq = C * C + D * D;
            const param = lenSq !== 0 ? dot / lenSq : -1;

            let xx, yy;
            if (param < 0) {
                xx = x1;
                yy = y1;
            } else if (param > 1) {
                xx = x2;
                yy = y2;
            } else {
                xx = x1 + param * C;
                yy = y1 + param * D;
            }

            const dx = point[0] - xx;
            const dy = point[1] - yy;
            return Math.sqrt(dx * dx + dy * dy);
        }

        for (let i = 0; i < points.length - 1; i++) {
            if (dist(points[i], points[i + 1]) < 0.1) {
                return true;
            }
        }

        return false;
    }

    get canSelect(): boolean {
        return this._canSelect;
    }

    smooth() {
        return this._smooth;
    }

    copy(): this {
        return utils.deepCopy(this);
    }

    textOnEdge(text: string, position: number, direction: Point = DOWN()): Shape {
        return this._textOnEdge(text, position, direction, false);
    }

    texOnEdge(text: string, position: number, direction: Point = DOWN()): Shape {
        return this._textOnEdge(text, position, direction, true);
    }

    _textOnEdge(text: string, position: number, direction: Point, isTex: boolean): Shape {
        const pt1 = this._points[position];
        const pt2 = position === this._points.length - 1 ? this._points[0] : this._points[position + 1];

        const midPoint = math.midpoint(pt1, pt2);
        return new Text({ text, tex: true, }).nextTo(midPoint, direction);
    }

    private boundingBox(): { minX: number, minY: number, maxX: number, maxY: number } {
        const xs = this._points.map(p => p[0]);
        const ys = this._points.map(p => p[1]);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        // return [[minX, minY], [maxX, maxY]];
        return { minX, minY, maxX, maxY };
    }
}


function locatableToPoint(locatable: Locatable): Point {
    return isShape(locatable) ? locatable.center() : locatable;
}

export { PointShape, type ShapeStyles, locatableToPoint };
