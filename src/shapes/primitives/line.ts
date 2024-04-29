import { Point, Prettify } from '@/base';
<<<<<<< HEAD
import * as math from '@/math';
import { Shape, StyleArgs, isShape } from '@/shapes/shape';
import { PointShape } from './point_shape';



export class Line extends PointShape {
    constructor({ from, to, length = undefined, ...styleArgs }: { from: Point | Shape; to: Point | Shape; length?: number; } & Prettify<StyleArgs>) {
        if (isShape(from)) {
            from = from.center();
        }

        if (isShape(to)) {
            to = to.center();
        }

        if (length !== undefined) {
            const dist = math.distance(from, to);

            function magnitude(p: Point): number {
                return Math.sqrt(Math.pow(p[0], 2) + Math.pow(p[1], 2));
            }

            if (length > dist) {
                const ab = [to[0] - from[0], to[1] - from[1]] as Point;
                const u = [ab[0] / magnitude(ab), ab[1] / magnitude(ab)];
                const scaledU = math.scalarMultiply(u, length / 2);
                const midPoint = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];

                from = math.subtract(midPoint, scaledU) as Point;
                to = math.add(midPoint, scaledU) as Point;
            }
        }

        super({ points: Line.points(from, to), ...styleArgs });
    }

    private static points(from: Point, to: Point): Point[] {
        return [from, to];
    }
}
=======
import { RGBA } from '@/colors';
import { Locatable, ShapeStyles, isLocatable, locatableToPoint } from '@/shapes/shape';
import { PointShape } from '@/shapes/primitives/point_shape';
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
>>>>>>> refactor/master
