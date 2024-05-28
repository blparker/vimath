import { ORIGIN, Point, Prettify, DOWN } from '@/base';
import { ComposedShape } from './composed_shape';
import { ShapeStyles } from '@/shapes/shape';
import { Text } from '@/shapes/primitives/text';
import { Arrow } from '@/shapes/composed/arrow';
import math from '@/math';
import { Line, LineStyles } from '@/shapes/primitives/line';
import { config } from '@/config';


type NumberLineArgs = {
    length?: number;
    range?: [number, number];
    center?: Point;
    showTicks?: boolean;
    showLabels?: boolean;
    tickSize?: number;
    tickLabelStandoff?: number;
    labelSize?: number;
    tickStep?: number;
    rotation?: number;
    axisLabel?: string;
    axisLabelSize?: number;
    excludeNumbers?: number[];
    includeTips?: boolean;
    labelDirection?: [number, number];
    lineStyles?: LineStyles;
    leftTip?: boolean;
    rightTip?: boolean;
};


class NumberLine extends ComposedShape {
    private _length: number;
    private _range: [number, number]
    private _center: Point;
    private _showTicks: boolean;
    private _showLabels: boolean;
    private _tickSize: number;
    private _tickLabelStandoff: number;
    private _labelSize: number;
    private _tickStep: number;
    private _rotation: number;
    private _excludeNums: number[];
    private _labelDirection: [number, number];
    private _lineStyles: LineStyles;
    private _leftTip: boolean;
    private _rightTip: boolean;

    constructor({
        length = 8,
        range = [-10, 10],
        center = ORIGIN,
        showTicks = true,
        showLabels = true,
        tickSize = 0.1,
        tickLabelStandoff = 0.3,
        labelSize = config.text.size,
        tickStep = 1,
        rotation = 0,
        axisLabel,
        axisLabelSize,
        excludeNumbers = [],
        includeTips = false,
        leftTip = false,
        rightTip = false,
        labelDirection = DOWN(),
        lineStyles = {},
        ...styleArgs
    }: NumberLineArgs & Prettify<ShapeStyles> = {}) {
        super({ ...styleArgs });

        this._length = length;
        this._range = range;
        this._center = center;
        this._showTicks = showTicks;
        this._showLabels = showLabels;
        this._tickSize = tickSize;
        this._tickLabelStandoff = tickLabelStandoff;
        this._labelSize = labelSize;
        this._tickStep = tickStep;
        this._rotation = rotation;
        this._excludeNums = excludeNumbers;
        this._leftTip = includeTips || leftTip;
        this._rightTip = includeTips || rightTip;
        this._labelDirection = labelDirection;
        this._lineStyles = lineStyles;
    }

    compose(): this {
        const numTicks = Math.ceil((this._range[1] - this._range[0]) / this._tickStep);

        const pointWithRotation = (p: Point): Point => {
            const [x, y] = p;

            const [xR, yR] = [
                x * Math.cos(this._rotation) - y * Math.sin(this._rotation),
                x * Math.sin(this._rotation) + y * Math.cos(this._rotation)
            ];

            return [xR, yR] as Point;
        };

        const textLabel = (label: number, pos: number): Text => {
            let labelPos = pointWithRotation([pos, 0]) as Point;
            labelPos = math.addVec(labelPos, math.multScalar(this._labelDirection, this._tickLabelStandoff));

            const align = this._labelDirection[0] === 0 ? 'center' : (this._labelDirection[0] > 0 ? 'left' : 'right');
            const baseline = this._labelDirection[1] === 0 ? 'middle' : (this._labelDirection[1] > 0 ? 'bottom' : 'top');

            return new Text({
                text: label.toString(),
                center: labelPos,
                baseline,
                align,
                size: this._labelSize,
                ...this.styles()
            });
        };

        const tick = (num: number): Line => {
            return new Line({ from: pointWithRotation([num, tickSize]), to: pointWithRotation([num, -tickSize]), ...this.styles() })
        };

        const tickSize = this._tickSize;
        const hl = this._length / 2;

        for (let i = 0; i <= numTicks; i++) {
            const num = this._range[0] + i * this._tickStep;
            if (this._excludeNums.includes(num)) {
                continue;
            }

            const lContraction = this._leftTip ? 0.5 : 0;
            const rContraction = this._rightTip ? 0.5 : 0;
            const rNum = math.remap(this._range[0], this._range[1], -hl + lContraction, hl - rContraction, num);

            if (this._showTicks) {
                this.add(tick(rNum));
            }

            if (this._showLabels) {
                this.add(textLabel(num, rNum));
            }
        }

        const from = [-hl, 0] as Point;
        const to = [hl, 0] as Point;

        if (this._leftTip || this._rightTip) {
            const bothEnds = this._leftTip && this._rightTip;
            this.add(new Arrow({ from: pointWithRotation(from), to: pointWithRotation(to), bothEnds, ...this.styles() }));
        } else {
            this.add(new Line({ from: pointWithRotation(from), to: pointWithRotation(to), ...Object.assign({}, this._lineStyles, this.styles()) }));
        }

        this.shift(this._center);

        return this;
    }

    pointOnLine(x: number): Point {
        const lContraction = this._leftTip ? 0.5 : 0;
        const rContraction = this._rightTip ? 0.5 : 0;
        const hl = this._length / 2;

        const rNum = math.remap(this._range[0], this._range[1], -hl + lContraction, hl - rContraction, x);
        return math.addVec(this.rotatePoint([rNum, 0]), this._center);
    }

    shift(...shifts: Point[]): this {
        super.shift(...shifts);
        const totalShift = shifts.reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]);
        this._center = math.addVec(this._center, totalShift);

        return this;
    }

    from(): Point {
        const hl = this._length / 2;
        const from = [-hl, 0] as Point;

        return math.addVec(this.rotatePoint(from), this._center);
    }

    to(): Point {
        const hl = this._length / 2;
        const to = [hl, 0] as Point;
        return math.addVec(this.rotatePoint(to), this._center);
    }

    private rotatePoint(p: Point): Point {
        const [x, y] = p;
        const cosTheta = Math.cos(this._rotation);
        const sinTheta = Math.sin(this._rotation);

        // Rotating point around the origin
        const xR = x * cosTheta - y * sinTheta;
        const yR = x * sinTheta + y * cosTheta;

        return [xR, yR];
    }
}

export { NumberLine, type NumberLineArgs };
