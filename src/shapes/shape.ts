<<<<<<< HEAD
import { Point, Shift } from '@/base';
import { Colors, RGBA } from '@/colors';


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
=======
import { Point } from '@/base';
import { Colors, RGBA } from '@/colors';
import { config } from '@/config';


type ShapeStyles = {
    color?: RGBA;
    lineColor?: RGBA;
    lineWidth?: number;
    lineStyle?: 'solid' | 'dashed' | 'dotted' | 'dashedsmall';
    lineCap?: 'butt' | 'round' | 'square';
    adjustForLineWidth?: boolean;
};


const defaultShapeStyles: ShapeStyles = {
    // color: Colors.black(),
    // color: Colors.transparent(),
    color: undefined,
    lineColor: Colors.black(),
    lineWidth: config.lineWidth,
    lineStyle: 'solid',
    lineCap: 'butt',
    adjustForLineWidth: false,
};


interface SelectableShape {
    canSelect: boolean;

    /**
     * Selects the shape. Can use this to perform any actions when the shape is selected
     */
    select(): void;
    /**
     * Selects the shape. Can use this to perform any actions when the shape is deselected
     */
    deselect(): void;
    selectStyles(): ShapeStyles;
}


/**
 * @param o Given an object, checks if it is a selectable shape (determinined by the presence of the `select` and `deselect` methods)
 * @returns a boolean indicating whether the object is a selectable shape (intended to be used as a type guard)
 */
function isSelectableShape(o: any): o is SelectableShape {
    return 'select' in o && typeof o.select === 'function' && 
           'deselect' in o && typeof o.deselect === 'function' &&
           o.canSelect;
}


interface Shape {
    // Information about the shape of the... shape

    /**
     * Gets the geometric center of the shape (the center of the box bounding the shape)
     * @returns a point representing the center of the shape's bounding box
>>>>>>> refactor/master
     * @example
     * ```ts
     * // Create a new square centered at (1, 1)
     * const s = new Square({ x: 1, y: 1 });
     * // Get the center
     * s.center();  // => [1, 1]
<<<<<<< HEAD
=======
     * ```
>>>>>>> refactor/master
     */
    center(): Point;

    /**
<<<<<<< HEAD
     * Get the center point on the top side of the points bounding box.
     * @returns The top point of the shape (i.e., the center of the top side of the bounding box)
     * @example
     * ```ts
     * // Create a new sqaure centered at the origin that is 2 units wide
     * const s = new Square({ size: 2 });
     * // Get the top side (the central point on the top edge of the box)
     * s.top();  // => [0, 1]
=======
     * Gets the center-top point of the shape (the center of the top edge of the box bounding the shape)
     * @returns a point representing the top of the shape's bounding box
     * @example
     * ```ts
     * // Create a new square centered at (1, 1) (default size of 2)
     * const s = new Square({ x: 1, y: 1 });
     * // The center is at (1, 1), so the top is at (1, 2)
     * s.top();  // => [1, 2]
     * ```
>>>>>>> refactor/master
     */
    top(): Point;

    /**
<<<<<<< HEAD
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
=======
     * Gets the center-right point of the shape (the center of the right edge of the box bounding the shape)
     * @returns a point representing the right of the shape's bounding box
     * @example
     * ```ts
     * // Create a new square centered at (1, 1) (default size of 2)
     * const s = new Square({ x: 1, y: 1 });
     * // The center is at (1, 1), so the right is at (2, 1)
     * s.right();  // => [2, 1]
     * ```
>>>>>>> refactor/master
     */
    right(): Point;

    /**
<<<<<<< HEAD
     * Get the width of the shape. For a point shape, this is the width of the points bounding box
     * @returns The width of the shape
     * @example
     * ```ts
     * // Create a new triangle from a point shape that is 2 units wide and 4 units tall
     * const s = new PointShape({ point: [[-1, 0], [1, 0], [0, 4] });
     * // Get the width (a box is drawn around the points that is 2 units wide and 4 units tall)
     * s.width();  // => 2
=======
     * Gets the center-bottom point of the shape (the center of the bottom edge of the box bounding the shape)
     * @returns a point representing the bottom of the shape's bounding box
     * @example
     * ```ts
     * // Create a new square centered at (1, 1) (default size of 2)
     * const s = new Square({ x: 1, y: 1 });
     * // The center is at (1, 1), so the bottom is at (1, 0)
     * s.bottom();  // => [2, 1]
     * ```
     */
    bottom(): Point;

    /**
     * Gets the center-left point of the shape (the center of the left edge of the box bounding the shape)
     * @returns a point representing the left of the shape's bounding box
     * @example
     * ```ts
     * // Create a new square centered at (1, 1) (default size of 2)
     * const s = new Square({ x: 1, y: 1 });
     * // The center is at (1, 1), so the left is at (0, 1)
     * s.left();  // => [0, 1]
     * ```
     */

    left(): Point;

    /**
     * Gets the width of the shape (i.e., the width of the box bounding the shape)
     * @returns the width of the shape
     * @example
     * ```ts
     * // Create a new rectangle centered at (0, 0) with a width of 4 and height of 2 (stretching from (-2, 1) to (2, -1))
     * const s = new PointShape({ points: [[-2, 1], [2, 1], [2, -1], [-2, -1]] });
     * s.width();  // 4
     * ```
>>>>>>> refactor/master
     */
    width(): number;

    /**
<<<<<<< HEAD
     * Get the height of the shape. For a point shape, this is the height of the points bounding box
     * @returns The height of the shape
     * @example
     * ```ts
     * // Create a new triangle from a point shape that is 2 units wide and 4 units tall
     * const s = new PointShape({ point: [[-1, 0], [1, 0], [0, 4] });
     * // Get the height (a box is drawn around the points that is 2 units wide and 4 units tall)
     * s.height();  // => 4
=======
     * Gets the height of the shape (i.e., the height of the box bounding the shape)
     * @returns the height of the shape
     * @example
     * ```ts
     * // Create a new rectangle centered at (0, 0) with a width of 4 and height of 2 (stretching from (-2, 1) to (2, -1))
     * const s = new PointShape({ points: [[-2, 1], [2, 1], [2, -1], [-2, -1]] });
     * s.height();  // 2
     * ```
>>>>>>> refactor/master
     */
    height(): number;

    /**
<<<<<<< HEAD
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
=======
     * Moves the center of the shape to the specified point
     * @param point the desired center of the shape
     * @returns this (used for chaining)
     * @example
     * ```ts
     * // Create a new square centered at (0, 0)
     * const s = new Square();
     * // Move the square's center to (1, 1)
     * s.moveTo([1, 1]);  // the square is now centered at (1, 1)
     * ```
     */
    moveTo(point: Point): this;

    /**
     * Shifts the center of the shape by a specified amount
     * @param point one or more "shifts" to apply to the shape's center
     * @returns this (used for chaining)
     * @example
     * ```ts
     * // Create a new square centered at (0, 0)
     * const s = new Square();
     * // Shift the square's center by 1 to the right and 1 up (could just combine into one shift, [1, 1], but this is for demonstration purposes)
     * s.shift([1, 0], [0, 1]);  // the square is now centered at (1, 1)
     * ```
     */
    shift(...shifts: Point[]): this;

    /**
     * Scales the shape by a factor
     * @param factor the factor to scale the shape by (e.g., a factor of 2 will double the size, a factor of 0.5 will halve the size)
     * @return this (used for chaining)
     * @example
     * ```ts
     * // Create a new square centered at (0, 0) with a default size of 2
     * const s = new Square();
     * // Scale the square by a factor of 2 (doubles the size)
     * s.scale(2);  // the square now has a size of 4
     * ```
     */
    scale(factor: number): this;

    /**
     * Rotates the shape by some angle (in radians)
     * @param angle the amount (in radians) to rotate the angle by (e.g., Math.PI / 2 will rotate the shape by 90 degrees)
     * @return this (used for chaining)
     * @example
     * ```ts
     * // Create a new square centered at (0, 0) with a default size of 2
     * const s = new Square();
     * // Rotate the square by 45 degress (turning it into a diamond)
     * s.rotate(Math.PI / 2);
     * ```
     */
    rotate(angle: number): this;

    /**
     * Puts the shape next to another locatable in a specified direction
     * @param other the locatable to put this shape next to
     * @param direction the direction to put this shape next to the other locatable
     * @example
     * ```ts
     * // Create a new square centered at (0, 0) with a default size of 2
     * const s1 = new Square();
     * // Create another square
     * const s2 = new Square();
     * // Put s2 next to s1 to the right
     * s2.nextTo(s1, RIGHT());
     * ```
     */
    nextTo(other: Locatable, direction: Point, standoff?: number): this;

    /**
     * Gets the current angle of the shape (defaults to 0). The angle gets updated when the shape is rotated
     * @returns the current angle of the shape
     */
    angle(): number;

    /**
     * Gets the current scale of the shape (defaults to 1). The scale gets updated when the shape is scaled
     * @returns the current scale of the shape
     */
    currentScale(): number;

    /* Styling */

    /**
     * Gets the styles of the shape
     * @returns the current styles of the shape
     */
    styles(): ShapeStyles;

    /**
     * Sets the styles of the shape
     * @param newStyles the new styles to apply to the shape
     */
    setStyles(newStyles: ShapeStyles): this;

    /**
     * Changes the current color of the shape. For shapes that are fillable, this is the fill color, for others, it's the singular color (.e.g., `Dot`, `Text`)
     * @param color the new color to change the shape to
     * @returns this (used for chaining)
     */
    changeColor(color: RGBA): this;

    /**
     * Changes the line/stroke color of the shape. For shapes that are strokeable, this is the line color (e.g., `Square`)
     * @param color the new color to change the shape to
     * @returns this (used for chaining)
     */
    changeLineColor(color: RGBA): this;

    /**
     * Creates a deep copy of the shape
     * @returns a deep copy of the shape
     */
    copy(): this;
};


/**
 * A locatable is something that is located in space, either as a point or as a shape
 */
type Locatable = Point | Shape;

/**
 * Checks if the given object is a locatable (either a point or a shape)
 * @param o the object to check
 * @returns a boolean indicating whether the object is a locatable (intended to be used as a type guard)
 */
function isLocatable(o: any): o is Locatable {
    return Array.isArray(o) && o.length === 2 || isShape(o);
}


/**
 * Converts a locatable to a point. If the locatable is a shape, it returns the center of the shape, otherwise it's a point, 
 * so it just returns the point
 * @param locatable the locatable to convert
 * @returns a point representing the locatable
 */
function locatableToPoint(locatable: Locatable): Point {
    return isShape(locatable) ? locatable.center() : locatable;
}


/**
 * Checks if the given object is a shape. It determines this by checking if the object has the `shift` and `moveTo` methods
 * @param o the object to check
 * @returns a boolean indicating whether the object is a shape (intended to be used as a type guard)
 */
function isShape(o: any): o is Shape {
    return 'shift' in o && typeof o.shift === 'function' && 
           'moveTo' in o && typeof o.moveTo === 'function';
}


export { type Shape, type ShapeStyles, type Locatable, type SelectableShape, defaultShapeStyles, isShape, isSelectableShape, isLocatable, locatableToPoint };
>>>>>>> refactor/master
