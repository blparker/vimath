import { Point } from '@/base';
import { Colors, RGBA } from '@/colors';
import { config } from '@/config';


type ShapeStyles = {
    color?: RGBA;
    lineColor?: RGBA;
    lineWidth?: number;
    lineStyle?: 'solid' | 'dashed' | 'dotted' | 'dashedsmall';
    adjustForLineWidth?: boolean;
};


const defaultShapeStyles: ShapeStyles = {
    // color: Colors.black(),
    // color: Colors.transparent(),
    color: undefined,
    lineColor: Colors.black(),
    lineWidth: config.lineWidth,
    lineStyle: 'solid',
    adjustForLineWidth: false,
};


interface SelectableShape {
    canSelect: boolean;

    select(): void;
    deselect(): void;
    selectStyles(): ShapeStyles;
}


function isSelectableShape(o: any): o is SelectableShape {
    return 'select' in o && typeof o.select === 'function' && 
           'deselect' in o && typeof o.deselect === 'function' &&
           o.canSelect;
}


interface Shape {
    // Information about the shape of the... shape
    center(): Point;
    top(): Point;
    right(): Point;
    bottom(): Point;
    left(): Point;
    width(): number;
    height(): number;

    /**
     * Moves the center of the shape to the specified point
     * @param point the desired center of the shape
     * @returns the shape itself
     */
    moveTo(point: Point): Shape;

    shift(...shifts: Point[]): Shape;

    scale(factor: number): Shape;

    rotate(angle: number): Shape;

    nextTo(other: Locatable, direction: Point): Shape;

    angle(): number;

    currentScale(): number;

    /* Styling */
    styles(): ShapeStyles;

    changeColor(color: RGBA): Shape;

    changeLineColor(color: RGBA): Shape;

    copy(): this;
};


type Locatable = Point | Shape;

function isLocatable(o: any): o is Locatable {
    return Array.isArray(o) && o.length === 2 || isShape(o);
}


function isShape(o: any): o is Shape {
    return 'shift' in o && typeof o.shift === 'function' && 
           'moveTo' in o && typeof o.moveTo === 'function';
}


export { type Shape, type ShapeStyles, type Locatable, type SelectableShape, defaultShapeStyles, isShape, isSelectableShape, isLocatable };
