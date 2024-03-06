import { Point, Shift } from '../base.js';
import { Colors, RGBA } from '../colors.js';


const DEFAULT_LINE_WIDTH = 3;


export interface Shape {
    angle: number;
    currentScale: number;

    shift(...shifts: Shift[]): Shape;
    moveTo(point: Point): Shape;
    scale(factor: number): Shape;
    rotate(angle: number): Shape;
    nextTo(shape: Shape | Point, direction?: Point): Shape;
    center(): Point;
    moveCenter(newCenter: Point): Shape;
    top(): Point;
    bottom(): Point;
    left(): Point;
    right(): Point;
    width(): number;
    height(): number;
    copy(): Shape;
}


export interface Styleable {
    color(): RGBA;
    changeColor(newColor: RGBA): Styleable;
    lineColor(): RGBA;
    changeLineColor(newColor: RGBA): Styleable;
    lineWidth(): number;
}


export interface PointsAware {
    points(): Point[];
}


export function isShape(o: any): o is Shape {
    return 'moveTo' in o && 'scale' in o && 'rotate' in o;
}


export function isPointsAware(o: any): o is PointsAware {
    return 'points' in o && typeof o.points === 'function';
}


export type LineStyle = 'solid' | 'dashed' | 'dotted';

export type StyleArgs = {
    lineColor?: string | RGBA;
    color?: string | RGBA;
    lineWidth?: number;
    lineStyle?: LineStyle;
};

export const defaultStyleArgs = {
    lineColor: Colors.black(),
    lineWidth: DEFAULT_LINE_WIDTH,
    color: Colors.transparent(),
    lineStyle: 'solid',
} as const;
