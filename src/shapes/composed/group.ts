import { Shape } from '@/shapes/shape'
import { ComposedShape } from './composed_shape';
import { ORIGIN, Point, RIGHT } from '@/base';
import math from '@/math';
import { config } from '@/config';


class Group extends ComposedShape {
    constructor(...shapes: Shape[]) {
        super();
        this.add(...shapes);
    }

    arrange(): this;
    arrange(direction?: Point, buff?: number): this;
    arrange({ direction, buff }: { direction?: Point, buff?: number }): this;
    arrange(args?: Point | { direction?: Point, buff?: number }, buff?: number): this {
        let dir: Point = RIGHT();
        let buffer = buff ?? config.standoff;

        if (Array.isArray(args)) {
            dir = args;
        } else if (args !== undefined) {
            dir = args.direction ?? dir;
            buffer = args.buff ?? buffer;
        }

        // dir = math.addVector(dir, buffer);
        const shapes = this.composedShapes();

        for (let i = 0; i < shapes.length - 1; i++) {
            const [s1, s2] = [shapes[i], shapes[i + 1]];
            s2.nextTo(s1, dir, buffer);
        }

        this.moveTo(ORIGIN);

        return this;
    }
}


export { Group };
