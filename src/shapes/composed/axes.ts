import { LEFT, Point, Prettify } from '@/base';
import { ComposedShape } from '@/shapes/composed/composed_shape';
import { Shape } from '@/shapes/shape';
import { NumberLine } from '@/shapes/composed/number_line';
import { config } from '@/config';
import { PointShape } from '@/shapes/primitives/point_shape';
import { Plot } from '@/shapes/composed/plot';
import math from '@/math';


type AxesArgs = {
    xRange?: [number, number];
    yRange?: [number, number];
    xLength?: number;
    yLength?: number;
};


class Axes extends ComposedShape {
    private _xRange: [number, number];
    private _yRange: [number, number];
    private _xLength: number;
    private _yLength: number;

    constructor({ xRange = [-5, 5], yRange = [-5, 5], xLength = config.xTicks, yLength = config.yTicks, ...styleArgs }: AxesArgs & Prettify<{}> = {}) {
        super({ ...styleArgs });

        this._xRange = xRange;
        this._yRange = yRange;
        this._xLength = xLength;
        this._yLength = yLength;
    }

    compose(): Shape {
        const [oX, oY] = this.origin();

        const xAxis = new NumberLine({
            range: this._xRange,
            length: this._xLength,
            excludeNumbers: [0],
            lineStyles: { lineCap: 'square' },
        }).shift([0, oY]);

        const yAxis = new NumberLine({
            range: this._yRange,
            length: this._yLength,
            rotation: Math.PI / 2,
            labelDirection: LEFT(),
            excludeNumbers: [0],
            lineStyles: { lineCap: 'square' },
        }).shift([oX, 0]);

        this.add(xAxis, yAxis)

        return this;
    }

    plot(fn: (x: number) => number | null): Shape {
        const minNumSteps = 200;
        const stepSize = (this._xRange[1] - this._xRange[0]) / minNumSteps;
        const origin = this.origin();

        let lastValidPoint: Point | null = null;
        const [yLow, yHigh] = this._yRange;

        const interpolate = (x: number, y: number, lastY: number, targetY: number): Point | null => {
            if (lastValidPoint === null) {
                return null;
            }

            const [lastX, _] = lastValidPoint;
            let slope = (y - lastY) / (x - lastX);

            if (slope === 0) return null;

            let b = lastY - (slope * lastX);
            let interpolatedX = (targetY - b) / slope;

            if (interpolatedX >= this._xRange[0] && interpolatedX <= this._xRange[1]) {
                return [interpolatedX, targetY];
            } else {
                return null;
            }
        };

        const origFn = (x: number) => {
            const y = fn(x);
            return [x, y] as [number, number | null];
        };

        const plot = new Plot(origFn);
        let segmentPoints: Point[] = [];

        function finalizeSegment() {
            if (segmentPoints.length > 0) {

                const transformedPoints = segmentPoints.map(pt => math.addVec(pt, origin));
                plot.addSubplot(new PointShape({ points: transformedPoints, smooth: true, }));
                segmentPoints = [];
            }
        }

        for (let x = this._xRange[0]; x <= this._xRange[1]; x += stepSize) {
            let y = fn(x);

            // TODO: add hole
            if (!Number.isFinite(y) || y === null) {
                lastValidPoint = null;
                finalizeSegment();
                continue;
            }

            if (y >= yLow && y <= yHigh) {
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
        }

        finalizeSegment();

        return plot;
    }

    private origin(): Point {
        // Find where 0 is along the x-axis range. Zero along the x-axis determines where the y-axis is placed
        const pY = math.invlerp(this._xRange[0], this._xRange[1], 0);
        const yAxisPos = math.lerp(-this._xLength / 2, this._xLength / 2, pY);

        // Find where 0 is along the y-axis range. Zero along the y-axis determines where the x-axis is placed
        const pX = math.invlerp(this._yRange[0], this._yRange[1], 0);
        const xAxisPos = math.lerp(-this._yLength / 2, this._yLength / 2, pX);

        return [yAxisPos, xAxisPos];
    }
}


export { Axes, type AxesArgs };
