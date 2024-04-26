import { Line, LineStyles } from '@/shapes/primitives/line';
import { Plot } from '@/shapes/composed/plot';
import { ComposedShape } from '@/shapes/composed/composed_shape';
import { Shape, ShapeStyles } from '../shape';
import { Point, Prettify } from '@/base';


class TangentLine extends ComposedShape {
    private _plot: Plot;
    private _x: number;
    private _length: number;
    private _delta: number = 0.01;

    constructor({ plot, x, length, ...styles }: { plot: Plot; x: number; length?: number } & Prettify<ShapeStyles & LineStyles>) {
        if (!styles.lineColor && styles.color) {
            styles.lineColor = styles.color;
        }

        super(styles);

        this._plot = plot;
        this._x = x;
        this._length = length || 3;
    }

    compose(): Shape {
        const y1 = this._plot.valueAtX(this._x);
        const y2 = this._plot.valueAtX(this._x + this._delta);

        if (y1 !== null && y2 !== null) {
            const m = (y2 - y1) / this._delta;

            const from = [
                this._x + (this._length / (2 * Math.sqrt(1 + m ** 2))),
                m * (this._length / (2 * Math.sqrt(1 + m ** 2))) + y1
            ] as Point;

            const to = [
                this._x - (this._length / (2 * Math.sqrt(1 + m ** 2))),
                y1 - m * (this._length / (2 * Math.sqrt(1 + m ** 2)))
            ] as Point;

            this.add(new Line({ from, to, ...this.styles() }));
        }

        return this;
    }
}


export { TangentLine };
