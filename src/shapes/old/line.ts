import { Point, Prettify } from '@/base';
import { RGBA } from '@/colors';
import { PointShape, ShapeStyles } from '@/shapes/old/point_shape';
import { Locatable, Shape, locatableToPoint } from '@/shapes/shape';


type LineCap = 'butt' | 'round' | 'square';

type LineStyles = {
    lineCap?: LineCap;
};


class Line extends PointShape {
    private _lineCap: LineCap;

    constructor({ from = [-1, 0], to = [1, 0], ...styleArgs }: { from?: Locatable; to?: Locatable; } & Prettify<ShapeStyles & LineStyles> = {}) {
        super({ points: Line.fromPoints(from, to), ...styleArgs });

        this._lineCap = styleArgs.lineCap || 'butt';
    }

    changeColor(color: RGBA): Shape {
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
