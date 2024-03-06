import { Point } from '../base';
import { isPointsAware } from '../shapes/shape';
import { Shape } from '../shapes/shape';
import { Animation } from './animations';
import * as math from '../math';
import { Canvas } from '../renderers/renderer';


export type MouseDown = 'mousedown';
export type MouseUp = 'mouseup';
export type MouseMove = 'mousemove';
export type MouseOut = 'mouseout';



export interface Interaction {
    registerInteraction(canvas: Canvas): void;
    isRegistered(): boolean;
    tick(time: number): void;
}


export function isInteraction(el: any): el is Interaction {
    return 'registerInteraction' in el && 'tick' in el && typeof el.tick === 'function' && typeof el.registerInteraction === 'function';
}


function inside(point: Point, points: Point[]): boolean {
    const [x, y] = point;
    let inside = false;
    const padding = 0.1;

    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        // const [xi, yi] = math.scalarMultiply(points[i], 1 + padding);
        // const [xj, yj] = math.scalarMultiply(points[j], 1 + padding);
        const [xi, yi] = points[i];
        const [xj, yj] = points[j];

        const intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}


function dot(a: Point, b: Point): number {
    return a[0] * b[0] + a[1] * b[1];
}


function closestTwoPoints(point: Point, points: Point[]): [Point, Point] {
    let close1Dist = Infinity;
    let close2Dist = Infinity;
    let close1Idx = -1;
    let close2Idx = -1;

    for (let i = 0; i < points.length; i++) {
        const d = math.distance(point, points[i]);
        if (d < close1Dist) {
            close2Dist = close1Dist;
            close1Dist = d;

            close2Idx = close1Idx;
            close1Idx = i;
        } else if (d < close2Dist) {
            close2Dist = d;
            close2Idx = i;
        }
    }

    return [points[close1Idx], points[close2Idx]];
}


function touchesLine(point: Point, points: Point[]): boolean {
    const [a, b] = closestTwoPoints(point, points);

    const ab = math.subtract(b, a) as Point;
    const ap = math.subtract(point, a) as Point;
    const proj = dot(ap, ab);
    const ablen = Math.pow(Math.sqrt(ab[0] * ab[0] + ab[1] * ab[1]), 2);
    const d = proj / ablen;

    let cp: Point;

    if (d <= 0) {
        cp = a;
    } else if (d >= 1) {
        cp = b
    } else {
        cp = math.add(a, math.scalarMultiply(ab, d)) as Point;
    }

    return math.distance(point, cp) < 0.1;
}


export class Hoverable implements Interaction {
    private registered: boolean = false;
    private hovered: boolean = false;

    private target: Shape;
    private actions: Animation[];
    private actionsRunning: boolean[];
    private mousePos?: Point;

    constructor({ target, actions }: { target: Shape, actions: Animation | Animation[] }) {
        this.target = target;
        this.actions = Array.isArray(actions) ? actions : [actions];
        this.actionsRunning = Array(this.actions.length).fill(false);
    }

    tick(time: number): void {
        if (!this.mousePos || !this.isHoverable()) {
            return;
        }

        if (this.isHovered()) {
            if (!this.hovered) {
                this.actions.forEach(action => action.reset());
                this.hovered = true;
            }

            this.actions.forEach(action => action.tick(time));
            this.actionsRunning = Array(this.actions.length).fill(true);
        } else if (this.hovered) {
            this.actions.forEach(action => action.reverse());
            this.hovered = false;
        } else if (this.actionsRunning.some(r => r)) {
            this.actionsRunning.map((isRunning, i) => {
                if (isRunning) {
                    this.actions[i].tick(time);
                }

                return this.actions[i].isComplete(time);
            });
        }

        // this.actionsRunning = this.actions.map(a => a.isRunning() && !a.isComplete(time));
    }

    registerInteraction(canvas: Canvas): void {
        if (this.registered) return;

        canvas.onMouseMove((point: Point) => this.mousePos = point);
        canvas.onMouseOut(() => this.mousePos = undefined);
        this.registered = true;
    }

    isRegistered(): boolean {
        return this.registered;
    }

    private isHoverable(): boolean {
        return this.mousePos !== undefined && isPointsAware(this.target);
    }

    private isHovered(): boolean {
        if (!this.isHoverable()) return false;

        if (this.mousePos && isPointsAware(this.target)) {
            const points = this.target.points();
            return inside(this.mousePos, points) || touchesLine(this.mousePos, points);
        } else {
            return false;
        }
    }
}
