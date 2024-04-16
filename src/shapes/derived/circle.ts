import { ORIGIN, Prettify } from '@/base';
import { Arc } from '@/shapes/primitives/arc';
import { Locatable, ShapeStyles } from '@/shapes/shape';


type CircleArgs = { center?: Locatable; radius?: number; selectable?: boolean; };


class Circle extends Arc {
    constructor({ center = ORIGIN, radius = 2, selectable = false, ...styleArgs }: Prettify<CircleArgs & ShapeStyles> = {}) {
        super({ center, radius, startAngle: 0, endAngle: 2 * Math.PI, selectable, ...styleArgs });
    }
}


export { Circle, type CircleArgs };
