import { Point } from '@/base';

/**
 * Find the minimum value in an array of numbers
 * @param arr the array of numbers to find the minimum within
 * @returns the minimum value in the array
 */
function min(arr: number[]): number;

/**
 * Find the minimum value in 2D array of numbers in a specific column
 * @param arr the 2D array of numbers to find the minimum within
 * @param idx the index of the column to find the minimum within
 * @returns the minimum value in the column of the array
 */
function min(arr: number[][], idx: number): number;

/**
 * Given two arrays, find the minimum value at the same index in both arrays
 * @param a the first array
 * @param b the second array
 * @param idx the minimum value of either a[idx] or b[idx]
 */
function min(a: number[], b: number[], idx: number): number;

function min(a: unknown, b?: unknown, idx?: number): number {
    if (Array.isArray(a) && b === undefined && idx === undefined) {
        return Math.min(...a);
    } else if (Array.isArray(a) && a.length > 0 && Array.isArray(a[0]) && b !== undefined && typeof b === 'number' && idx === undefined) {
        return Math.min(...a.map((arr) => arr[b]));
    } else if (Array.isArray(a) && Array.isArray(b) && idx !== undefined) {
        return Math.min(a[idx], b[idx])
    } else {
        throw new Error('Invalid arguments');
    }
}


/**
 * lerp (linear interpolation) produces a value beteween p% between n1 and n2. 
 * @example
 * ```
 * lerp(0, 10, 0.5)  // > returns 5
 * ```
 * @param n1 the left side of the range
 * @param n2 the right side of the range
 * @param p the percentage to interpolate
 * @returns the interpolated value between n1 and n2
 */
function lerp(n1: number, n2: number, p: number) {
    return (1 - p) * n1 + p * n2;
}


/**
 * 
 * @param v Constrain a number between a min and max value
 * @param min the lower bound of the range to constrain
 * @param max the upper bound of the range to constrain
 * @returns min if v is less than min, max if v is greater than max, otherwise v
 * @example
 * ```
 * clamp(5, 0, 10)  // > returns 5 (5 is between 0 and 10)
 * clamp(1, 7, 10)  // > returns 7 (1 < 7, so min is returned)
 * ```
 */
function clamp(v: number, min: number = 0, max: number = 1) {
    return Math.min(max, Math.max(min, v));
}


/**
 * invlerp (inverse linear interpolation) produces the percentage of v between n1 and n2.
 * @example
 * ```
 * invlerp(0, 10, 5)  // > returns 0.5
 * ```
 * @param n1 the left side of the range
 * @param n2 the right side of the range
 * @param v the value to find the percentage of
 * @returns the percentage of v between n1 and n2
 */
function invlerp(n1: number, n2: number, v: number) {
    return clamp((v - n1) / (n2 - n1));
}


/**
 * Converts a value from one range to another.
 * @param oFrom the left side of the original range
 * @param oTo the right side of the original range
 * @param tFrom the left side of the target range
 * @param tTo the right side of the target range
 * @param v the value to convert
 * @returns the value converted from the original range to the target range
 */
function remap(oFrom: number, oTo: number, tFrom: number, tTo: number, v: number) {
    const rel = invlerp(oFrom, oTo, v);
    return lerp(tFrom, tTo, rel);
}


function dist(a: [number, number], b: [number, number]): number {
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
}


function multScalar(v: Point, s: number): Point {
    return [v[0] * s, v[1] * s];
}


function addVec(a: Point, b: Point): Point {
    return [a[0] + b[0], a[1] + b[1]];
}


function subVec(a: Point, b: Point): Point {
    return [a[0] - b[0], a[1] - b[1]];
}


function unitVec(a: Point, b: Point): Point {
    const ab = subVec(b, a);
    const d = Math.hypot(...ab);

    return multScalar(ab, 1 / d);
}


function angleVec(a: Point, b: Point): number {
    return Math.atan2(b[1] - a[1], b[0] - a[0]);
}


function rotateAboutPoint(p: Point, angle: number, center: Point): Point {
    const [x, y] = p;
    const [cx, cy] = center;

    const x1 = cx + (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle);
    const y1 = cy + (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle);

    return [x1, y1];
}


function midpoint(a: Point, b: Point): Point {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

function approxEqual(a: number[], b: number[], epsilon?: number): boolean;
function approxEqual(a: number, b: number, epsilon?: number): boolean;
function approxEqual(a: number | number[], b: number | number[], epsilon: number = 1e-6): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < epsilon);
    } else if (typeof a === 'number' && typeof b === 'number') {
        return Math.abs(a - b) < epsilon;
    } else {
        throw new Error('Invalid arguments');
    }
}


function evalBezier(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;

    return [
        (mt * mt2 * p0[0]) + (3 * mt2 * t * p1[0]) + (3 * mt * t2 * p2[0]) + (t * t2 * p3[0]),
        (mt * mt2 * p0[1]) + (3 * mt2 * t * p1[1]) + (3 * mt * t2 * p2[1]) + (t * t2 * p3[1])
    ];
}


export default {
    min,
    lerp,
    clamp,
    invlerp,
    remap,
    dist,
    multScalar,
    addVec,
    subVec,
    unitVec,
    angleVec,
    rotateAboutPoint,
    midpoint,
    approxEqual,
    evalBezier,
};
