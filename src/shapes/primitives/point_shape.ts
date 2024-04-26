import { BezierSegment, DOWN, Point, Prettify, RIGHT } from '@/base';
import { Colors, RGBA } from '@/colors';
import { Locatable, SelectableShape, Shape, ShapeStyles, defaultShapeStyles, isShape, locatableToPoint } from '@/shapes/shape';
import { Text } from '@/shapes/primitives/text';
import utils from '@/utils';
import math from '@/math';
import { config } from '@/config';


function isBezier(point: Point | BezierSegment): point is BezierSegment {
    return Array.isArray(point) && point.length === 4;
}


/**
 * A shape made up of points and edges that form a shape
 */
class PointShape implements Shape, SelectableShape {
    private _points: BezierSegment[];
    private _styles: ShapeStyles;
    private _canSelect: boolean = true;
    private _smooth: boolean;
    private _allStyles: ShapeStyles[] = [];
    private _selected: boolean = false;
    private _angle = 0;
    private _scale = 1;

    /**
     * Creates a new empty point shape
     */
    constructor();
    /**
     * Create a new point shape with points (standard X/Y points or bezier segments), an optional selectable flag, and optional styles
     * @param points the points that make up the shape. The points can be provided as standard X/Y points or as bezier segments. All points are converted to bezier segments
     * @param selectable whether the shape can be selected
     * @param smooth whether the shape should be smoothed
     * @param styleArgs the styles for the shape
     */
    constructor({ points, selectable, smooth, ...styleArgs }: { points: (Point | BezierSegment)[]; selectable?: boolean; smooth?: boolean; } & Prettify<ShapeStyles>);
    constructor(args: { points?: (Point | BezierSegment)[]; selectable?: boolean; smooth?: boolean; } & Prettify<ShapeStyles> = {}) {
        this._points = args.points ? PointShape.pointsToSegments(structuredClone(args.points)) : [];
        this._canSelect = args.selectable ?? false;
        this._smooth = args.smooth ?? false;
        this._styles = Object.assign({}, defaultShapeStyles, args);
        this._allStyles.push(this._styles);
    }

    center(): Point {
        // let xMean = 0;
        // let yMean = 0;

        // for (let i = 0, count = 0; i < this._points.length; i++) {
        //     const pt = this._points[i];

        //     for (let j = 0; j < pt.length; j++) {
        //         if (pt[j] !== null) {
        //             xMean += (pt[j]![0] - xMean) / (count + 1);
        //             yMean += (pt[j]![1] - yMean) / (count + 1);

        //             count++;
        //         }
        //     }
        // }

        // console.log(xMean, yMean);
        // return [xMean, yMean];
        return this.centerWithSampling();
    }

    private centerWithSampling(): Point {
        let xSum = 0, ySum = 0;
        let sampleCount = 0;
        const samplesPerCurve = 100;

        for (let i = 0; i < this._points.length; i++) {
            let [start, cp1, cp2, end] = this._points[i];

            // If the start point is null, make sure this isn't the first point
            if (start === null) {
                if (i === 0) {
                    throw new Error('Invalid bezier curve. Expect the initial point to define a starting point');
                }

                // Set the start point of the current curve to the end point of the previous curve
                start = this._points[i - 1][3];
            }

            for (let j = 0; j <= samplesPerCurve; j++) {
                const t = j / samplesPerCurve;
                const [x, y] = math.evalBezier(start, cp1, cp2, end, t);

                xSum += x;
                ySum += y;
            }

            sampleCount += samplesPerCurve + 1;
        }

        return [xSum / sampleCount, ySum / sampleCount];
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

    moveTo(point: Point): this {
        const [cX, cY] = this.center();

        for (const pt of this._points) {
            // if (isBezier(pt)) {
                for (let j = 0; j < pt.length; j++) {
                    if (pt[j] !== null) {
                        pt[j]![0] = pt[j]![0] + (point[0] - cX);
                        pt[j]![1] = pt[j]![1] + (point[1] - cY);
                    }
                }
            // } else {
            //     pt[0] = pt[0] + (point[0] - cX);
            //     pt[1] = pt[1] + (point[1] - cY);
            // }
        }

        return this;
    }

    shift(...shifts: Point[]): this {
        const [sX, sY] = shifts.reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]);

        for (const p of this._points) {
            // if (isBezier(p)) {
                for (let i = 0; i < p.length; i++) {
                    if (p[i] !== null) {
                        p[i]![0] += sX;
                        p[i]![1] += sY;
                    }
                }
            // } else {
            //     p[0] += sX;
            //     p[1] += sY;
            // }
        }

        return this;
    }

    scale(factor: number): this {

        // if (factor === 0) {
        //     const initSize = 0.00001;

        //     for (const seg of this._points) {
        //         for (const pt of seg) {
        //             if (pt !== null) {
        //                 pt[0] = Math.sign(pt[0]) * initSize;
        //                 pt[1] = Math.sign(pt[1]) * initSize;
        //             }
        //         }
        //     }

        //     this._scale = initSize;
        // } else {
        //     for (const seg of this._points) {
        //         for (const pt of seg) {
        //             if (pt !== null) {
        //                 pt[0] *= factor;
        //                 pt[1] *= factor;
        //             }
        //         }
        //     }

        //     this._scale *= factor;
        // }
        if (factor === 0) {
            factor = 0.00001;
        }

        for (const seg of this._points) {
            for (const pt of seg) {
                if (pt !== null) {
                    pt[0] *= factor;
                    pt[1] *= factor;
                }
            }
        }

        this._scale *= factor;
        return this;
    }

    rotate(angle: number): this {
        const [cX, cY] = this.center();

        // function rot(x: number, y: number): [number, number] {
        //     return [
        //         x * Math.cos(angle) - y * Math.sin(angle),
        //         x * Math.sin(angle) + y * Math.cos(angle)
        //     ];
        // }

        for (const p of this._points) {
            // if (isBezier(p)) {
                for (let i = 0; i < p.length; i++) {
                    if (p[i] !== null) {
                        const [x, y] = p[i]!;
                        const [xT, yT] = [x - cX, y - cY];

                        const [xR, yR] = [
                            xT * Math.cos(angle) - yT * Math.sin(angle),
                            xT * Math.sin(angle) + yT * Math.cos(angle)
                        ];

                        p[i]![0] = xR + cX;
                        p[i]![1] = yR + cY;
                    }
                }
            // } else {
            //     const [x, y] = p;
            //     const [xT, yT] = [x - cX, y - cY];

            //     const [xR, yR] = [
            //         xT * Math.cos(angle) - yT * Math.sin(angle),
            //         xT * Math.sin(angle) + yT * Math.cos(angle)
            //     ];

            //     p[0] = xR + cX;
            //     p[1] = yR + cY;
            // }
        }

        this._angle += angle;
        return this;
    }

    nextTo(other: Locatable, direction: Point = RIGHT()): this {
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

    points(): BezierSegment[] {
        return this._points;
    }

    styles(): ShapeStyles {
        // return this._styles;
        return this._allStyles[this._allStyles.length - 1];
    }

    changeColor(color: RGBA): this {
        // this._styles.color = color;
        this.styles().color = color;
        return this;
    }

    changeLineColor(color: RGBA): this {
        // this._styles.lineColor = color;
        this.styles().lineColor = color;
        return this;
    }

    changeLineWidth(width: number): this {
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
        // const points = this.points();

        // function dist(a: Point, b: Point) {
        //     const [x1, y1] = a;
        //     const [x2, y2] = b;

        //     const A = point[0] - x1;
        //     const B = point[1] - y1;
        //     const C = x2 - x1;
        //     const D = y2 - y1;

        //     const dot = A * C + B * D;
        //     const lenSq = C * C + D * D;
        //     const param = lenSq !== 0 ? dot / lenSq : -1;

        //     let xx, yy;
        //     if (param < 0) {
        //         xx = x1;
        //         yy = y1;
        //     } else if (param > 1) {
        //         xx = x2;
        //         yy = y2;
        //     } else {
        //         xx = x1 + param * C;
        //         yy = y1 + param * D;
        //     }

        //     const dx = point[0] - xx;
        //     const dy = point[1] - yy;
        //     return Math.sqrt(dx * dx + dy * dy);
        // }

        // for (let i = 0; i < points.length - 1; i++) {
        //     if (dist(points[i], points[i + 1]) < 0.1) {
        //         return true;
        //     }
        // }

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

    partial(shape: PointShape, pct: number) {
        // const points = shape.points();
        // const totalPoints = points.length;

        // const fullEdges = Math.floor(pct * totalPoints);
        // const partialPct = (pct * totalPoints) - fullEdges;

        // this._points = points.slice(0, fullEdges);

        // if (fullEdges < totalPoints) {
        //     const start = points[fullEdges % totalPoints];
        //     const end = points[(fullEdges + 1) % totalPoints];

        //     const nextPoint = [
        //         start[0] + partialPct * (end[0] - start[0]),
        //         start[1] + partialPct * (end[1] - start[1])
        //     ] as Point;

        //     this._points.push(start);
        //     this._points.push(nextPoint);
        // }
    }

    bezierPoints(): BezierSegment[] {
        // return this._points.map(pt => {
        //     if (!isBezier(pt)) {
        //         return [pt, pt, pt, pt];
        //     } else {
        //         return pt;
        //     }
        // });
        const bezierPoints: BezierSegment[] = [];

        for (let i = 0; i < this._points.length; i++) {
            const pt1 = this._points[i];
            const pt2 = i + 1 < this._points.length ? this._points[i + 1] : this._points[0];

            if (isBezier(pt1)) {
                bezierPoints.push(pt1);
            } else {
                if (isBezier(pt2)) {
                    const start = pt2[0];
                    const cp1 = pt2[1]

                    if (start) {
                        bezierPoints.push([i === 0 ? pt1 : null, pt1, start, start]);
                    } else {
                        bezierPoints.push([i === 0? pt1 : null, pt1, cp1, cp1]);
                    }
                } else {
                    bezierPoints.push([i === 0 ? pt1 : null, pt1, pt2, pt2]);
                }
            }
        }

        return bezierPoints;
    }

    bezierPartial(shape: PointShape, pct: number) {
        const points = shape.bezierPoints();
        const totalPoints = points.length;

        const fullCurves = Math.floor(pct * totalPoints);
        const partialPct = (pct * totalPoints) - fullCurves;

        this._points = points.slice(0, fullCurves);

        function interpolatePoint(p1: Point, p2: Point, t: number): Point {
            return [
                p1[0] + t * (p2[0] - p1[0]),
                p1[1] + t * (p2[1] - p1[1])
            ];
        }

        if (fullCurves < totalPoints) {
            let [start, control1, control2, end] = points[fullCurves];
            start = start ? start : this._points[this._points.length - 1][3] as Point;

            const l1 = interpolatePoint(start, control1, partialPct);
            const l2 = interpolatePoint(control1, control2, partialPct);
            const l3 = interpolatePoint(control2, end, partialPct);
            const m1 = interpolatePoint(l1, l2, partialPct);
            const m2 = interpolatePoint(l2, l3, partialPct);
            const b = interpolatePoint(m1, m2, partialPct);

            // this._bezierPoints.push([start, l1, m1, b]);
            if (fullCurves > 0) {
                this._points.push([null, l1, m1, b]);
            } else {
                this._points.push([start, l1, m1, b]);
            }
        } // else {
    }

    // addBezierPoint({ start, control1, control2, end }: { start?: Point, control1: Point, control2: Point, end: Point }): void {
    //     let bezierPoint: BezierPoint = [start === undefined ? null : start, control1, control2, end];
    //     this._bezierPoints.push(bezierPoint);
    // }

    textOnEdge(text: string, position: number, direction: Point = DOWN()): Text {
        return this._textOnEdge(text, position, direction, false);
    }

    texOnEdge(text: string, position: number, direction: Point = DOWN()): Text {
        return this._textOnEdge(text, position, direction, true);
    }

    private _textOnEdge(text: string, position: number, direction: Point, isTex: boolean): Text {
        function approxCurveLength(p0: Point, p1: Point, p2: Point, p3: Point, samples: number = 1000): number {
            let length = 0;
            let prevPoint = p0;

            for (let i = 1; i <= samples; i++) {
                const t = i / samples;
                const currPoint = math.evalBezier(p0, p1, p2, p3, t);

                const dx = currPoint[0] - prevPoint[0];
                const dy = currPoint[1] - prevPoint[1];

                length += Math.sqrt(dx * dx + dy * dy);
                prevPoint = currPoint;
            }

            return length;
        }

        function findMidT(p0: Point, p1: Point, p2: Point, p3: Point, length: number, samples: number = 1000): number {
            let accumulatedLength = 0;
            let t = 0;
            const step = 1 / samples;

            for (let i = 0; i <= samples; i++) {
                const tNext = i / samples;
                const currPoint = math.evalBezier(p0, p1, p2, p3, tNext);
                const prevPoint = i === 0 ? p0 : math.evalBezier(p0, p1, p2, p3, tNext - step);
                const dx = currPoint[0] - prevPoint[0];
                const dy = currPoint[1] - prevPoint[1];
                accumulatedLength += Math.sqrt(dx * dx + dy * dy);

                if (accumulatedLength >= length) {
                    t = tNext;
                    break;
                }
            }

            return t;
        }

        let [p0, p1, p2, p3] = this._points[position];
        if (p0 === null) {
            if (position === 0) {
                throw new Error('Invalid bezier curve. Expect the initial point to define a starting point');
            }

            p0 = this._points[position - 1][3];
        }

        const length = approxCurveLength(p0, p1, p2, p3);
        const midpoint = math.evalBezier(p0, p1, p2, p3, findMidT(p0, p1, p2, p3, length / 2));

        return new Text({ text, tex: isTex }).nextTo(midpoint, direction);
    }

    private boundingBox(): { minX: number, minY: number, maxX: number, maxY: number } {
        // const xs = this._points.map(p => p[0]);
        // const ys = this._points.map(p => p[1]);

        // const minX = Math.min(...xs);
        // const maxX = Math.max(...xs);
        // const minY = Math.min(...ys);
        // const maxY = Math.max(...ys);
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const pt of this._points) {
            if (isBezier(pt)) {
                for (const p of pt) {
                    if (p !== null) {
                        minX = Math.min(minX, p[0]);
                        minY = Math.min(minY, p[1]);
                        maxX = Math.max(maxX, p[0]);
                        maxY = Math.max(maxY, p[1]);
                    }
                }
            } else {
                minX = Math.min(minX, pt[0]);
                minY = Math.min(minY, pt[1]);
                maxX = Math.max(maxX, pt[0]);
                maxY = Math.max(maxY, pt[1]);
            }
        }


        return { minX, minY, maxX, maxY };
    }

    private static pointsToSegments(points: (Point | BezierSegment)[]): BezierSegment[] {
        const segments: BezierSegment[] = [];
        const n = points.length;

        if (points.every(isBezier)) {
            return points as BezierSegment[];
        } else if (points.every(pt => !isBezier(pt))) {
            if (n === 1) {
                const pt = points[0] as Point;
                return [[pt, pt, pt, pt]];
            } else if (n === 2) {
                const [pt1, pt2] = points as [Point, Point];
                return [[pt1, pt1, pt2, pt2]];
            }

            for (let i = 0; i < n - 1; i++) {
                const curr = points[i] as Point;
                const next = points[(i + 1) % n] as Point;
                segments.push([i > 0 ? null : curr, curr, next, next]);
            }

            // const first = points[0] as Point;
            // const last = points[n - 1] as Point;

            // if (first[0] === last[0] && first[1] === last[1]) {
            //     segments.push([null, last, first, first])
            // }
        } else {
            /*
             * Mixture of points and bezier segments. Assume that the bezier segments are just points.
             * Example: [[1, 1], [null, [1, -1], [1, -1], [1, -1]], [-1, -1], [null, [-1, 1], [-1, 1], [-1, 1]]]
             */
            for (let i = 0; i < n; i++) {
                const curr = points[i];
                const next = points[(i + 1) % n];

                const start = isBezier(curr) ? curr[1] : curr;
                const end = isBezier(next) ? next[3] : next;

                segments.push([i > 0 ? null : start, start, end, end]);
            }
        }

        return segments;
    }
}


export { PointShape };
