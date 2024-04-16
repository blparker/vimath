import { ORIGIN, Point, Prettify, DOWN } from '@/base';
import { ComposedShape } from '@/shapes/composed/composed_shape';
import { Shape, ShapeStyles } from '@/shapes/shape';
import { Line, LineStyles } from '@/shapes/primitives/line';
import { Text } from '@/shapes/primitives/text';
import { Arrow } from '@/shapes/composed/arrow';
import math from '@/math';


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
    includeTip?: boolean;
    labelDirection?: [number, number];
    lineStyles?: LineStyles;
};


class NumberLine extends ComposedShape {
    private _length: number;
    private _range: [number, number]
    private _center: Point;

    private _tickStep: number;
    private _tickLabelStandoff: number;
    private _rotation: number;
    private _excludeNums: number[];
    private _includeTip: boolean;
    private _labelDirection: [number, number];
    private _lineStyles: LineStyles;

    constructor({ length = 8, range = [-10, 10], center = ORIGIN, showTicks, showLabels, tickSize, tickLabelStandoff = 0.3, labelSize, tickStep = 1, rotation = 0, axisLabel, axisLabelSize, excludeNumbers = [], includeTip = false, labelDirection = DOWN(), lineStyles = {}, ...styleArgs }: NumberLineArgs & Prettify<ShapeStyles> = {}) {
        // super(Object.assign({}, styleArgs, { adjustForLineWidth: true }));
        super({ ...styleArgs });

        this._length = length;
        this._range = range;
        this._center = center;
        this._tickStep = tickStep;
        this._tickLabelStandoff = tickLabelStandoff;
        this._rotation = rotation;
        this._excludeNums = excludeNumbers;
        this._includeTip = includeTip;
        this._labelDirection = labelDirection;
        this._lineStyles = lineStyles;
    }

    compose(): Shape {
        const hl = this._length / 2;
        const from = [this._center[0] - hl, this._center[1]] as Point;
        const to = [this._center[0] + hl, this._center[1]] as Point;

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

            return new Text({ text: label.toString(), center: labelPos, baseline, align, ...this.styles() })
        };


        for (let i = 0; i <= numTicks; i++) {
            const num = this._range[0] + i * this._tickStep;
            if (this._excludeNums.includes(num)) {
                continue;
            }

            const rNum = math.remap(this._range[0], this._range[1], -hl, hl, num);

            this.add(new Line({ from: pointWithRotation([rNum, 0.1]), to: pointWithRotation([rNum, -0.1]), ...this.styles() }));
            this.add(textLabel(num, rNum));
        }

        if (this._includeTip) {
            this.add(new Arrow({ from: pointWithRotation(from), to: pointWithRotation(to), bothEnds: true, ...this.styles() }));
        } else {
            this.add(new Line({ from: pointWithRotation(from), to: pointWithRotation(to), ...Object.assign({}, this._lineStyles, this.styles()) }));
        }

        return this;
    }
}

export { NumberLine, type NumberLineArgs };
