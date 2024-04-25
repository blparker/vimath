import { Shape } from '@/shapes/shape';
import { ComposedShape } from '@/shapes/composed/composed_shape';
import { PointShape } from '@/shapes/primitives/bezier_point_shape';
import { Point } from '@/base';


class Plot extends ComposedShape {
    private _subplots: PointShape[] = [];
    private _fn: (x: number) => [number, number | null];

    constructor(fn: (x: number) => [number, number | null]) {
        super();
        this._fn = fn;
    }

    addSubplot(shape: PointShape): void {
        this._subplots.push(shape);
    }

    compose(): Shape {
        for (const subplot of this._subplots) {
            this.add(subplot);
        }

        return this;
    }

    valueAtX(x: number): number | null {
        return this._fn(x)[1];
    }

    // *points(): Generator<Point> {
    //     for (const subplot of this._subplots) {
    //         for (const point of subplot.points()) {
    //             yield point;
    //         }
    //     }
    // }
}


export { Plot };
