import { Point, Range, X_TICKS, Y_TICKS } from "../base";
import { ComposableShape } from "./composed_shape";
import * as math from '../math';
import { Line, Shape } from "./base_shapes";
import { CanvasTextMetrics, Text, TextMetrics } from "./text";


export type AxesConfig = {
    xRange?: Range;
    yRange?: Range;
    xLength?: number;
    yLength?: number;
    showGridLines?: boolean;
    showAxisTicks?: boolean;
    showXAxisTicks?: boolean;
    showYAxisTicks?: boolean;
    showAxisLabels?: boolean;
    showXAxisLabels?: boolean;
    showYAxisLabels?: boolean;
    numXAxisTicks?: number;
    numYAxisTicks?: number;
    tickSize?: number;
    xAxisTickStep?: number;
    yAxisTickStep?: number;
    axisTextSize?: number;
    textMetrics?: TextMetrics;
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
    showAxisLabels: false,
    showXAxisLabels: false,
    showYAxisLabels: false,
    numXAxisTicks: 10,
    numYAxisTicks: 10,
    tickSize: 0.2,
    xAxisTickStep: 1,
    yAxisTickStep: 1,
    axisTextSize: 20,
    textMetrics: null,
} as const;

export class Axes extends ComposableShape {
    public readonly xRange: Range;
    public readonly xLength: number;
    public readonly yRange: Range;
    public readonly yLength: number;
    public readonly showXAxisTicks: boolean;
    public readonly showYAxisTicks: boolean;
    public readonly showXAxisLabels: boolean;
    public readonly showYAxisLabels: boolean;
    public readonly xAxisTickStep: number;
    public readonly yAxisTickStep: number;
    public readonly tickSize: number;
    public readonly labelSize: number;

    private readonly textMetrics: TextMetrics | null = null;
    private readonly tickLabelStandoff: number = 0.1;

    constructor(config?: AxesConfig) {
        super();

        const c = {...defaultAxesConfig, ...config};

        this.xRange = c.xRange ?? [-c.xLength / 2, c.xLength / 2];
        this.xLength = c.xLength;
        this.yRange = c.yRange ?? [-c.yLength / 2, c.yLength / 2];
        this.yLength = c.yLength;
        this.showXAxisTicks = c.showAxisTicks || c.showXAxisTicks;
        this.showYAxisTicks = c.showAxisTicks || c.showYAxisTicks;
        this.showXAxisLabels = c.showAxisLabels || c.showXAxisLabels;
        this.showYAxisLabels = c.showAxisLabels || c.showYAxisLabels;
        this.xAxisTickStep = c.xAxisTickStep;
        this.yAxisTickStep = c.yAxisTickStep;
        this.tickSize = c.tickSize;
        this.labelSize = c.axisTextSize;
        this.textMetrics = (this.showXAxisLabels || this.showYAxisLabels) ? (c.textMetrics ?? new CanvasTextMetrics()) : null;
    }

    public relativeOrigin(): Point {
        const xLeft = -this.xLength / 2;
        const yBottom = -this.yLength / 2;

        const pctLeft = Math.abs(this.xRange[0] / math.range(this.xRange));
        const pctBottom = Math.abs(this.yRange[0] / math.range(this.yRange));

        return [
            xLeft + (this.xLength * pctLeft),
            yBottom + (this.yLength * pctBottom)
        ];
    }

    compose(): ComposableShape {
        this.composeAxesTicks();
        this.composeAxes();

        return this;
    }

    private composeAxes() {
        const origin = this.relativeOrigin();

        const xAxis = new Line({ from: [this.xRange[0], 0], to: [this.xRange[1], 0] }).shift(origin);
        const yAxis = new Line({ from: [0, this.yRange[0]], to: [0, this.yRange[1]] }).shift(origin);

        this.add(xAxis, yAxis);
    }

    private composeAxesTicks() {
        if (!this.showXAxisTicks && !this.showYAxisTicks) {
            return;
        }

        const ht = this.tickSize / 2;
        // const [oX, oY] = this.relativeOrigin();
        // const xLabels = [];
        // const yLabels = [];
        const labels: [Point, number][] = [];
        const ticks: Point[] = [];

        if (this.showXAxisTicks) {
            for (let i = this.xRange[0]; i <= this.xRange[1]; i += this.xAxisTickStep) {
                if (i === 0) continue;
                ticks.push([i, 0]);
            }
        }

        if (this.showYAxisTicks) {
            for (let i = this.yRange[0]; i <= this.yRange[1]; i += this.yAxisTickStep) {
                if (i === 0) continue;
                ticks.push([0, i]);
            }
        }

        const numXDecimals = Math.min(math.mode(ticks.map(t => math.numDecimals(t[0]))), 5);
        const numYDecimals = Math.min(math.mode(ticks.map(t => math.numDecimals(t[1]))), 5);

        for (const [tX, tY] of ticks) {
            const [from, to]: [Point, Point] = tY === 0
                ? [[tX, tY - ht], [tX, tY + ht]]
                : [[tX - ht, tY], [tX + ht, tY]];

            const relFrom = this.relativeToOrigin(from);
            const relTo = this.relativeToOrigin(to);

            this.add(new Line({ from: relFrom, to: relTo }));

            if (this.showXAxisLabels && tY === 0) {
                this.add(new Text({
                    text: tX.toFixed(numXDecimals),
                    x: relFrom[0],
                    y: relFrom[1] - this.tickLabelStandoff,
                    align: 'center',
                    baseline: 'top',
                    size: this.labelSize,
                    textMetrics: this.textMetrics,
                }));
            } else if (this.showYAxisLabels && tX === 0) {
                this.add(new Text({
                    text: tY.toFixed(numYDecimals),
                    x: relFrom[0] - this.tickLabelStandoff,
                    y: relFrom[1],
                    align: 'right',
                    baseline: 'middle',
                    size: this.labelSize,
                    textMetrics: this.textMetrics,
                }));
            }
        }
    }

    private relativeToOrigin(p: Point): Point {
        const xScale = math.div(this.xLength, math.range(this.xRange));
        const yScale = math.div(this.yLength, math.range(this.yRange));

        return math.add(this.relativeOrigin(), [p[0] * xScale, p[1] * yScale]) as Point;
    }
}
