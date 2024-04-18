import { Point } from '@/base';
import { RGBA } from '@/colors';
import { Locatable, Shape, ShapeStyles, defaultShapeStyles } from '@/shapes/shape';
import utils from '@/utils';


type CommandType = 
    { type: 'moveTo', point: Point } |
    { type: 'bezierCurve', control1: Point, control2: Point, end: Point } |
    { type: 'fill', color: RGBA } |
    { type: 'stroke', color: RGBA };


interface DrawCommand {
    commands(): CommandType[];
}

interface VisibleDrawCommand extends DrawCommand {
    boundingBox(): { minX: number, maxX: number, minY: number, maxY: number };
    shift(point: Point): void;
    scale(factor: number): void;
    rotate(angle: number): void;
}


function isVisibleDrawCommand(command: DrawCommand): command is VisibleDrawCommand {
    return 'boundingBox' in command && typeof command.boundingBox === 'function';
}


class BezierCurveCommand implements DrawCommand, VisibleDrawCommand {
    constructor(public readonly start: Point, public readonly control1: Point, public readonly control2: Point, public readonly end: Point, private implicitStart: boolean = false) {}

    boundingBox(): { minX: number; maxX: number; minY: number; maxY: number; } {
        const [critX, critY] = this.findCriticalPoints(this.start, this.control1, this.control2, this.end);
        critX.push(0, 1);
        critY.push(0, 1);

        // Find the min/max X-values
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;

        for (let p of critX) {
            const xValue = this.equation(p, this.start, this.control1, this.control2, this.end, 0);
            if (xValue < minX) minX = xValue;
            if (xValue > maxX) maxX = xValue;
        }

        let minY = Number.POSITIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;

        for (let p of critY) {
            const yValue = this.equation(p, this.start, this.control1, this.control2, this.end, 1);
            if (yValue < minY) minY = yValue;
            if (yValue > maxY) maxY = yValue;
        }

        return { minX, maxX, minY, maxY };
    }

    commands(): CommandType[] {
        const commands: CommandType[] = this.implicitStart ? [] : [{ type: 'moveTo', point: this.start }];
        commands.push({ type: 'bezierCurve', control1: this.control1, control2: this.control2, end: this.end });

        return commands;
    }

    shift(point: Point): void {
        for (const p of this.pointsArray()) {
            p[0] += point[0];
            p[1] += point[1];
        }
    }

    scale(factor: number): void {
        for (const p of this.pointsArray()) {
            p[0] *= factor;
            p[1] *= factor;
        }
    }

    rotate(angle: number): void {
        const [cX, cY] = this.center();

        for (const p of this.pointsArray()) {
            const [x, y] = p;
            const [xT, yT] = [x - cX, y - cY];

            const [xR, yR] = [
                xT * Math.cos(angle) - yT * Math.sin(angle),
                xT * Math.sin(angle) + yT * Math.cos(angle)
            ];

            p[0] = xR + cX;
            p[1] = yR + cY;
        }
    }

    private center(): Point {
        const { minX, maxX, minY, maxY } = this.boundingBox();
        return [(minX + maxX) / 2, (minY + maxY) / 2];
    }

    private pointsArray(): Point[] {
        if (this.implicitStart) return [this.control1, this.control2, this.end];
        else return [this.start, this.control1, this.control2, this.end];
    }

    private equation(t: number, p0: Point, p1: Point, p2: Point, p3: Point, i: number): number {
        return (1 - t)**3 * p0[i] + 3 * (1 - t)**2 * t * p1[i] + 3 * (1 - t) * t**2 * p2[i] + t**3 * p3[i];
    }

    private derivative(t: number, p0: Point, p1: Point, p2: Point, p3: Point, i: number): number {
        return 3 * ((-1 + 2 * t - 3 * t**2)) * p0[i] + (1 - 4 * t + 3 * t**2) * p1[i] + (2 * t - 3 * t**2) * p2[i] + t**2 * p3[i];
    }

    private findCriticalPoints(p0: Point, p1: Point, p2: Point, p3: Point): [number[], number[]] {
        let criticalPointsX: number[] = [];
        let criticalPointsY: number[] = [];
        let tX = 0, tY = 0, step = 0.01;

        while (tX <= 1 || tY <= 1) {
            const dX = tX <= 1 ? this.derivative(tX, p0, p1, p2, p3, 0) : Number.POSITIVE_INFINITY;
            const dY = tY <= 1 ? this.derivative(tY, p0, p1, p2, p3, 1) : Number.POSITIVE_INFINITY;

            if (Math.abs(dX) < 0.001) {
                criticalPointsX.push(tX);
                tX += 1;
            }

            if (Math.abs(dY) < 0.001) {
                criticalPointsY.push(tY);
                tY += 1;
            }

            tX += step;
            tY += step;
        }

        return [criticalPointsX, criticalPointsY];
    }
}


class FillCommand implements DrawCommand {
    constructor(public readonly color: RGBA) {}

    commands(): CommandType[] {
        return [{ type: 'fill', color: this.color}];
    }
}


class StrokeCommand implements DrawCommand {
    constructor(public readonly color: RGBA) {}

    commands(): CommandType[] {
        return [{ type: 'stroke', color: this.color}];
    }
}


// class LineCommand implements DrawCommand {
//     boundingBox(): { minX: number; maxX: number; minY: number; maxY: number; } {
//         throw new Error('Method not implemented.');
//     }

//     commands(): CommandType[] {
//         throw new Error('Method not implemented.');
//     }
// }



class Drawable implements Shape {
    private _commands: DrawCommand[] = [];
    private _styles: ShapeStyles;
    private _angle = 0;
    private _scale = 1;
    private _bbox: { minX: number, maxX: number, minY: number, maxY: number };

    constructor(styles?: ShapeStyles) {
        this._bbox = { minX: Number.NEGATIVE_INFINITY, maxX: Number.POSITIVE_INFINITY, minY: Number.NEGATIVE_INFINITY, maxY: Number.POSITIVE_INFINITY };
        this._styles = styles ?? defaultShapeStyles;
    }

    commands(): CommandType[] {
        return this._commands.map(c => c.commands()).flat();
    }

    bezierCurve({ start, control1, control2, end }: { start?: Point, control1: Point, control2: Point, end: Point }) {
        if (start === undefined && this._commands.length === 0) {
            throw new Error('No start point provided');
        } else if (start === undefined) {
            const previous = this._commands[this._commands.length - 1];
            if (previous instanceof BezierCurveCommand) {
                this._commands.push(new BezierCurveCommand(previous.end, control1, control2, end, true));
            } else {
                throw new Error('No start point provided');
            }
        } else {
            this._commands.push(new BezierCurveCommand(start, control1, control2, end, false));
        }

        this._bbox = this.boundingBox();
    }

    fill(color: RGBA) {
        this._commands.push(new FillCommand(color));
    }

    stroke(color: RGBA) {
        this._commands.push(new StrokeCommand(color));
    }

    center(): Point {
        const { minX, maxX, minY, maxY } = this._bbox;

        return [(minX + maxX) / 2, (minY + maxY) / 2];
    }

    top(): Point {
        const { minX, maxX, maxY } = this._bbox;
        return [(minX + maxX) / 2, maxY] as Point;
    }

    right(): Point {
        const { maxX, minY, maxY } = this._bbox;
        return [maxX, (minY + maxY) / 2];
    }

    bottom(): Point {
        const { minX, maxX, minY } = this._bbox;
        return [(minX + maxX) / 2, minY];
    }

    left(): Point {
        const { minX, minY, maxY } = this._bbox;
        return [minX, (minY + maxY) / 2];
    }

    width(): number {
        return this.right()[0] - this.left()[0];
    }

    height(): number {
        return this.top()[1] - this.bottom()[1];
    }

    moveTo(point: Point): Shape {
        const [cX, cY] = this.center();
        const shift = [point[0] - cX, point[1] - cY] as Point;

        this.shift(shift);

        this._bbox = this.boundingBox();
        return this;
    }

    shift(...shifts: Point[]): Shape {
        const totalShift = shifts.reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]);
        console.log("### ", totalShift);

        for (const command of this._commands) {
            if (isVisibleDrawCommand(command)) {
                command.shift(totalShift);
            }
        }

        this._bbox = this.boundingBox();
        return this;
    }

    scale(factor: number): Shape {
        for (const command of this._commands) {
            if (isVisibleDrawCommand(command)) {
                command.scale(factor);
            }
        }

        this._bbox = this.boundingBox();
        return this;
    }

    rotate(angle: number): Shape {
        for (const command of this._commands) {
            if (isVisibleDrawCommand(command)) {
                command.rotate(angle);
            }
        }

        this._bbox = this.boundingBox();
        return this;
    }

    nextTo(other: Locatable, direction: Point): Shape {
        throw new Error('Method not implemented.');
    }

    angle(): number {
        return this._angle;
    }

    currentScale(): number {
        return this._scale;
    }

    styles(): ShapeStyles {
        return this._styles;
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
        return utils.deepCopy(this);
    }

    private boundingBox(): { minX: number, maxX: number, minY: number, maxY: number } {
        let totalMinX = Number.POSITIVE_INFINITY;
        let totalMaxX = Number.NEGATIVE_INFINITY;
        let totalMinY = Number.POSITIVE_INFINITY;
        let totalMaxY = Number.NEGATIVE_INFINITY;

        for (const command of this._commands) {
            if (!isVisibleDrawCommand(command)) continue;

            const { minX, maxX, minY, maxY } = command.boundingBox();

            if (minX < totalMinX) totalMinX = minX;
            if (maxX > totalMaxX) totalMaxX = maxX;
            if (minY < totalMinY) totalMinY = minY;
            if (maxY > totalMaxY) totalMaxY = maxY;
        }

        return { minX: totalMinX, maxX: totalMaxX, minY: totalMinY, maxY: totalMaxY };
    }
}


export { Drawable, type CommandType };
