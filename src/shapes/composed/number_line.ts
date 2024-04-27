import { ORIGIN, Point, Prettify, DOWN } from '@/base';
import { ComposedShape } from '@/shapes/composed/composed_shape';
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
    private _from: Point;
    private _to: Point;

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
        // super(Object.assign({}, styleArgs, { adjustForLineWidth: true }));
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

        const hl = this._length / 2;
        const from = [this._center[0] - hl, this._center[1]] as Point;
        const to = [this._center[0] + hl, this._center[1]] as Point;

        this._from = from;
        this._to = to;
    }

    compose(): this {
        const [from, to] = [this._from, this._to];
        const numTicks = Math.ceil((this._range[1] - this._range[0]) / this._tickStep);

        const pointWithRotation = (p: Point): Point => {
            const [cX, cY] = this._center;

            const [x, y] = p;
            const [xT, yT] = [x - cX, y - cY];

            const [xR, yR] = [
                xT * Math.cos(this._rotation) - yT * Math.sin(this._rotation),
                xT * Math.sin(this._rotation) + yT * Math.cos(this._rotation)
            ];

            return [xR + cX, yR + cY] as Point;
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

        if (this._leftTip || this._rightTip) {
            const bothEnds = this._leftTip && this._rightTip;
            this.add(new Arrow({ from: pointWithRotation(from), to: pointWithRotation(to), bothEnds, ...this.styles() }));
        } else {
            this.add(new Line({ from: pointWithRotation(from), to: pointWithRotation(to), ...Object.assign({}, this._lineStyles, this.styles()) }));
        }

        return this;
    }

    pointOnLine(x: number): Point {
        const p = Math.abs(x - this._range[0]) / Math.abs(this._range[1] - this._range[0]);
        return [
            math.lerp(-this._length / 2, this._length / 2, p),
            0
        ];
    }

    from(): Point {
        return this._from;
    }

    to(): Point {
        return this._to;
    }
}

export { NumberLine, type NumberLineArgs };
