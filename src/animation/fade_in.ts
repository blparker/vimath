import { AnimationArgs, BaseAnimation } from '@/animation/animation';
import { RGBA } from '@/colors';
import { Shape, isShape } from '@/shapes';
import { lerp } from '@/math';


class FadeIn extends BaseAnimation {
    private _target: Shape;
    private _fromColor: RGBA = [0, 0, 0, 0];

    constructor(args: Shape | { target: Shape } & AnimationArgs) {
        if (isShape(args)) {
            super();
            this._target = args;
        } else {
            super(args);
            this._target = args.target;
        }
    }

    update(pctComplete: number, starting: boolean): void {
        if (starting) {
            this._fromColor = structuredClone(this._target.styles().color!);
        }

        const [from, to] = this.isReversing() || this.startReverse() ? [1, 0] : [0, 1];
        const updatedOpacity = lerp(from, to, this._easing(pctComplete))

        this._fromColor[3] = updatedOpacity;
        this._target.changeColor(this._fromColor);
    }

    renderDependencies(): Shape[] {
        return [this._target];
    }
}


export { FadeIn };
