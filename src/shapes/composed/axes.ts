import { LEFT, Point, Prettify } from '@/base';
import { ComposedShape } from './composed_shape';
import { Shape } from '@/shapes/shape';
import { NumberLine } from '@/shapes/composed/number_line';
import { config } from '@/config';
import { PointShape } from '@/shapes/primitives/point_shape';
import { Plot } from '@/shapes/composed/plot';
import math from '@/math';
import { Line } from '../primitives/line';
import { Colors } from '@/colors';
import { Text } from '../primitives/text';


// The number of discrete points that make up the plot function
const MIN_NUM_STEPS = 200;


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
    private _xAxis: NumberLine;
    private _yAxis: NumberLine;
    private _initialCenter: Point;

    constructor({
        xRange = [-7, 7],
        yRange = [-4, 4],
        xLength = config.xTicks,
        yLength = config.yTicks,
        showTicks,
        showXTicks,
        showYTicks,
        showLabels,
        showXLabels,
        showYLabels,
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
        this._showXTicks = showXTicks ?? showTicks ?? true;
        this._showYTicks = showYTicks ?? showTicks ?? true;
        this._showXLabels = showXLabels ?? showLabels ?? true;
        this._showYLabels = showXLabels ?? showLabels ?? true;
        this._tickSize = tickSize;
        this._labelStandoff = labelStandoff;
        this._labelSize = labelSize;
        this._xStep = xStep;
        this._yStep = yStep;
        this._showGrid = showGrid;
        this._xLabel = xLabel;
        this._yLabel = yLabel;
        this._showTips = tips;

        [this._xAxis, this._yAxis] = this.initializeNumberlines();

        this._initialCenter = this.center();
    }

    private initializeNumberlines(): [NumberLine, NumberLine] {
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

        return [xAxis, yAxis];
    }

    compose(): this {
        // const [oX, oY] = this.origin();

        // const xAxis = new NumberLine({
        //     range: this._xRange,
        //     length: this._xLength,
        //     excludeNumbers: [0],
        //     showTicks: this._showXTicks,
        //     showLabels: this._showXLabels,
        //     tickSize: this._tickSize,
        //     tickLabelStandoff: this._labelStandoff,
        //     labelSize: this._labelSize,
        //     tickStep: this._xStep,
        //     // lineCap: 'round',
        //     rightTip: this._showTips,
        // }).shift([0, oY]);

        // const yAxis = new NumberLine({
        //     range: this._yRange,
        //     length: this._yLength,
        //     rotation: Math.PI / 2,
        //     labelDirection: LEFT(),
        //     excludeNumbers: [0],
        //     showTicks: this._showYTicks,
        //     showLabels: this._showYLabels,
        //     tickSize: this._tickSize,
        //     tickLabelStandoff: this._labelStandoff,
        //     labelSize: this._labelSize,
        //     tickStep: this._yStep,
        //     // lineCap: 'round',
        //     rightTip: this._showTips,
        // }).shift([oX, 0]);
        const [xAxis, yAxis] = [this._xAxis, this._yAxis];

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

    plot(fn: (x: number) => number | null): Plot {
        return new Plot(fn, this._xRange, this._yRange, this.point.bind(this));
    }

    area(plot: Plot, range?: [number, number]): Shape {
        const [rS, rE] = range ?? this._xRange;

        const points = [this.point(rS, 0)];
        const stepSize = (rE - rS) / MIN_NUM_STEPS;
        for (let x = rS; x <= rE; x += stepSize) {
            const pt = plot.pointAtX(x);
            if (pt) {
                points.push(pt);
            }
        }

        points.push(this.point(rE, 0));
        return new PointShape({ points });
    }

    point(x: number, y: number): Point;
    point(p: Point): Point;
    point(xOrPt: number | Point, maybeY?: number): Point {
        let [x, y] = Array.isArray(xOrPt) ? xOrPt : [xOrPt, maybeY];

        if (y === undefined) {
            throw new Error('Invalid arguments. Y value must be provided');
        }

        return [
            this._xAxis.pointOnLine(x)[0],
            this._yAxis.pointOnLine(y)[1]
        ];
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
