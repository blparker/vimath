import { Point, Range, X_TICKS, Y_TICKS } from '../base';
import { ComposableShape } from './composed_shape';
import * as math from '../math';
import { PointShape, Shape, StyleArgs } from './base_shapes';
import { TextMetrics } from './text';
import { NumberLine } from './number_line';
import { Colors, colorWithOpacity } from '../colors';


// export type AxesConfig = {
//     xRange?: Range;
//     yRange?: Range;
//     xLength?: number;
//     yLength?: number;
//     showGridLines?: boolean;
//     showAxisTicks?: boolean;
//     showXAxisTicks?: boolean;
//     showYAxisTicks?: boolean;
//     showAxisLabels?: boolean;
//     showXAxisLabels?: boolean;
//     showYAxisLabels?: boolean;
//     numXAxisTicks?: number;
//     numYAxisTicks?: number;
//     tickSize?: number;
//     xAxisTickStep?: number;
//     yAxisTickStep?: number;
//     axisTextSize?: number;
//     textMetrics?: TextMetrics;
// };

export type AxesConfig = {
    xLength?: number;
    yLength?: number;
    xRange?: Range;
    yRange?: Range;
    showAxisTicks?: boolean;
    showXAxisTicks?: boolean;
    showYAxisTicks?: boolean;
    showAxisLabels?: boolean;
    showXAxisLabels?: boolean;
    showYAxisLabels?: boolean;
    tickSize?: number;
    tickLabelStandoff?: number;
    labelSize?: number;
    xAxisTickStep?: number;
    yAxisTickStep?: number;
    axisTextSize?: number;
};

const defaultAxesConfig = {
    xRange: [-X_TICKS / 2, X_TICKS / 2] as Range,
    yRange: [-Y_TICKS / 2, Y_TICKS / 2] as Range,
    xLength: X_TICKS,
    yLength: Y_TICKS,
    showGridLines: false,
    showAxisTicks: true,
    showXAxisTicks: false,
    showYAxisTicks: false,
    showAxisLabels: true,
    showXAxisLabels: false,
    showYAxisLabels: false,
    numXAxisTicks: 10,
    numYAxisTicks: 10,
    tickSize: 0.2,
    xAxisTickStep: 1,
    yAxisTickStep: 1,
    axisTextSize: 20,
    textMetrics: null,
    tickLabelStandoff: 0.4,
} as const;


export class Axes extends ComposableShape {
    private readonly xLength: number;
    private readonly yLength: number;
    private readonly xRange: Range;
    private readonly yRange: Range;
    private readonly showXAxisTicks: boolean;
    private readonly showYAxisTicks: boolean;
    private readonly showXAxisLabels: boolean;
    private readonly showYAxisLabels: boolean;
    private readonly tickSize: number;
    private readonly tickLabelStandoff: number;
    private readonly labelSize: number;
    private readonly xAxisTickStep: number;
    private readonly yAxisTickStep: number;

    constructor({ xLength, yLength, xRange, yRange, showAxisTicks, showXAxisTicks, showYAxisTicks, showAxisLabels, showXAxisLabels, showYAxisLabels, tickSize, tickLabelStandoff, labelSize, xAxisTickStep, yAxisTickStep }: AxesConfig = {}) {
        super();

        this.xLength = xLength ?? defaultAxesConfig.xLength;
        this.yLength = yLength ?? defaultAxesConfig.yLength;
        this.xRange = xRange ?? (xLength !== undefined ? [-xLength / 2, xLength / 2] : defaultAxesConfig.xRange);
        this.yRange = yRange ?? (yLength !== undefined ? [-yLength / 2, yLength / 2] : defaultAxesConfig.yRange);
        this.showXAxisTicks = showXAxisTicks ?? showAxisTicks ?? defaultAxesConfig.showAxisTicks;
        this.showYAxisTicks = showYAxisTicks ?? showAxisTicks ?? defaultAxesConfig.showAxisTicks;
        this.showXAxisLabels = showXAxisLabels ?? showAxisLabels ?? defaultAxesConfig.showAxisLabels;
        this.showYAxisLabels = showYAxisLabels ?? showAxisLabels ?? defaultAxesConfig.showAxisLabels;
        this.tickSize = tickSize ?? defaultAxesConfig.tickSize;
        this.tickLabelStandoff = tickLabelStandoff ?? defaultAxesConfig.tickLabelStandoff;
        this.labelSize = labelSize ?? defaultAxesConfig.axisTextSize;
        this.xAxisTickStep = xAxisTickStep ?? defaultAxesConfig.xAxisTickStep;
        this.yAxisTickStep = yAxisTickStep ?? defaultAxesConfig.yAxisTickStep;
    }

    compose(): ComposableShape {
        const dY = Math.abs(this.xRange[0]) / math.range(this.xRange);
        const oY = -(this.xLength / 2) + (this.xLength * dY);

        const dX = Math.abs(this.yRange[0]) / math.range(this.yRange);
        const oX = -(this.yLength / 2) + (this.yLength * dX);

        const xAxis = new NumberLine({
            length: this.xLength,
            range: this.xRange,
            showTicks: this.showXAxisTicks,
            showLabels: this.showXAxisLabels,
            tickStep: this.xAxisTickStep,
            tickSize: this.tickSize,
            tickLabelStandoff: this.tickLabelStandoff,
            labelSize: this.labelSize,
            showZero: false,
        }).shift([0, oX]);

        const yAxis = new NumberLine({
            length: this.yLength,
            range: this.yRange,
            showTicks: this.showYAxisTicks,
            showLabels: this.showYAxisLabels,
            tickStep: this.yAxisTickStep,
            tickSize: this.tickSize,
            tickLabelStandoff: this.tickLabelStandoff,
            labelSize: this.labelSize,
            rotation: Math.PI / 2,
            showZero: false,
        }).shift([oY, 0]);

        this.add(xAxis, yAxis);

        return this;
    }

    plot(fn: (x: number) => number, styleArgs: StyleArgs = {}): Shape {
        const points: Point[] = [];

        const minNumSteps = 200;
        const stepSize = math.range(this.xRange) / minNumSteps;
        const [yLow, yHigh] = this.yRange;
        const origin = this.origin();

        let prevY = fn(this.xRange[0]);

        for (let x = this.xRange[0]; x <= this.xRange[1]; x += stepSize) {
            // const y = fn(x);
            const [pX, pY] = math.add([x, fn(x)], origin) as Point;

            if (!Number.isFinite(pY)) {
                prevY = pY;
                continue;
            }

            if (pY >= yLow && pY <= yHigh) {
                if (prevY > yHigh || prevY < yLow) {
                    const tx = ((pX - stepSize) + pX) / 2;
                    const ty = fn(tx);

                    if (Number.isFinite(ty)) {
                        points.push([tx, fn(tx)]);
                    }
                } 

                points.push([pX, pY]);
            } 

            if ((prevY < yHigh && pY > yHigh) || (prevY > yLow && pY < yLow)) {
                const tx = ((pX - stepSize) + pX) / 2;
                const ty = fn(tx);

                if (Number.isFinite(ty)) {
                    points.push([tx, ty]);
                }
            }

            prevY = pY;
        }

        return new PointShape({ points: points, closePath: false, smooth: true, ...styleArgs });
    }

    area({ plot, xRange, opacity = 0.3 }: { plot: PointShape; xRange?: Range, opacity: number }): PointShape {
        const [rStart, rEnd] = xRange ?? this.xRange;
        const points = plot.computedPoints();
        const origin = this.origin();

        const areaPoints: Point[] = [];

        for (let i = 0; i < points.length; i++) {
            const [pX, pY] = math.subtract(points[i], origin) as Point;

            if (pX >= rStart && pX <= rEnd) {
                areaPoints.push([pX, pY]);
            }
        }

        // Have all the points along the line, need to draw back to the x-axis
        areaPoints.push([rEnd, 0], [rStart, 0]);
        const translatedPoints = areaPoints.map(p => math.add(p, origin) as Point);

        return new PointShape({ points: translatedPoints, closePath: true, smooth: false, lineColor: Colors.transparent(), color: colorWithOpacity(plot.lineColor(), opacity) });
    }

    private origin(): Point {
        const dY = Math.abs(this.xRange[0]) / math.range(this.xRange);
        const oY = -(this.xLength / 2) + (this.xLength * dY);

        const dX = Math.abs(this.yRange[0]) / math.range(this.yRange);
        const oX = -(this.yLength / 2) + (this.yLength * dX);

        return [oY, oX];
    }
}
