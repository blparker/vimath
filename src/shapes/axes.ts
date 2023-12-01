import { Point, Range, X_TICKS, Y_TICKS } from '../base';
import { ComposableShape } from './composed_shape';
import * as math from '../math';
import { Line, PointShape, Shape, StyleArgs } from './base_shapes';
import { TextMetrics } from './text';
import { NumberLine } from './number_line';
import { Colors, colorWithOpacity } from '../colors';
import { Group } from './group';


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
    showGridLines?: boolean;
    xAxisLabel?: string;
    yAxisLabel?: string;
};

const defaultAxesConfig = {
    xRange: [-X_TICKS / 2, X_TICKS / 2] as Range,
    yRange: [-Y_TICKS / 2, Y_TICKS / 2] as Range,
    xLength: X_TICKS,
    yLength: Y_TICKS,
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
    tickLabelStandoff: 0.2,
    showGridLines: false,
    xAxisLabel: undefined,
    yAxisLabel: undefined,
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
    private readonly showGridLines: boolean;
    private readonly xAxisLabel?: string;
    private readonly yAxisLabel?: string;

    private xAxis?: NumberLine = undefined;
    private yAxis?: NumberLine = undefined;

    constructor({ xLength, yLength, xRange, yRange, showAxisTicks, showXAxisTicks, showYAxisTicks, showAxisLabels, showXAxisLabels, showYAxisLabels, tickSize, tickLabelStandoff, labelSize, xAxisTickStep, yAxisTickStep, showGridLines, xAxisLabel, yAxisLabel }: AxesConfig = {}) {
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
        this.showGridLines = showGridLines ?? defaultAxesConfig.showGridLines;
        this.xAxisLabel = xAxisLabel ?? defaultAxesConfig.xAxisLabel;
        this.yAxisLabel = yAxisLabel ?? defaultAxesConfig.yAxisLabel;
    }

    compose(): ComposableShape {
        const [oY, oX] = this.origin();

        this.xAxis = new NumberLine({
            length: this.xLength,
            range: this.xRange,
            showTicks: this.showXAxisTicks,
            showLabels: this.showXAxisLabels,
            tickStep: this.xAxisTickStep,
            tickSize: this.tickSize,
            tickLabelStandoff: this.tickLabelStandoff,
            labelSize: this.labelSize,
            showZero: false,
            axisLabel: this.xAxisLabel,
        }).shift([0, oX]) as NumberLine;

        this.yAxis = new NumberLine({
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
            axisLabel: this.yAxisLabel,
        }).shift([oY, 0]) as NumberLine;

        if (this.showGridLines) {
            const lX = this.xAxis!.left()[0];
            const rX = this.xAxis!.right()[0];
            const [bY, tY] = [this.yAxis!.bottom()[1], this.yAxis!.top()[1]];

            for (let x = this.xRange[0]; x <= this.xRange[1]; x += this.xAxisTickStep) {
                const tX = this.xAxis!.pointAlongLine(x)[0];
                this.add(new Line({ from: [tX, bY], to: [tX, tY], color: Colors.gray({ opacity: 0.2 }), lineWidth: 1, }));
            }

            for (let y = this.yRange[0]; y <= this.yRange[1]; y += this.yAxisTickStep) {
                const tY = this.yAxis!.pointAlongLine(y)[0];
                this.add(new Line({ from: [lX, tY], to: [rX, tY], color: Colors.gray({ opacity: 0.2 }), lineWidth: 1, }));
            }
        }

        // this.add(new Group(this.xAxis, this.yAxis));
        this.add(this.xAxis, this.yAxis);

        return this;
    }

    plot(fn: (x: number) => number, styleArgs: StyleArgs = {}): Shape {
        const points: Point[] = [];

        const minNumSteps = 200;
        // const minNumSteps = 10;
        const stepSize = math.range(this.xRange) / minNumSteps;
        const [yLow, yHigh] = this.yRange;
        // const origin = this.origin();

        let prevY = fn(this.xRange[0]);

        function pointAlongLine(x: number, range: Range, length: number): number {
            const p = math.distance(range[0], x) / math.range(range);
            return math.lerp(-length / 2, length / 2, p);
        }

        for (let x = this.xRange[0]; x <= this.xRange[1]; x += stepSize) {
            let [pX, pY] = [x, fn(x)];

            // pX = math.remap(this.xRange[0], this.xRange[1], -this.xLength / 2, this.xLength / 2, x);
            // pY = math.remap(this.yRange[0], this.yRange[1], -this.yLength / 2, this.yLength / 2, fn(x));

            // let [pX, pY] = math.add([x, fn(x)], origin) as Point;
            // pX = pointAlongLine(pX, this.xRange, this.xLength);
            // pY = pointAlongLine(pY, this.yRange, this.yLength);
            // console.log(x, fn(x), '->', pX, pY, this.xAxis!.pointAlongLine(pX))

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

        const translatedPoints = points.map(([pX, pY]) => {
            return [
                math.remap(this.xRange[0], this.xRange[1], -this.xLength / 2, this.xLength / 2, pX),
                math.remap(this.yRange[0], this.yRange[1], -this.yLength / 2, this.yLength / 2, pY)
            ] as Point;
        });

        return new PointShape({ points: translatedPoints, closePath: false, smooth: true, ...styleArgs });
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

    top(): Point {
        this.composedShapes();

        const lX = this.xAxis!.left()[0];
        const rX = this.xAxis!.right()[0];
        const tY = this.yAxis!.top()[1];

        return [(lX + rX) / 2, tY];
    }

    bottom(): Point {
        this.composedShapes();

        const lX = this.xAxis!.left()[0];
        const rX = this.xAxis!.right()[0];
        const tY = this.yAxis!.bottom()[1];

        return [(lX + rX) / 2, tY];
    }

    left(): Point {
        this.composedShapes();

        const lX = this.xAxis!.left()[0];
        const tY = this.yAxis!.top()[1];
        const bY = this.yAxis!.bottom()[1];

        return [lX, (tY + bY) / 2];
    }

    right(): Point {
        this.composedShapes();

        const rX = this.xAxis!.right()[0];
        const tY = this.yAxis!.top()[1];
        const bY = this.yAxis!.bottom()[1];

        return [rX, (tY + bY) / 2];
    }

    private origin(): Point {
        const dY = Math.abs(this.xRange[0]) / math.range(this.xRange);
        const oY = -(this.xLength / 2) + (this.xLength * dY);

        const dX = Math.abs(this.yRange[0]) / math.range(this.yRange);
        const oX = -(this.yLength / 2) + (this.yLength * dX);

        return [oY, oX];
    }
}
