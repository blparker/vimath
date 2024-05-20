import { AnimationArgs, BaseAnimation } from '@/animation/animation';
import { EasingFunction } from './easing';


type UpdateFn = (pctComplete: number, starting: boolean) => void;


class Updater extends BaseAnimation {
    private _fn: UpdateFn;

    constructor(updateFn: UpdateFn);
    constructor(updateFn: UpdateFn, duration?: number, easing?: EasingFunction);
    constructor(updateFn: UpdateFn, args?: AnimationArgs);
    constructor(updateFn: UpdateFn, durationOrArgs?: number | AnimationArgs, easing?: EasingFunction) {
        if (typeof durationOrArgs === 'number') {
            super({ duration: durationOrArgs, easing });
        } else {
            super(durationOrArgs);
        }

        this._fn = updateFn;
    }

    update(pctComplete: number, starting: boolean): void {
        this._fn(pctComplete, starting);
    }
}


export { Updater };
