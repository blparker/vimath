import { Animation, AnimationArgs, BaseAnimation } from '@/animation/animation';
import { Shape } from '..';


class AnimationGroup extends BaseAnimation {
    private _animations: Animation[];

    constructor({ animations, ...args }: { animations: Animation[] } & AnimationArgs) {
        super(args);
        this._animations = animations;
    }

    tick(time: number): void {
        // console.log("### ", this._animations[0].isComplete())
        for (const a of this._animations) {
            a.tick(time);
        }
    }

    update(pctComplete: number, starting: boolean): void {
        for (const a of this._animations) {
            a.update(pctComplete, starting);
        }
    }

    isComplete(): boolean {
        return this._animations.every(a => a.isComplete());
    }

    renderDependencies(): Shape[] {
        return this._animations.flatMap(a => a.renderDependencies());
    }

    numAnimations(): number {
        return this._animations.length;
    }
}


export { AnimationGroup };
