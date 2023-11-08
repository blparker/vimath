import { X_TICKS, Y_TICKS, Range, Point, VAlign, HAlign } from '../base';
import { ComposableShape } from './composed_shape';
import * as math from '../math';
import { Line } from './base_shapes';
import { Text } from './text';


type NumberLineArgs = {
    length?: number;
    range?: Range;
    showTicks?: boolean;
    showLabels?: boolean;
    tickSize?: number;
    tickLabelStandoff?: number;
    labelSize?: number;
    tickStep?: number;
    rotation?: number;
    center?: Point;
    showZero?: boolean;
};


const defaultNumberLineArgs = {
    length: X_TICKS,
    range: [-X_TICKS / 2, X_TICKS / 2] as Range,
    showTicks: true,
    showLabels: true,
    tickSize: 0.2,
    tickLabelStandoff: 0.4,
    labelSize: 20,
    tickStep: 1,
    rotation: 0,
    center: [0, 0] as Point,
    showZero: true,
} as const;


export class NumberLine extends ComposableShape {
    private readonly length: number;
    private readonly range: Range;
    private readonly showTicks: boolean;
    private readonly showLabels: boolean;
    private readonly tickSize: number;
    private readonly tickLabelStandoff: number;
    private readonly labelSize: number;
    private readonly tickStep: number;
    private readonly rotation: number;
    private readonly centerPoint: Point;
    private readonly showZero: boolean;


    constructor({ length, range, showTicks, showLabels, tickSize, tickLabelStandoff, labelSize, tickStep, rotation, center, showZero }: NumberLineArgs = {}) {
        super();

        this.length = length ?? defaultNumberLineArgs.length;
        this.range = range ?? (length ? [-length / 2, length / 2] : defaultNumberLineArgs.range);
        this.showTicks = showTicks ?? defaultNumberLineArgs.showTicks;
        this.showLabels = showLabels ?? defaultNumberLineArgs.showLabels;
        this.tickSize = tickSize ?? defaultNumberLineArgs.tickSize;
        this.tickLabelStandoff = tickLabelStandoff ?? defaultNumberLineArgs.tickLabelStandoff;
        this.labelSize = labelSize ?? defaultNumberLineArgs.labelSize;
        this.tickStep = tickStep ?? defaultNumberLineArgs.tickStep;
        this.rotation = rotation ?? defaultNumberLineArgs.rotation;
        this.centerPoint = center ?? defaultNumberLineArgs.center;
        this.showZero = showZero ?? defaultNumberLineArgs.showZero;
    }

    compose(): ComposableShape {
        const rotateAboutCenter = (p: Point): Point => {
            const [x, y] = p;

            return [
                x * Math.cos(this.rotation) - y * Math.sin(this.rotation),
                x * Math.sin(this.rotation) + y * Math.cos(this.rotation)
            ];
        };

        const translate = (p: Point): Point => {
            return [p[0] + this.centerPoint[0], p[1] + this.centerPoint[1]];
        };

        this.add(new Line({
            from: translate(rotateAboutCenter([-this.length / 2, 0])),
            to: translate(rotateAboutCenter([this.length / 2, 0])),
        }));

        if (!this.showTicks && !this.showLabels) {
            return this;
        }

        const ht = this.tickSize / 2;
        const ticks = [];
        let [start, end] = this.range;

        const numTicks = Math.floor(math.range(this.range) / this.tickStep) + 1;
        if (numTicks % 2 === 0) {
            const newRange = (numTicks - 2) * this.tickStep;
            const diff = math.range(this.range) - newRange;

            start += diff / 2;
            end -= diff / 2;
        }

        for (let i = start; i <= end; i += this.tickStep) {
            if (i === 0 && !this.showZero) {
                continue;
            }

            const p = math.distance(this.range[0], i) / math.range(this.range);
            const x = math.lerp(-this.length / 2, this.length / 2, p);

            ticks.push([i, x]);
        }

        const numDecimals = Math.min(math.mode(ticks.map(l => math.numDecimals(l[0]))), 5);
        for (const [label, x] of ticks) {
            if (this.showTicks) {
                this.add(new Line({ from: translate(rotateAboutCenter([x, -ht])), to: translate(rotateAboutCenter([x, ht])) }));
            }

            if (this.showLabels) {
                let [rX, rY] = translate(rotateAboutCenter([x, 0]));

                let align: HAlign = 'center';
                let baseline: VAlign = 'middle';
                let tickDirection = 1;

                if (this.rotation > Math.PI / 4 && this.rotation < 3 * Math.PI / 4) {
                    tickDirection = -1;
                    align = 'right';
                    baseline = 'middle';
                }

                const lX = rX + tickDirection * this.tickLabelStandoff * Math.sin(this.rotation);
                const lY = rY - tickDirection * this.tickLabelStandoff * Math.cos(this.rotation);

                this.add(new Text({
                    text: label.toFixed(numDecimals),
                    x: lX,
                    y: lY,
                    align,
                    baseline,
                    size: this.labelSize
                }));
            }
        }

        return this;
    }
}