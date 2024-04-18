import { AnimationArgs, BaseAnimation } from '@/animation/animation';
import { PointShape, Shape, isShape } from '@/shapes';


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
        if (starting) {
        }

        if (this._target instanceof PointShape && this._targetCopy instanceof PointShape) {
            this._target.interpolate(this._targetCopy, pctComplete);
        }
    }

    renderDependencies(): Shape[] {
        return [this._target];
    }
}


export { Create };
