import { Locatable, ShapeStyles, defaultShapeStyles, isShape, locatableToPoint } from '@/shapes/shape';
import { ORIGIN, Prettify } from '@/base';
import { Colors } from '@/colors';
import { Circle } from './circle';


type DotArgs = { x?: number; y?: number; center?: Locatable; size?: number; selectable?: boolean; };
const DEFAULT_SIZE = 0.1;


class Dot extends Circle {
    constructor();
    constructor(center: Locatable);
    constructor(args: Prettify<DotArgs & ShapeStyles>);
    constructor(args?: Locatable | Prettify<DotArgs & ShapeStyles>) {
        let location = ORIGIN;
        let radius = DEFAULT_SIZE;
        let isSelectable = false;
        let styles: ShapeStyles = Object.assign({}, defaultShapeStyles, { color: defaultShapeStyles.lineColor ?? Colors.black() });

        if (args === undefined) {
            // do nothing
        } else if (Array.isArray(args)) {
            location = args;
        } else if (isShape(args)) {
            location = args.center();
        } else if (typeof args === 'object') {
            const { center, x, y, size, selectable, ...rest } = args;

            if (center !== undefined) {
                location = locatableToPoint(center);
            } else {
                location[0] = x ?? location[0];
                location[1] = y ?? location[1];
            }

            radius = size ?? DEFAULT_SIZE;
            isSelectable = selectable ?? false;

            styles = Object.assign({}, styles, rest);

            if (rest.lineColor) {
                styles.lineColor = rest.lineColor;
            } else {
                styles.lineColor = styles.color;
            }
        }

        super({ center: location, radius, selectable: isSelectable, ...styles });
    }
}


export { Dot };
