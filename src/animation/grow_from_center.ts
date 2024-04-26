import { AnimationArgs, BaseAnimation } from '@/animation/animation';
import { Shape, isShape } from '@/shapes';
import { PointShape } from '@/shapes/primitives/point_shape';


class GrowFromCenter extends BaseAnimation {
    private _target: Shape;
    // private _targetScale = 0;
    // private _totalScale = 1;
    private _origScale = 0;

    constructor(args: Shape | { target: Shape } & AnimationArgs) {
        if (isShape(args)) {
            super();
            this._target = args;
        } else {
            super(args);
            this._target = args.target;
        }

        // this._targetCopy = this._target.copy();
    }

    update(pctComplete: number, starting: boolean): void {
        if (starting) {
            this._origScale = this._target.currentScale();
            this._target.scale(0);
        }

        const targetScale = this._origScale * pctComplete;
        const currScale = this._target.currentScale();

        if (currScale === 0) {
            this._target.scale(targetScale);
        } else {
            const diffScale = targetScale / currScale;
            this._target.scale(diffScale);
        }
    }

    renderDependencies(): Shape[] {
        return [this._target];
    }
}


export { GrowFromCenter };
