import { Point, Prettify } from '@/base';
import { RGBA } from '@/colors';
import { PointShape, ShapeStyles } from '@/shapes/primitives/point_shape';
import { Locatable, Shape, isShape } from '@/shapes/shape';


class Line extends PointShape {
    constructor({ from, to, ...styleArgs }: { from: Locatable, to: Locatable } & Prettify<ShapeStyles>) {
        super({ points: Line.fromPoints(from, to), ...styleArgs });
    }

    changeColor(color: RGBA): Shape {
        super.changeColor(color);
        this.changeLineColor(color);

        return this;
    }

    private static fromPoints(from: Locatable, to: Locatable): Point[] {
        return [
            isShape(from) ? from.center() : from,
            isShape(to) ? to.center() : to
        ];
    }
}


export { Line };
