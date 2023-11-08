import { X_TICKS, Y_TICKS, Range, Point, VAlign, HAlign } from "../base";
import { ComposableShape } from "./composed_shape";
import * as math from '../math';
import { Line } from "./base_shapes";
import { Text } from "./text";


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
};


const defaultNumberLineArgs = {
    length: X_TICKS,
    range: [-X_TICKS / 2, X_TICKS / 2] as Range,
    showTicks: true,
    showLabels: true,
    tickSize: 0.2,
    tickLabelStandoff: 0.1,
    labelSize: 20,
    tickStep: 1,
    rotation: 0,
    center: [0, 0] as Point,
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
    // private readonly center: Point;


    constructor({ length, range, showTicks, showLabels, tickSize, tickLabelStandoff, labelSize, tickStep, rotation, center }: NumberLineArgs = {}) {
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
        // this.center = center ?? defaultNumberLineArgs.center;
    }

    compose(): ComposableShape {
        const rotateAboutCenter = (p: Point): Point => {
            const [x, y] = p;

            return [
                x * Math.cos(this.rotation) - y * Math.sin(this.rotation),
                x * Math.sin(this.rotation) + y * Math.cos(this.rotation)
            ];
        };

        // const startLine = [-this.length / 2, 0];
        // const endLine = [this.length / 2, 0];

        // let [sX, sY] = [-this.length / 2, 0];
        // let [eX, eY] = [this.length / 2, 0];

        // [sX, sY] = [
        //     sX * Math.cos(this.rotation) - sY * Math.sin(this.rotation),
        //     sX * Math.sin(this.rotation) + sY * Math.cos(this.rotation)
        // ];

        // [eX, eY] = [
        //     eX * Math.cos(this.rotation) - eY * Math.sin(this.rotation),
        //     eX * Math.sin(this.rotation) + eY * Math.cos(this.rotation)
        // ];

        this.add(new Line({
            from: rotateAboutCenter([-this.length / 2, 0]),
            to: rotateAboutCenter([this.length / 2, 0]),
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
            const p = math.distance(this.range[0], i) / math.range(this.range);
            const x = math.lerp(-this.length / 2, this.length / 2, p);

            ticks.push([i, x]);
        }

        const numDecimals = Math.min(math.mode(ticks.map(l => math.numDecimals(l[0]))), 5);
        for (const [label, x] of ticks) {
            if (this.showTicks) {
                console
                this.add(new Line({ from: rotateAboutCenter([x, -ht]), to: rotateAboutCenter([x, ht]) }));
            }

            if (this.showLabels) {
                let [rX, rY] = rotateAboutCenter([x, 0]);

                // let align: HAlign = 'center';
                // let baseline: VAlign = 'top';
                let align: HAlign = 'center';
                let baseline: VAlign = 'middle';
                let horizShift = 0;
                let vertShift = -ht - this.tickLabelStandoff;

                if (this.rotation >= Math.PI / 4 && this.rotation <= 3 * Math.PI / 4) {
                    // align = 'right';
                    // baseline = 'middle';
                    // vertShift = 0;
                    // horizShift = -ht - this.tickLabelStandoff;
                }

                horizShift = vertShift = 0;

                const lX = 0.4 * Math.sin(this.rotation);
                const lY = 0.4 * Math.cos(this.rotation);

                this.add(new Text({
                    text: label.toFixed(numDecimals),
                    // x: rX + horizShift,
                    // y: rY + vertShift,
                    x: rX + lX,
                    y: rY - lY,
                    align,
                    baseline,
                    size: this.labelSize
                }));
            }
        }

        return this;
    }
}
