import { BezierSegment } from '@/base';
import { ComposedShape } from '@/shapes/composed/composed_shape';
import { PointShape } from '@/shapes/primitives/point_shape';


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

    compose(): this {
        for (const subplot of this._subplots) {
            this.add(subplot);
        }

        return this;
    }

    valueAtX(x: number): number | null {
        return this._fn(x)[1];
    }

    *points(): Generator<BezierSegment> {
        for (const subplot of this._subplots) {
            for (const point of subplot.points()) {
                yield point;
            }
        }
    }
}


export { Plot };
