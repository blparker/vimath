import { Point, Prettify } from '@/base';
import { RGBA } from '@/colors';
import { Locatable, ShapeStyles, isLocatable, locatableToPoint } from '@/shapes/shape';
import { PointShape } from '@/shapes/primitives/bezier_point_shape';
import utils from '@/utils';


type LineCap = 'butt' | 'round' | 'square';
type LineStyles = { lineCap?: LineCap; };


class Line extends PointShape {
    private _lineCap: LineCap = 'butt';

    constructor(from: Locatable, to: Locatable);
    constructor(args: { from?: Locatable; to?: Locatable; } & Prettify<LineStyles & ShapeStyles>);
    constructor(from: Locatable | { from?: Locatable; to?: Locatable; } & Prettify<LineStyles & ShapeStyles>, to?: Locatable) {
        if (isLocatable(from) && isLocatable(to)) {
            super({ points: Line.fromPoints(from, to) });
        } else if (typeof from === 'object' && !Array.isArray(from) && 'from' in from && to === undefined) {
            const styles = utils.extractType<LineStyles & ShapeStyles>(from);
            const _from = from.from || [-1, 0];
            const _to = from.to || [1, 0];

            super({ points: Line.fromPoints(_from, _to), ...styles });

            if (styles.lineCap) {
                this._lineCap = styles.lineCap;
            }
        } else {
            throw new Error('Invalid arguments');
        }
    }

    changeColor(color: RGBA): this {
        super.changeColor(color);
        this.changeLineColor(color);

        return this;
    }

    lineCap(): LineCap {
        return this._lineCap;
    }

    private static fromPoints(from: Locatable, to: Locatable): Point[] {
        return [locatableToPoint(from), locatableToPoint(to)];
    }
}


export { Line, type LineStyles, type LineCap };
