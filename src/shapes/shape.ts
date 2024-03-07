import { Point, Shift } from '../base.js';
import { Colors, RGBA } from '../colors.js';


const DEFAULT_LINE_WIDTH = 3;


/**
 * Shape defines the interface for all shapes in the library.
 */
export interface Shape {
    angle: number;
    currentScale: number;

    /**
     * Shift the center of the shape in the X/Y direction by a set of shifts
     * @param shifts One or more shifts to apply to the shape
     * @returns The shape after the shifts have been applied
     * @example
     * ```ts
     * // Create a new square centered at (1, 1)
     * const s = new Square({ x: 1, y: 1 });
     * // Shift the center of the square by 1 in the X direction and 2 in the Y direction
     * s.shift([1, 2]);
     * ```
     */
    shift(...shifts: Shift[]): Shape;

    /**
     * Move the center of a shape to a new point
     * @param point The point to move the shape center to
     * @returns The shape after the move
     * @example
     * ```ts
     * // Create a new square centered at the origin
     * const s = new Square();
     * // Move the center of the square to the point (1, 2)
     * s.moveTo([1, 2]);
     * ```
     */
    moveTo(point: Point): Shape;

    /**
     * Scales the shape by a factor
     * @param factor The factor to scale the shape by (i.e., 2 will double the size of the shape, 0.5 will halve the size of the shape, etc.)
     * @returns The scaled shape
     * @example
     * ```ts
     * // Create a new line
     * const l = new Line({ from: [-1, 0], to: [1, 0] });
     * // Scale the line by 2 (i.e., double the length of the line)
     * l.scale(2);
     */
    scale(factor: number): Shape;

    /**
     * Rotate the shape by a given angle (in radians)
     * @param angle The radian angle to rotate the shape by
     * @returns The rotated shape
     * @example
     * ```ts
     * // Create a new square centered at the origin
     * const s = new Square();
     * // Rotate the square by 45 degrees
     * s.rotate(Math.PI / 4);
     */
    rotate(angle: number): Shape;

    /**
     * 
     * @param shape 
     * @param direction 
     */
    nextTo(shape: Shape | Point, direction?: Point): Shape;

    /**
     * 
     * @param newCenter 
     */
    moveCenter(newCenter: Point): Shape;

    /**
     * Get the center point of the shape. In a point shape, this is the centroid of the points
     * @returns The center of the shape
     * @example
     * ```ts
     * // Create a new square centered at (1, 1)
     * const s = new Square({ x: 1, y: 1 });
     * // Get the center
     * s.center();  // => [1, 1]
     */
    center(): Point;

    /**
     * Get the center point on the top side of the points bounding box.
     * @returns The top point of the shape (i.e., the center of the top side of the bounding box)
     * @example
     * ```ts
     * // Create a new sqaure centered at the origin that is 2 units wide
     * const s = new Square({ size: 2 });
     * // Get the top side (the central point on the top edge of the box)
     * s.top();  // => [0, 1]
     */
    top(): Point;

    /**
     * Get the center point on the bottom side of the points bounding box.
     * @returns The bottom point of the shape (i.e., the center of the bottom side of the bounding box)
     * @example
     * ```ts
     * // Create a new sqaure centered at the origin that is 2 units wide
     * const s = new Square({ size: 2 });
     * // Get the bottom side (the central point on the bottom edge of the box)
     * s.bottom();  // => [0, -1]
     */
    bottom(): Point;

    /**
     * Get the center point on the left side of the points bounding box.
     * @returns The left point of the shape (i.e., the center of the left side of the bounding box)
     * @example
     * ```ts
     * // Create a new triangle from a point shape that is 2 units wide and 4 units tall
     * const s = new PointShape({ point: [[-1, 0], [1, 0], [0, 4] });
     * // Get the left side (imagine drawing a box around the points that is 2 units wide and 4 units tall. The left side is the center point on the left side of the box)
     * s.left();  // => [-1, 2]
     */
    left(): Point;

    /**
     * Get the center point on the right side of the points bounding box.
     * @returns The right point of the shape (i.e., the center of the right side of the bounding box)
     * @example
     * ```ts
     * // Create a new triangle from a point shape that is 2 units wide and 4 units tall
     * const s = new PointShape({ point: [[-1, 0], [1, 0], [0, 4] });
     * // Get the right side (imagine drawing a box around the points that is 2 units wide and 4 units tall. The right side is the center point on the right side of the box)
     * s.right();  // => [1, 2]
     */
    right(): Point;

    /**
     * Get the width of the shape. For a point shape, this is the width of the points bounding box
     * @returns The width of the shape
     * @example
     * ```ts
     * // Create a new triangle from a point shape that is 2 units wide and 4 units tall
     * const s = new PointShape({ point: [[-1, 0], [1, 0], [0, 4] });
     * // Get the width (a box is drawn around the points that is 2 units wide and 4 units tall)
     * s.width();  // => 2
     */
    width(): number;

    /**
     * Get the height of the shape. For a point shape, this is the height of the points bounding box
     * @returns The height of the shape
     * @example
     * ```ts
     * // Create a new triangle from a point shape that is 2 units wide and 4 units tall
     * const s = new PointShape({ point: [[-1, 0], [1, 0], [0, 4] });
     * // Get the height (a box is drawn around the points that is 2 units wide and 4 units tall)
     * s.height();  // => 4
     */
    height(): number;

    /**
     * Deep copy of the shape
     * @returns A deep copy of the shape
     */
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
