import { Prettify } from '@/base';
import { PointShape, ShapeStyles } from '@/shapes/primitives/point_shape';
import { Locatable } from '@/shapes/shape';


class Arc extends PointShape {
    constructor({ from, to, ...styleArgs }: { from: Locatable, to: Locatable } & Prettify<ShapeStyles>) {
        super({ points: [], ...styleArgs });
    }

    // private static fromPoints(from: Locatable, to: Locatable): Point[] {
    //     return [
    //         isShape(from) ? from.center() : from,
    //         isShape(to) ? to.center() : to
    //     ];
    // }
}


export { Arc };
