import { Point, Prettify } from '@/base';
import { RGBA } from '@/colors';
import { Locatable, ShapeStyles, isLocatable, locatableToPoint } from '@/shapes/shape';
import { PointShape } from '@/shapes/primitives/point_shape';
import utils from '@/utils';
import math from '@/math';


type LineCap = 'butt' | 'round' | 'square';
type LineStyles = { lineCap?: LineCap; };


class Line extends PointShape {
    private _lineCap: LineCap = 'butt';

    constructor(from: Locatable, to: Locatable);
    constructor(args: { from?: Locatable; to?: Locatable; } & Prettify<LineStyles & ShapeStyles>);
    constructor(from: Locatable | { from?: Locatable; to?: Locatable; length?: number } & Prettify<LineStyles & ShapeStyles>, to?: Locatable) {
        if (isLocatable(from) && isLocatable(to)) {
            super({ points: Line.fromPoints(from, to) });
        } else if (typeof from === 'object' && !Array.isArray(from) && 'from' in from && to === undefined) {
            const styles = utils.extractType<LineStyles & ShapeStyles>(from);
            const _from = from.from || [-1, 0];
            const _to = from.to || [1, 0];

            super({ points: Line.fromPoints(_from, _to, from.length), ...styles });

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

    private static fromPoints(from: Locatable, to: Locatable, length?: number): Point[] {
        if (length === undefined) {
            return [locatableToPoint(from), locatableToPoint(to)];
        } else {
            const [fx, fy] = locatableToPoint(from);
            const [tx, ty] = locatableToPoint(to);

            const [mx, my] = math.midpoint([fx, fy], [tx, ty]);
            const [ux, uy] = math.unitVec([fx, fy], [tx, ty]);

            const fromPt = [
                mx - ux * length / 2,
                my - uy * length / 2
            ] as Point;

            const toPt = [
                mx + ux * length / 2,
                my + uy * length / 2
            ] as Point;

            return [fromPt, toPt];
        }
    }
}


export { Line, type LineStyles, type LineCap };
