import { LEFT, Point, Prettify, RIGHT, UR } from '@/base';
import { ComposedShape } from '@/shapes/composed/composed_shape';
import { Shape } from '@/shapes/shape';
import { NumberLine } from '@/shapes/composed/number_line';
import { config } from '@/config';
import { PointShape } from '@/shapes/primitives/point_shape';
import { Plot } from '@/shapes/composed/plot';
import math from '@/math';
import { Line } from '../primitives/line';
import { Colors } from '@/colors';
import { Text } from '../primitives/text';


type AxesArgs = {
    xRange?: [number, number];
    yRange?: [number, number];
    xLength?: number;
    yLength?: number;
    showTicks?: boolean;
    showXTicks?: boolean;
    showYTicks?: boolean;
    showLabels?: boolean;
    showXLabels?: boolean;
    showYLabels?: boolean;
    tickSize?: number;
    labelStandoff?: number;
    labelSize?: number;
    xStep?: number;
    yStep?: number;
    showGrid?: boolean;
    xLabel?: string;
    yLabel?: string;
    tips?: boolean;
};


class Axes extends ComposedShape {
    private _xRange: [number, number];
    private _yRange: [number, number];
    private _xLength: number;
    private _yLength: number;
    private _showXTicks: boolean;
    private _showYTicks: boolean;
    private _showXLabels: boolean;
    private _showYLabels: boolean;
    private _tickSize: number;
    private _labelStandoff: number;
    private _labelSize: number;
    private _xStep: number;
    private _yStep: number;
    private _showGrid: boolean;
    private _xLabel?: string;
    private _yLabel?: string;
    private _showTips?: boolean;

    constructor({
        xRange = [-7, 7],
        yRange = [-4, 4],
        xLength = config.xTicks,
        yLength = config.yTicks,
        showTicks = true,
        showXTicks = true,
        showYTicks = true,
        showLabels = true,
        showXLabels = true,
        showYLabels = true,
        tickSize = 0.1,
        labelStandoff = 0.3,
        labelSize = config.text.size,
        xStep = 1,
        yStep = 1,
        showGrid = false,
        tips = false,
        xLabel,
        yLabel,
        ...styleArgs
    }: AxesArgs & Prettify<{}> = {}) {
        super({ ...styleArgs });

        this._xRange = xRange;
        this._yRange = yRange;
        this._xLength = xLength;
        this._yLength = yLength;
        this._showXTicks = showXTicks;
        this._showYTicks = showYTicks;
        this._showXLabels = showXLabels;
        this._showYLabels = showYLabels;
        this._tickSize = tickSize;
        this._labelStandoff = labelStandoff;
        this._labelSize = labelSize;
        this._xStep = xStep;
        this._yStep = yStep;
        this._showGrid = showGrid;
        this._xLabel = xLabel;
        this._yLabel = yLabel;
        this._showTips = tips;
    }

    compose(): this {
        const [oX, oY] = this.origin();

        const xAxis = new NumberLine({
            range: this._xRange,
            length: this._xLength,
            excludeNumbers: [0],
            showTicks: this._showXTicks,
            showLabels: this._showXLabels,
            tickSize: this._tickSize,
            tickLabelStandoff: this._labelStandoff,
            labelSize: this._labelSize,
            tickStep: this._xStep,
            // lineCap: 'round',
            rightTip: this._showTips,
        }).shift([0, oY]);

        const yAxis = new NumberLine({
            range: this._yRange,
            length: this._yLength,
            rotation: Math.PI / 2,
            labelDirection: LEFT(),
            excludeNumbers: [0],
            showTicks: this._showYTicks,
            showLabels: this._showYLabels,
            tickSize: this._tickSize,
            tickLabelStandoff: this._labelStandoff,
            labelSize: this._labelSize,
            tickStep: this._yStep,
            // lineCap: 'round',
            rightTip: this._showTips,
        }).shift([oX, 0]);

        if (this._showGrid) {
            this.drawGrid(xAxis, yAxis);
        }

        this.add(xAxis, yAxis)

        if (this._xLabel) {
            const x = xAxis.right()[0] - 0.2;
            const y = xAxis.top()[1] + 0.2;
            this.add(new Text({ text: this._xLabel, x, y, align: 'left', baseline: 'bottom', size: this._labelSize }));
        }

        if (this._yLabel) {
            const x = yAxis.right()[0];
            const y = yAxis.top()[1] + 0.1;
            this.add(new Text({ text: this._yLabel, x, y, align: 'left', baseline: 'bottom', size: this._labelSize }));
        }

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

        const addPoint = (x: number) => {
            let y = fn(x);

            // TODO: add hole
            if (!Number.isFinite(y) || y === null) {
                lastValidPoint = null;
                finalizeSegment();
                return;
            }

            if (y >= yLow && y <= yHigh) {
                /* The point is within the Y-range, but the previous point was outside. In order to avoid leaving a gap between the top of the Y-range and the
                 * start of the plot, we interpolate a point between the last valid point and the current point. */
                if (lastValidPoint === null) {
                    // Last point was invalid
                    const lastX = x - stepSize;
                    const lastY = fn(lastX);

                    if (lastY !== null) {
                        const tY = lastY > yHigh ? yHigh : yLow;
                        const slope = (y - lastY) / stepSize;
                        let b = lastY - (slope * lastX);
                        let interpolatedX = (tY - b) / slope;
                        if (interpolatedX >= this._xRange[0] && interpolatedX <= this._xRange[1]) {
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

        for (let x = this._xRange[0]; x <= this._xRange[1]; x += stepSize) {
            addPoint(x);
        }

        // If the step size doesn't land directly on the end of the range, add the last point in the range
        addPoint(this._xRange[1]);
        finalizeSegment();

        return plot;
    }

    point(x: number, y: number): Point {
        const [oX, oY] = this.origin();
        return [x + oX, y + oY];
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

    private drawGrid(xAxis: NumberLine, yAxis: NumberLine) {
        const [fX, tX] = [xAxis.left()[0], xAxis.right()[0]];
        const [fY, tY] = [yAxis.bottom()[1], yAxis.top()[1]];

        for (let x = this._xRange[0]; x <= this._xRange[1]; x += this._xStep) {
            const xx = xAxis.pointOnLine(x)[0];

            this.add(new Line({
                from: [xx, fY],
                to: [xx, tY],
                lineColor: Colors.gray({ opacity: 0.2 }),
                lineWidth: 1,
            }));
        }

        for (let y = this._yRange[0]; y <= this._xRange[1]; y += this._yStep) {
            const yy = yAxis.pointOnLine(y)[0];

            this.add(new Line({
                from: [fX, yy],
                to: [tX, yy],
                lineColor: Colors.gray({ opacity: 0.2 }),
                lineWidth: 1,
            }));
        }
    }
}


export { Axes, type AxesArgs };
