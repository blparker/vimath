import { ORIGIN, Prettify } from '@/base';
import { Arc } from '../primitives/arc';
import { Locatable, ShapeStyles, isLocatable } from '@/shapes/shape';


type CircleArgs = { center?: Locatable; radius?: number; selectable?: boolean; };
const defaultCircleArgs: CircleArgs = { center: ORIGIN, radius: 1, selectable: false };


class Circle extends Arc {
    constructor();
    constructor(center: Locatable);
    constructor(radius: number);
    constructor(args: Prettify<CircleArgs & ShapeStyles>);
    constructor(args?: Locatable | number | Prettify<CircleArgs & ShapeStyles>) {
        let circleArgs = structuredClone(defaultCircleArgs);

        if (args !== undefined) {
            if (isLocatable(args)) {
                circleArgs.center = args;
            } else if (typeof args === 'number') {
                circleArgs.radius = args;
            } else {
                circleArgs = { ...circleArgs, ...args };
            }
        }

        super(circleArgs);
    }
}


export { Circle, type CircleArgs };

