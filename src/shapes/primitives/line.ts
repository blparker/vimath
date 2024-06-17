import { Point, Prettify } from '@/base';
import { RGBA } from '@/colors';
import { Locatable, ShapeStyles, isLocatable, locatableToPoint } from '@/shapes/shape';
import { PointShape } from './point_shape';
import utils from '@/utils';
import math from '@/math';


type LineCap = 'butt' | 'round' | 'square';
type LineStyles = { lineCap?: LineCap; };

const defaultLineArgs = {
    from: [-1, 0] as Point,
    to: [1, 0] as Point,
    lineCap: 'butt' as LineCap
};


class Line extends PointShape {
    private _lineCap: LineCap;

    constructor();
    constructor(from: Locatable, to: Locatable);
    constructor(args: { from?: Locatable; to?: Locatable; } & Prettify<LineStyles & ShapeStyles>);
    constructor(from?: Locatable | { from?: Locatable; to?: Locatable; length?: number } & Prettify<LineStyles & ShapeStyles>, to?: Locatable) {
        let _from: Locatable = defaultLineArgs.from;
        let _to: Locatable = defaultLineArgs.to;
        let lineCap = defaultLineArgs.lineCap;
        let styles: LineStyles & ShapeStyles = {};
        let length: number | undefined = undefined;

        if (from === undefined && to === undefined) {
            // Do nothing, allow the default values to be used
        } else if (isLocatable(from) && isLocatable(to)) {
            _from = from;
            _to = to;

            // super({ points: Line.fromPoints(from, to) });
        } else if (typeof from === 'object' && !Array.isArray(from) && 'from' in from && to === undefined) {
            styles = utils.extractType<LineStyles & ShapeStyles>(from);
            // const _from = from.from || [-1, 0];
            // const _to = from.to || [1, 0];
            // _from = from.from || [-1, 0];
            _from = from.from ?? _from;
            _to = from.to ?? _to;
            length = from.length;

            // super({ points: Line.fromPoints(_from, _to, from.length), ...styles });

            if (styles.lineCap) {
                // this._lineCap = styles.lineCap;
                lineCap = styles.lineCap;
            }
        } else {
            throw new Error('Invalid arguments');
        }

        super({ points: Line.fromPoints(_from, _to, length), ...styles });
        this._lineCap = lineCap;
    }

    changeColor(color: RGBA): this {
        super.changeColor(color);
        this.changeLineColor(color);

        return this;
    }

    lineCap(): LineCap {
        return this._lineCap;
    }

    from(): Point {
        return this.points()[0][0]!;
    }

    to(): Point {
        return this.points()[0][3]!;
    }

    changeEndpoints(from: Locatable, to: Locatable): this {
        const currentFrom = this.from();
        const currentTo = this.to();

        const length = math.dist(currentFrom, currentTo);
        this.changePoints(Line.fromPoints(from, to, length));

        return this;
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
