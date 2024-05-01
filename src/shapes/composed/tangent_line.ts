import { Line, LineStyles } from '@/shapes/primitives/line';
import { Plot } from '@/shapes/composed/plot';
import { ComposedShape } from '@/shapes/composed/composed_shape';
import { ShapeStyles } from '../shape';
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

    compose(): this {
        const [x1, y1] = this._plot.pointAtX(this._x)!;
        const [x2, y2] = this._plot.pointAtX(this._x + this._delta)!;
        const m = (y2 - y1) / (x2 - x1);
        const p = this._length / (2 * Math.sqrt(1 + m ** 2));

        const from = [
            x1 - p,
            y1 - m * p
        ] as Point;

        const to = [
            x1 + p,
            m * p + y1
        ] as Point;

        this.add(new Line({ from, to, ...this.styles() }));

        return this;
    }
}


export { TangentLine };
