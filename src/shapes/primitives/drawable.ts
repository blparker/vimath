import { Point } from '@/base';
import { RGBA } from '@/colors';
import { Locatable, Shape, ShapeStyles } from '@/shapes/shape';


type MoveToCommand = { point: Point };
type BezierCurveCommand = { control1: Point, control2: Point, end: Point };
type FillCommand = { color: RGBA, type: 'fill' };
type StrokeCommand = { color: RGBA, type: 'stroke' };

type Command = MoveToCommand | BezierCurveCommand | FillCommand | StrokeCommand;


class Drawable implements Shape {
    private _commands: Command[] = [];

    constructor() {}

    commands(): Command[] {
        return this._commands;
    }

    bezierCurve({ start, control1, control2, end }: { start?: Point, control1: Point, control2: Point, end: Point }) {
        if (start !== undefined) {
            this._commands.push({ point: start });
        }

        this._commands.push({ control1, control2, end });
    }

    fill(color: RGBA) {
        this._commands.push({ color, type: 'fill' });
    }

    stroke(color: RGBA) {
        this._commands.push({ color, type: 'stroke' });
    }

    center(): Point {
        throw new Error('Method not implemented.');
    }

    top(): Point {
        throw new Error('Method not implemented.');
    }

    right(): Point {
        throw new Error('Method not implemented.');
    }

    bottom(): Point {
        throw new Error('Method not implemented.');
    }

    left(): Point {
        throw new Error('Method not implemented.');
    }

    width(): number {
        throw new Error('Method not implemented.');
    }

    height(): number {
        throw new Error('Method not implemented.');
    }

    moveTo(point: Point): Shape {
        return this;
    }

    shift(...shifts: Point[]): Shape {
        throw new Error('Method not implemented.');
    }

    scale(factor: number): Shape {
        throw new Error('Method not implemented.');
    }

    rotate(angle: number): Shape {
        throw new Error('Method not implemented.');
    }

    nextTo(other: Locatable, direction: Point): Shape {
        throw new Error('Method not implemented.');
    }

    angle(): number {
        throw new Error('Method not implemented.');
    }

    currentScale(): number {
        throw new Error('Method not implemented.');
    }

    styles(): ShapeStyles {
        throw new Error('Method not implemented.');
    }

    changeColor(color: RGBA): Shape {
        throw new Error('Method not implemented.');
    }

    changeLineColor(color: RGBA): Shape {
        throw new Error('Method not implemented.');
    }

    copy(): this {
        throw new Error('Method not implemented.');
    }
}


export { Drawable, type Command, type MoveToCommand, type BezierCurveCommand, type FillCommand, type StrokeCommand };
