import { Point } from '@/base';
import { ComposedShape } from './composed_shape';
import { PointShape } from '@/shapes/primitives/point_shape';


// The number of discrete points that make up the plot function
const MIN_NUM_STEPS = 200;


class Plot extends ComposedShape {
    // private _subplots: PointShape[] = [];
    private _fn: (x: number) => number | null;
    private _xRange: [number, number];
    private _yRange: [number, number];
    private _pointTransformer: (x: number, y: number) => Point;
    private _domain: [number, number];

    constructor(fn: (x: number) => number | null, xRange: [number, number], yRange: [number, number], pointTransformer: (x: number, y: number) => Point) {
        super();
        this._fn = fn;
        this._xRange = xRange;
        this._yRange = yRange;
        this._pointTransformer = pointTransformer;
        this._domain = xRange;
    }

    compose(): this {
        const [xLow, xHigh] = this._domain;

        const stepSize = (xHigh - xLow) / MIN_NUM_STEPS;
        const [yLow, yHigh] = this._yRange;

        let lastValidPoint: Point | null = null;

        const interpolate = (x: number, y: number, lastY: number, targetY: number): Point | null => {
            if (lastValidPoint === null) {
                return null;
            }

            const [lastX, _] = lastValidPoint;
            let slope = (y - lastY) / (x - lastX);

            if (slope === 0) return null;

            let b = lastY - (slope * lastX);
            let interpolatedX = (targetY - b) / slope;

            if (interpolatedX >= xLow && interpolatedX <= xHigh) {
                return [interpolatedX, targetY];
            } else {
                return null;
            }
        };

        let segmentPoints: Point[] = [];

        const finalizeSegment = () => {
            if (segmentPoints.length > 0) {
                const transformedPoints = segmentPoints.map(pt => this._pointTransformer(pt[0], pt[1]));
                this.add(new PointShape({ points: transformedPoints, smooth: true, }));
                segmentPoints = [];
            }
        };

        const addPoint = (x: number) => {
            let y = this._fn(x);

            // TODO: add hole
            if (!Number.isFinite(y) || y === null) {
                lastValidPoint = null;
                finalizeSegment();
                return;
            }

            if (y >= yLow && y <= yHigh) {
                /* The point is within the Y-range, but the previous point was outside. In order to avoid leaving a gap between the top of the Y-range and the
                 * start of the plot, we interpolate a point between the last valid point and the current point. */
                if (lastValidPoint === null && x > xLow) {
                    // Last point was invalid
                    const lastX = x - stepSize;
                    const lastY = this._fn(lastX);

                    if (lastY !== null) {
                        const tY = lastY > yHigh ? yHigh : yLow;
                        const slope = (y - lastY) / stepSize;
                        let b = lastY - (slope * lastX);
                        let interpolatedX = (tY - b) / slope;
                        if (interpolatedX >= xLow && interpolatedX <= xHigh && tY >= yLow && tY <= yHigh) {
                            segmentPoints.push([interpolatedX, tY] as Point);
                        }
                    }
                }

                const point = [x, y] as Point;
                segmentPoints.push(point);
                lastValidPoint = point;
            } else if (lastValidPoint) {
                const tY = y > yHigh ? yHigh : yLow;
                const interPoint = interpolate(x, y, lastValidPoint[1], tY);
                if (interPoint) {
                    segmentPoints.push(interPoint);
                }
                finalizeSegment();
                lastValidPoint = null;
            }
        };

        for (let x = xLow; x <= xHigh; x += stepSize) {
            addPoint(x);
        }

        // If the step size doesn't land directly on the end of the range, add the last point in the range
        addPoint(xHigh);
        finalizeSegment();

        return this;
    }

    /*
     * TODO: Fix this. This was added to prevent the plot from being shifted. The plot is already added relative to the axes, so by using the following
     * code:
     * 
     * const a = new Axes();
     * const p = a.plot(x => x);
     * this.add(new Group(a, p).shift(LEFT(2), UP(2)))
     * 
     * The plot first gets shifted to align with the axes, then get's shifted again by 2 to the left and 2 up, so it's no longer aligned with the axes
     */
    shift(...shifts: Point[]): this {
        return this;
    }

    valueAtX(x: number): number | null {
        return this._fn(x);
    }

    pointAtX(x: number): Point | null {
        const y = this._fn(x);
        return y !== null ? this._pointTransformer(x, y) : null;
    }

    setDomain(domain: [number, number]): this {
        if (domain[0] >= domain[1]) {
            throw new Error('Invalid domain');
        }

        let [dX, dY] = domain;
        if (dX >= this._xRange[0]) {
            dX = this._xRange[0];
        }

        if (dY >= this._xRange[1]) {
            dY = this._xRange[1];
        }

        this._domain = [dX, dY];
        this.recompose();
        return this;
    }

    // *points(): Generator<BezierSegment> {
    //     for (const subplot of this._subplots) {
    //         for (const point of subplot.points()) {
    //             yield point;
    //         }
    //     }
    // }
}


export { Plot };
