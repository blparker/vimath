import { Point, Prettify } from '@/base';
import { Colors, RGBA } from '@/colors';
import { SelectableShape, Shape, ShapeStyles, defaultShapeStyles } from '@/shapes/shape';


class PointShape implements Shape, SelectableShape {
    private readonly _points: Point[];
    private _styles: ShapeStyles;
    private _allStyles: ShapeStyles[] = [];
    private _selected: boolean = false;

    constructor({ points, ...styleArgs }: { points: Point[] } & Prettify<ShapeStyles>) {
        this._points = structuredClone(points);
        this._styles = Object.assign({}, defaultShapeStyles, styleArgs);
        this._allStyles.push(this._styles);
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
        throw new Error('Method not implemented.');
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

    angle(): number {
        throw new Error('Method not implemented.');
    }

    currentScale(): number {
        throw new Error('Method not implemented.');
    }

    points(): Point[] {
        return this._points;
    }

    styles(): ShapeStyles {
        // return this._styles;
        return this._allStyles[this._allStyles.length - 1];
    }

    changeColor(color: RGBA): Shape {
        // this._styles.color = color;
        this.styles().color = color;
        return this;
    }

    changeLineColor(color: RGBA): Shape {
        // this._styles.lineColor = color;
        this.styles().lineColor = color;
        return this;
    }

    select(): void {
        if (!this._selected) {
            this._allStyles.push(this.selectStyles());
            this._selected = true;
        }
    }

    deselect(): void {
        if (this._selected) {
            this._allStyles.pop();
            this._selected = false;
        }
    }

    selectStyles(): ShapeStyles {
        return Object.assign({}, this._styles, {
            color: Colors.red(),
            lineColor: Colors.red(),
        });
    }
}

export { PointShape, type ShapeStyles };
