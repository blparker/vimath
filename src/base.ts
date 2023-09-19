export type Point = [number, number];
export type Shift = [number, number];
export type Range = [number, number];

/*
* Constants
*/

export const X_TICKS = 14;
export const Y_TICKS = 8;

// Default offset when putting things next to each other
export const OFFSET_GUTTER = 0.2;


export function LEFT(m: number = 1): Point {
    return [-m, 0];
}


export function RIGHT(m: number = 1): Point {
    return [m, 0];
}


export function UP(m: number = 1): Point {
    return [0, m];
}


export function DOWN(m: number = 1): Point {
    return [0, -m];
}
