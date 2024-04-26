import { AnimationArgs, BaseAnimation } from '@/animation/animation';
import { Shape, isShape } from '@/shapes';
import { PointShape } from '@/shapes/primitives/point_shape';


class Create extends BaseAnimation {
    private _target: Shape;
    private _targetCopy: Shape;

    constructor(args: Shape | { target: Shape } & AnimationArgs) {
        if (isShape(args)) {
            super();
            this._target = args;
        } else {
            super(args);
            this._target = args.target;
        }

        this._targetCopy = this._target.copy();
    }

    update(pctComplete: number, starting: boolean): void {
        if (this._target instanceof PointShape && this._targetCopy instanceof PointShape) {
            // this._target.partial(this._targetCopy, pctComplete);
            this._target.partial(this._targetCopy, pctComplete);

            if (pctComplete >= 1) {
                // console.log(this._target.bezierPoints());
            }
        }
    }

    renderDependencies(): Shape[] {
        return [this._target];
    }
}


export { Create };
