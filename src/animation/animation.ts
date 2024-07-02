import math from '@/math';
import { config } from '@/config';
import { EasingFunction } from '@/animation/easing';
import { Shape } from '@/shapes/shape';


interface Animation {
    tick(deltaTime: number): void;
    update(pctComplete: number, starting: boolean): void;
    isComplete(): boolean;
    isReversing(): boolean;
    isRunning(): boolean;
    shouldBlock(): boolean;
    renderDependencies(): Shape[];
}


function isAnimation(o: any): o is Animation {
    return 'tick' in o && typeof o.tick === 'function' && 
           'update' in o && typeof o.update === 'function';
}


/**
 * Arguments common to all animations
 */
type AnimationArgs = {
    duration?: number;
    reverse?: boolean;
    repeat?: boolean;
    yoyo?: boolean;
    easing?: EasingFunction;
    numberOfTimes?: number;
    blocking?: boolean;
};

const animConfig = config.animation;


abstract class BaseAnimation implements Animation {
    private _complete: boolean = false;
    private _reversing: boolean = false;
    private _startTime: number = -Infinity;
    private _timesThrough: number = 0;

    private _duration: number;
    private _reverse: boolean;
    private _repeat: boolean;
    private _yoyo: boolean;
    private _numberOfTimes: number;
    private _blocking: boolean;

    protected _easing: EasingFunction;
    public id: string = Math.random().toString(36).substring(2);


    constructor({
        duration = animConfig.durationMs,
        reverse = animConfig.reverse,
        repeat = animConfig.repeat,
        yoyo = animConfig.yoyo,
        easing = animConfig.easing,
        numberOfTimes = animConfig.numberOfTimes,
        blocking = animConfig.blocking
    }: AnimationArgs = {}) {
        this._duration = duration;
        this._reverse = reverse;
        this._repeat = repeat;
        this._yoyo = yoyo;
        this._easing = easing;
        this._numberOfTimes = numberOfTimes;
        this._blocking = blocking;
    }

    tick(time: number): void {
        if (this._complete) return;

        const starting = !Number.isFinite(this._startTime);
        if (starting) {
            this._startTime = time;
        }

        let pctComplete = math.invlerp(this._startTime, this._startTime + this._duration, time);
        this.update(this._easing(this._reversing ? 1 - pctComplete : pctComplete), starting);

        if (pctComplete < 1 && time < this._startTime + this._duration) {
            return;
        }

        // Trigger one last update call with pctComplete set to 1
        if (!this._complete && !this._yoyo) {
            this.update(this._easing(1), false);
        }

        this._handleCompletion(time);
    }

    private _handleCompletion(time: number): void {
        if (this._repeat || (Number.isFinite(this._numberOfTimes) && this._timesThrough < this._numberOfTimes)) {
            this._handleRepetition(time);
        } else {
            this._complete = true;
        }
    }

    private _handleRepetition(time: number): void {
        if (this._yoyo) {
            this._timesThrough += 0.5;
        } else {
            ++this._timesThrough;
        }

        // Check if the animation should still repeat
        if (this._numberOfTimes > 0 && this._timesThrough >= this._numberOfTimes) {
            this._complete = true;
            return;
        }

        this._reversing = this._yoyo && !this._reversing;
        this._startTime = time;
    }

    abstract update(pctComplete: number, starting: boolean): void;

    isComplete(): boolean {
        return this._complete;
    }

    isReversing(): boolean {
        return this._reversing;
    }

    isRunning(): boolean {
        return this._startTime >= 0 && !this._complete;
    }

    startReverse(): boolean {
        return this._reverse;
    }

    renderDependencies(): Shape[] {
        return [];
    }

    shouldBlock(): boolean {
        return this._blocking;
    }
}


export { type Animation, BaseAnimation, type AnimationArgs, isAnimation };
