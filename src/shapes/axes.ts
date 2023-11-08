import { Point, Range, X_TICKS, Y_TICKS } from '../base';
import { ComposableShape } from './composed_shape';
import * as math from '../math';
import { Line, Shape } from './base_shapes';
import { CanvasTextMetrics, Text, TextMetrics } from './text';
import { NumberLine } from './number_line';


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
    tickLabelStandoff: 0.4,
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

        // this.xRange = config?.xRange ?? (config?.xLength !== undefined ? [-c.xLength / 2, c.xLength / 2] : defaultAxesConfig.xRange);
        // this.xLength = config?.xLength ?? (config?.xRange !== undefined ? math.range(c.xRange) : defaultAxesConfig.xLength);
        // this.yRange = config?.yRange ?? (config?.yLength !== undefined ? [-c.yLength / 2, c.yLength / 2] : defaultAxesConfig.yRange);
        // this.yLength = config?.yLength ?? (config?.yRange !== undefined ? math.range(c.yRange) : defaultAxesConfig.yLength);
        // this.showXAxisTicks = config?.showAxisTicks ?? config?.showXAxisTicks ?? defaultAxesConfig.showAxisTicks;
        // this.showYAxisTicks = config?.showAxisTicks ?? config?.showYAxisTicks ?? defaultAxesConfig.showAxisTicks;
        // this.showXAxisLabels = config?.showAxisLabels ?? config?.showXAxisLabels ?? defaultAxesConfig.showXAxisLabels;
        // this.showYAxisLabels = config?.showAxisLabels ?? config?.showYAxisLabels ?? defaultAxesConfig.showYAxisLabels;

        this.xRange = config?.xRange ?? [-c.xLength / 2, c.xLength / 2];
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


type AxesConfig2 = {
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
};


export class Axes2 extends ComposableShape {
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

    constructor({ xLength, yLength, xRange, yRange, showAxisTicks, showXAxisTicks, showYAxisTicks, showAxisLabels, showXAxisLabels, showYAxisLabels, tickSize, tickLabelStandoff, labelSize, xAxisTickStep, yAxisTickStep }: AxesConfig2 = {}) {
        super();

        this.xLength = xLength ?? defaultAxesConfig.xLength;
        this.yLength = yLength ?? defaultAxesConfig.yLength;
        this.xRange = xRange ?? (xLength !== undefined ? [-xLength / 2, xLength / 2] : defaultAxesConfig.xRange);
        this.yRange = yRange ?? (yLength !== undefined ? [-yLength / 2, yLength / 2] : defaultAxesConfig.yRange);
        this.showXAxisTicks = showXAxisTicks ?? showAxisTicks ?? defaultAxesConfig.showXAxisTicks;
        this.showYAxisTicks = showYAxisTicks ?? showAxisTicks ?? defaultAxesConfig.showYAxisTicks;
        this.showXAxisLabels = showXAxisLabels ?? showAxisLabels ?? defaultAxesConfig.showXAxisLabels;
        this.showYAxisLabels = showYAxisLabels ?? showAxisLabels ?? defaultAxesConfig.showYAxisLabels;
        this.tickSize = tickSize ?? defaultAxesConfig.tickSize;
        this.tickLabelStandoff = tickLabelStandoff ?? 0.1;
        this.labelSize = labelSize ?? defaultAxesConfig.axisTextSize;
        this.xAxisTickStep = xAxisTickStep ?? defaultAxesConfig.xAxisTickStep;
        this.yAxisTickStep = yAxisTickStep ?? defaultAxesConfig.yAxisTickStep;
    }

    compose(): ComposableShape {
        const dY = Math.abs(this.xRange[0]) / math.range(this.xRange);
        const rY = -(this.xLength / 2) + (this.xLength * dY);

        const dX = Math.abs(this.yRange[0]) / math.range(this.yRange);
        const rX = -(this.yLength / 2) + (this.yLength * dX);

        this.composeAxesLines(rX, rY);
        this.composeTicks(rX, rY);
        this.composeLabels(rX, rY);

        return this;
    }

    private composeAxesLines(rX: number, rY: number) {
        this.add(new Line({ from: [-this.xLength / 2, rX], to: [this.xLength / 2, rX] }));
        this.add(new Line({ from: [rY, -this.yLength / 2], to: [rY, this.yLength / 2] }));
    }

    private composeTicks(rX: number, rY: number) {
        const ht = this.tickSize / 2;

        if (this.showXAxisTicks) {
            /*for (let i = 0; i <= this.xLength; i += this.xAxisTickStep) {
                const x = -(this.xLength / 2) + i;

                if (x === rY) {
                    continue;
                }

                this.add(new Line({ from: [x, rX - ht], to: [x, rX + ht] }));
            }*/
            let [xStart, xEnd] = this.xRange;

            const numTicks = Math.floor(math.range(this.xRange) / this.xAxisTickStep) + 1;
            if (numTicks % 2 === 0) {
                const newRange = (numTicks - 2) * this.xAxisTickStep;
                const diff = math.range(this.xRange) - newRange;

                xStart += diff / 2;
                xEnd -= diff / 2;
            }

            for (let i = this.xRange[0]; i <= this.xRange[1]; i += this.xAxisTickStep) {
                if (i === 0) continue;
                const p = math.distance(this.xRange[0], i) / math.range(this.xRange);
                const x = math.lerp(-this.xLength / 2, this.xLength / 2, p);

                // const x = -(this.xLength / 2) + (this.xLength * (i / math.range(this.xRange)));
                // this.add(new Line({ from: [x, rX - ht], to: [x, rX + ht] }));
                this.add(new Line({ from: [x, rX - ht], to: [x, rX + ht] }));
            }
        }

        if (this.showYAxisTicks) {
            /*for (let i = 0; i <= this.yLength; i += this.yAxisTickStep) {
                const y = -(this.yLength / 2) + i;

                if (y === rX) {
                    continue;
                }

                this.add(new Line({ from: [rY - ht, y], to: [rY + ht, y] }));
            }*/
            let [yStart, yEnd] = this.yRange;

            const numTicks = Math.floor(math.range(this.yRange) / this.yAxisTickStep) + 1;
            if (numTicks % 2 === 0) {
                const newRange = (numTicks - 2) * this.yAxisTickStep;
                const diff = math.range(this.yRange) - newRange;

                yStart += diff / 2;
                yEnd -= diff / 2;
            }
            // console.log(yStart, yEnd)

            for (let i = yStart; i <= yEnd; i += this.yAxisTickStep) {
                if (i === 0) continue;
                const p = math.distance(this.yRange[0], i) / math.range(this.yRange);
                const y = math.lerp(-this.yLength / 2, this.yLength / 2, p);

                // const x = -(this.xLength / 2) + (this.xLength * (i / math.range(this.xRange)));
                // this.add(new Line({ from: [x, rX - ht], to: [x, rX + ht] }));
                this.add(new Line({ from: [rY - ht, y], to: [rY + ht, y] }));
            }
        }
    }

    private composeLabels(rX: number, rY: number) {
        const ht = this.tickSize / 2;
        const labelStyles = { size: this.labelSize };

        if (this.showXAxisLabels) {
            const xLabels = [];
            let [xStart, xEnd] = this.xRange;

            const numTicks = Math.floor(math.range(this.xRange) / this.xAxisTickStep) + 1;
            if (numTicks % 2 === 0) {
                const newRange = (numTicks - 2) * this.xAxisTickStep;
                const diff = math.range(this.xRange) - newRange;

                xStart += diff / 2;
                xEnd -= diff / 2;
            }

            for (let i = xStart; i <= xEnd; i += this.xAxisTickStep) {
                if (i === 0) continue;
                const p = math.distance(this.xRange[0], i) / math.range(this.xRange);
                const x = math.lerp(-this.xLength / 2, this.xLength / 2, p);

                // this.add(new Line({ from: [i, rX - ht], to: [i, rX + ht] }));
                xLabels.push([i, x]);
            }

            const numDecimals = Math.min(math.mode(xLabels.map(l => math.numDecimals(l[0]))), 5);
            for (const [label, x] of xLabels) {
                this.add(new Text({ text: label.toFixed(numDecimals), x, y: rX - ht - this.tickLabelStandoff, baseline: 'top', ...labelStyles }));
            }
        }

        if (this.showYAxisLabels) {
            const yLabels = [];
            let [yStart, yEnd] = this.yRange;

            const numTicks = Math.floor(math.range(this.yRange) / this.yAxisTickStep) + 1;
            if (numTicks % 2 === 0) {
                const newRange = (numTicks - 2) * this.yAxisTickStep;
                const diff = math.range(this.yRange) - newRange;

                yStart += diff / 2;
                yEnd -= diff / 2;
            }

            for (let i = yStart; i <= yEnd; i += this.yAxisTickStep) {
                if (i === 0) continue;
                const p = math.distance(this.yRange[0], i) / math.range(this.yRange);
                const y = math.lerp(-this.yLength / 2, this.yLength / 2, p);

                yLabels.push([i, y]);
            }

            const numDecimals = Math.min(math.mode(yLabels.map(l => math.numDecimals(l[0]))), 5);
            for (const [label, y] of yLabels) {
                this.add(new Text({ text: label.toFixed(numDecimals), x: rY - ht - this.tickLabelStandoff, y, align: 'right', baseline: 'middle', ...labelStyles }));
            }
        }
    }
}


export class Axes3 extends ComposableShape {
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

    constructor({ xLength, yLength, xRange, yRange, showAxisTicks, showXAxisTicks, showYAxisTicks, showAxisLabels, showXAxisLabels, showYAxisLabels, tickSize, tickLabelStandoff, labelSize, xAxisTickStep, yAxisTickStep }: AxesConfig2 = {}) {
        super();

        this.xLength = xLength ?? defaultAxesConfig.xLength;
        this.yLength = yLength ?? defaultAxesConfig.yLength;
        this.xRange = xRange ?? (xLength !== undefined ? [-xLength / 2, xLength / 2] : defaultAxesConfig.xRange);
        this.yRange = yRange ?? (yLength !== undefined ? [-yLength / 2, yLength / 2] : defaultAxesConfig.yRange);
        this.showXAxisTicks = showXAxisTicks ?? showAxisTicks ?? defaultAxesConfig.showXAxisTicks;
        this.showYAxisTicks = showYAxisTicks ?? showAxisTicks ?? defaultAxesConfig.showYAxisTicks;
        this.showXAxisLabels = showXAxisLabels ?? showAxisLabels ?? defaultAxesConfig.showXAxisLabels;
        this.showYAxisLabels = showYAxisLabels ?? showAxisLabels ?? defaultAxesConfig.showYAxisLabels;
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

        console.log(oX, oY)

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
}
