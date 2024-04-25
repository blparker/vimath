import { ORIGIN, Prettify } from '@/base';
import { Arc } from '../primitives/bezier_arc';
import { Locatable, ShapeStyles } from '@/shapes/shape';


type CircleArgs = { center?: Locatable; radius?: number; selectable?: boolean; };
const defaultCircleArgs: CircleArgs = { center: ORIGIN, radius: 1, selectable: false };


class Circle extends Arc {
    constructor();
    constructor(center: Locatable);
    constructor(radius: number);
    constructor(args: Prettify<CircleArgs & ShapeStyles>);
    constructor(args?: Locatable | number | Prettify<CircleArgs & ShapeStyles>) {
        if (args === undefined) {
            super(defaultCircleArgs);
        } else if (typeof args === 'number') {
            super(Object.assign({}, defaultCircleArgs, { radius: args }));
        } else {
            super(Object.assign({}, defaultCircleArgs, args));
        }
    }
}


export { Circle, type CircleArgs };

