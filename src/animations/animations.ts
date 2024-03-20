import { Point, Shift } from '@/base';
import { RGBA } from '@/colors';
import { Easing, EasingFunction } from '@/easing';
import * as math from '@/math';
import { arrLerp, distance, lerp } from '@/math';
import { PointsAware, Shape, Styleable, isShape } from '@/shapes/shape';


export type AnimationArgs = {
    duration: number;
    easing?: EasingFunction;
    repeat?: boolean;
    yoyo?: boolean;
}


export function isAnimation(o: any): o is Animation {
    return 'update' in o && 'tick' in o;
}


export type Animatable = Shape | Styleable;


export abstract class Animation {
    private _duration: number;
    private _easing: EasingFunction;
    private _startTime: number | null = null;
    private _emittedFinal: boolean = false;
    protected _reversing: boolean = false;
    private _repeat: boolean = false;
    private _yoyo: boolean = false;
    private _cycle: number = 0;

    constructor({ duration = 1000, easing = Easing.easeInOutCubic, repeat = false, yoyo = true }: AnimationArgs) {
        this._duration = duration;
        this._easing = easing;
        this._repeat = repeat;
        this._yoyo = yoyo;
    }

    /**
     * Implemented by subclasses to perform animation operations.
     * @param delta the percentage complete of the animation (with respect to the start time and duration)
     */
    abstract update(pctComplete: number, reversing: boolean): Animatable[];

    /**
     * Resets the animation to initial state
     */
    abstract resetState(): void;

    reset(): void {
        this._startTime = null;
        this._emittedFinal = false;
        this._reversing = false;

        this.resetState();
    }

    /**
     * Called for every frame tick of the animation
     * @param time the current time (used for calculating elapsed time)
     * @returns a list of shapes that the animation worked on
     */
    tick(time: number): Animatable[] {
        if (this._startTime === null) {
            this.initState();
            this._startTime = time;
        }

        const pctComplete = math.invlerp(this._startTime, this._startTime + this._duration, time);
        if (pctComplete >= 1) {
            if (!this._repeat && this._emittedFinal) {
                return [];
            }

            const isReversed = this._reversing;

            if (this._repeat) {
                this._startTime = time;

                if (this._yoyo) {
                    this._reversing = !this._reversing;
                } else {
                    this.resetState();
                }

                this._cycle += 1;
            } else if (!this._emittedFinal) {
                this._emittedFinal = true;
            }

            return this.update(1, isReversed);
        } else {
            return this.update(pctComplete, this._reversing);
        }
    }

    isRunning(): boolean {
        return this._startTime !== null;
    }

    isComplete(time: number): boolean {
        if (this._startTime === null || (this._startTime !== null && this._repeat)) {
            return false;
        }

        const pctComplete = math.invlerp(this._startTime, this._startTime + this._duration, time);
        return pctComplete >= 1;
    }

    updateWithEase(v1: number, v2: number, d: number): number;
    updateWithEase(v1: number[], v2: number[], d: number): number[];
    updateWithEase(v1: unknown, v2: unknown, d: number): unknown {
        if (Array.isArray(v1) && Array.isArray(v2)) {
            return arrLerp(v1, v2, this._easing(d))
        } else if (typeof v1 === 'number' && typeof v2 === 'number') {
            return lerp(v1, v2, this._easing(d));
        } else {
            throw new Error(`Unexpected types - v1: ${typeof v1}, v2: ${typeof v2}`);
        }
    }

    reverse() {
        this._startTime = null;
        this._emittedFinal = false;
        this._reversing = true;
    }

    protected start(time: number) {
        this._startTime = time;
    }

    protected initState() {
        // Set up any state
    }
}


export interface TargetAnimation<T> {
    target(): T;
}


export function isTargetAnimation<T>(o: any): o is TargetAnimation<T> {
    return 'target' in o && typeof o.target === 'function';
}


type MoveToTargetArgs = { target: Shape, destination: Shape | Point, alongPath?: Point[] | PointsAware } & AnimationArgs;

export class MoveToTarget extends Animation implements TargetAnimation<Shape> {
    private _target: Shape;
    private startLocation: Point
    private endLocation: Point

    private pathObj?: Point[] | PointsAware;
    private path?: Point[];

    constructor({ target, destination, alongPath, ...baseConfig }: MoveToTargetArgs) {
        super(baseConfig);

        this._target = target;
        this.startLocation = this._target.center();
        this.endLocation = isShape(destination) ? destination.center() : destination;
        this.pathObj = alongPath;
    }

    update(pctComplete: number, reversing: boolean): Animatable[] {
        // const [start, end] = reversing ? [this.endLocation, this.startLocation] : [this.startLocation, this.endLocation];

        // const [nX, nY] = this.updateWithEase(start, end, pctComplete);
        const [nX, nY] = this.getNewPoint(pctComplete, reversing);
        this._target.moveCenter([nX, nY]);

        return [this._target];
    }

    private getNewPoint(pctComplete: number, reversing: boolean): Point {
        if (this.path && this.path.length > 0) {
            const [from, to] = reversing ? [this.path.length, 0] : [0, this.path.length];

            const idxWithEase = this.updateWithEase(from, to, pctComplete);
            const idx = Math.floor(idxWithEase);

            if (idx < this.path.length - 1) {
                const [pt, nextPt] = [this.path[idx], this.path[idx + 1]];

                return arrLerp(pt, nextPt, idxWithEase - idx) as Point;
            } else {
                return this.path[Math.min(idx, this.path.length - 1)];
            }
        } else {
            const [start, end] = reversing ? [this.endLocation, this.startLocation] : [this.startLocation, this.endLocation];
            return this.updateWithEase(start, end, pctComplete) as Point;
        }
    }

    protected initState(): void {
        this.startLocation = this._target.center();

        if (this.pathObj) {
            const pathPoints = Array.isArray(this.pathObj) ? this.pathObj : this.pathObj.points();

            // Find the closest point along the path to the start and end locations
            let [minStartDist, pathStart] = [Number.MAX_VALUE, -1];
            let [minEndDist, pathEnd] = [Number.MAX_VALUE, -1];

            for (let i = 0; i < pathPoints.length; i++) {
                const pt = pathPoints[i];
                const ds = distance(pt, this.startLocation);
                const dt = distance(pt, this.endLocation);

                if (ds < minStartDist) {
                    minStartDist = ds;
                    pathStart = i;
                }

                if (dt < minEndDist) {
                    minEndDist = dt;
                    pathEnd = i;
                }
            }

            let segment = pathPoints.slice(Math.min(pathStart, pathEnd), Math.max(pathStart, pathEnd));
            if (pathStart > pathEnd) {
                segment = segment.toReversed();
            }

            this.path = segment;
        }
    }

    resetState(): void {
        this._target.moveCenter(this.startLocation);
    }

    target(): Shape {
        return this._target;
    }
}


type ShiftArgs = { target: Shape, shifts: Shift | Shift[] } & AnimationArgs;

export class ShiftTarget extends MoveToTarget {
    constructor({ target, shifts, ...baseConfig }: ShiftArgs) {
        const dest = ShiftTarget.getDestination(target.center(), shifts);
        super({ target, destination: dest, ...baseConfig });
    }

    private static getDestination(center: Point, shifts: Shift | Shift[]): Point {
        let totalShift: Shift;

        if (Array.isArray(shifts) && shifts.every(Array.isArray)) {
            totalShift = [0, 0];
            for (const shift of (shifts as Shift[])) {
                totalShift = math.add(totalShift, shift) as Shift;
            }
        } else {
            totalShift = shifts as Shift;
        }

        return math.add(center, totalShift) as Point;
    }
}


type ScaleArgs = { target: Shape, scaleAmount: number } & AnimationArgs;

export class Scale extends Animation {
    private target: Shape;
    private scaleAmount: number;
    private startScale: number;

    constructor({ target, scaleAmount, ...baseConfig }: ScaleArgs) {
        super(baseConfig);

        this.target = target;
        this.scaleAmount = scaleAmount;
        this.startScale = target.currentScale;
    }

    update(pctComplete: number, reversing: boolean): Animatable[] {
        const [from, to] = reversing ? [this.scaleAmount, this.startScale] : [this.startScale, this.scaleAmount];

        const newScale = this.updateWithEase(from, to, pctComplete);
        this.target.scale(newScale);

        return [this.target];
    }

    resetState(): void {
        this.target.scale(this.startScale);
    }
}


type ChangeColorArgs = { target: Styleable, toColor: RGBA } & AnimationArgs;

export class ChangeFillColor extends Animation {
    private target: Styleable;
    private fromColor: RGBA;
    private toColor: RGBA;

    constructor({ target, toColor, ...baseConfig }: ChangeColorArgs) {
        super(baseConfig);

        this.target = target;
        this.fromColor = target.color();
        this.toColor = toColor;
    }

    update(pctComplete: number, reversing: boolean): Animatable[] {
        const [from, to] = reversing ? [this.toColor, this.fromColor] : [this.fromColor, this.toColor];

        const updatedColor = this.updateWithEase(from, to, pctComplete) as RGBA;
        this.target.changeColor(updatedColor);

        return [this.target];
    }

    resetState(): void {
        this.target.changeColor(this.fromColor);
    }
}


export class ChangeLineColor extends Animation {
    private target: Styleable;
    private toColor: RGBA;

    private fromColor?: RGBA;

    constructor({ target, toColor, ...baseConfig }: ChangeColorArgs) {
        super(baseConfig);

        this.target = target;
        this.fromColor = target.lineColor();
        this.toColor = toColor;
    }

    update(pctComplete: number, reversing: boolean): (Shape | Styleable)[] {
        if (!this.fromColor) return [];

        const [from, to] = reversing ? [this.toColor, this.fromColor] : [this.fromColor, this.toColor];
        const updatedColor = this.updateWithEase(from, to, pctComplete) as RGBA;
        this.target.changeLineColor(updatedColor);

        return [this.target];
    }

    initState() {}

    resetState(): void {
        if (!this.fromColor) return;

        this.target.changeLineColor(this.fromColor);
    }
}


type MoveAlongPathArgs = { target: Shape, path: Point[] | PointsAware } & AnimationArgs;

export class MoveAlongPath extends Animation {
    private target: Shape;
    private pathObj: Point[] | PointsAware;
    // private path: Point[];
    private startPoint?: Point = undefined;
    private path?: Point[] = undefined;

    constructor({ target, path, ...baseConfig }: MoveAlongPathArgs) {
        super(baseConfig);

        this.target = target;
        this.pathObj = path;
    }

    update(pctComplete: number, reversing: boolean): Animatable[] {
        if (!this.path) {
            return [];
        }

        const [from, to] = reversing ? [this.path.length, 0] : [0, this.path.length];
        const idx = Math.floor(this.updateWithEase(from, to, pctComplete))
        const point = this.path[Math.min(idx, this.path.length - 1)];

        this.target.moveCenter(point);

        return [this.target];
    }

    protected initState(): void {
        this.path = Array.isArray(this.pathObj) ? this.pathObj : this.pathObj.points();
        this.startPoint = this.target.center();
    }

    resetState(): void {
        if (this.startPoint) {
            this.target.moveCenter(this.startPoint);
        }
    }
}


type OrbitArgs = { target: Shape, center: Point } & AnimationArgs;

export class Orbit extends Animation {
    private target: Shape;
    private center: Point;

    private startAngle?: number = undefined;
    private distance?: number = undefined;
    private targetStartPoint?: Point = undefined;

    constructor({ target, center, ...baseConfig }: OrbitArgs) {
        super(baseConfig);

        this.target = target;
        this.center = center;
    }

    update(pctComplete: number): Animatable[] {
        if (this.startAngle !== undefined && this.distance !== undefined) {
            const endAngle = this.startAngle + Math.PI * 2;
            const updatedVal = this.updateWithEase(this.startAngle, endAngle, pctComplete);

            const x = this.center[0] + Math.cos(updatedVal) * this.distance;
            const y = this.center[1] + Math.sin(updatedVal) * this.distance;

            this.target.moveCenter([x, y]);
        }

        return [this.target];
    }

    resetState(): void {
        if (this.targetStartPoint) {
            this.target.moveCenter(this.targetStartPoint);
        }
    }

    protected initState(): void {
        this.targetStartPoint = this.target.center();
        this.distance = distance(this.targetStartPoint, this.center);
        this.startAngle = Math.atan2(this.targetStartPoint[1] - this.center[1], this.targetStartPoint[0] - this.center[0]);
    }
}


type RotateArgs = { target: Shape, angle: number } & AnimationArgs;

export class Rotate extends Animation {
    private target: Shape;
    private angle: number;
    private startAngle: number;

    constructor({ target, angle, ...baseConfig }: RotateArgs) {
        super(baseConfig);

        this.target = target;
        this.angle = angle;
        this.startAngle = target.angle;
    }

    update(pctComplete: number, reversing: boolean): Animatable[] {
        let angle = this.updateWithEase(this.startAngle, this.angle, pctComplete);

        if (reversing) {
            angle = -angle;
        }

        this.target.rotate(angle);

        return [this.target];
    }

    resetState(): void {
        this.target.rotate(this.startAngle);
    }
}



type GrowArgs = { shape: Shape } & AnimationArgs;

export class Grow extends Animation {
    private shape: Shape;
    private initialScale?: number = undefined;

    constructor({ shape, ...baseConfig }: GrowArgs) {
        super(baseConfig);

        this.shape = shape;
    }

    update(pctComplete: number, reversing: boolean): Animatable[] {
        const [from, to] = reversing ? [this.initialScale ?? 1, 0] : [0, this.initialScale ?? 1];

        const scale = this.updateWithEase(from, to, pctComplete);
        this.shape.scale(scale);

        return [this.shape];
    }

    protected initState(): void {
        this.initialScale = this.shape.currentScale;
    }

    resetState(): void {
        this.shape.scale(this.initialScale ?? 1);
    }
}


export class FadeIn extends Animation {
    private _target: Styleable;
    private fromColor?: RGBA;

    constructor({ target, ...baseConfig }: { target: Styleable } & AnimationArgs) {
        super(baseConfig);

        this._target = target;
    }

    update(pctComplete: number, reversing: boolean): Animatable[] {
        if (!this.fromColor) return [];

        const fromColor = [...this.fromColor] as RGBA;
        const [from, to] = reversing ? [1, 0] : [0, 1];

        const updatedOpacity = this.updateWithEase(from, to, pctComplete) as number;
        fromColor[3] = updatedOpacity;
        this._target.changeColor(fromColor);

        return [this._target];
    }

    initState() {
        this.fromColor = this._target.color();
    }

    resetState(): void {}
}
