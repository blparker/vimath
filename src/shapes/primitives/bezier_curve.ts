import { Point } from "@/base";
import { RGBA } from "@/colors";
import { Locatable, Shape, ShapeStyles } from "../shape";


class BezierCurve implements Shape {
    private _start?: Point;
    private _control1: Point;
    private _control2: Point;
    private _end: Point;
    private _styles: ShapeStyles;

    constructor({ start, control1, control2, end, ...styles }: { start?: Point, control1: Point, control2: Point, end: Point } & ShapeStyles) {
        this._start = start;
        this._control1 = control1;
        this._control2 = control2;
        this._end = end;
        this._styles = styles;
    }

    center(): Point {
        throw new Error("Method not implemented.");
    }

    top(): Point {
        throw new Error("Method not implemented.");
    }

    right(): Point {
        throw new Error("Method not implemented.");
    }

    bottom(): Point {
        throw new Error("Method not implemented.");
    }

    left(): Point {
        throw new Error("Method not implemented.");
    }

    width(): number {
        throw new Error("Method not implemented.");
    }

    height(): number {
        throw new Error("Method not implemented.");
    }

    moveTo(point: Point): Shape {
        throw new Error("Method not implemented.");
    }

    shift(...shifts: Point[]): Shape {
        throw new Error("Method not implemented.");
    }

    scale(factor: number): Shape {
        throw new Error("Method not implemented.");
    }

    rotate(angle: number): Shape {
        throw new Error("Method not implemented.");
    }

    nextTo(other: Locatable, direction: Point): Shape {
        throw new Error("Method not implemented.");
    }

    angle(): number {
        throw new Error("Method not implemented.");
    }

    currentScale(): number {
        throw new Error("Method not implemented.");
    }

    styles(): ShapeStyles {
        return this._styles;;
    }

    changeColor(color: RGBA): Shape {
        this.styles().color = color;
        return this;
    }

    changeLineColor(color: RGBA): Shape {
        this.styles().lineColor = color;
        return this;
    }

    copy(): this {
        throw new Error("Method not implemented.");
    }

    startPoint(): Point | undefined {
        return this._start;
    }

    controlPoint1(): Point {
        return this._control1;
    }

    controlPoint2(): Point {
        return this._control2;
    }

    endPoint(): Point {
        return this._end;
    }

    points(): { start?: Point; control1: Point; control2: Point; end: Point; } {
        return { start: this._start, control1: this._control1, control2: this._control2, end: this._end };
    }
}


export { BezierCurve };
