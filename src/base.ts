type Point = [number, number];
type Shift = [number, number];
type Range = [number, number];
type HAlign = 'left' | 'center' | 'right';
type VAlign = 'top' | 'middle' | 'bottom';

type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};


const ORIGIN: Point = [0, 0];

// Directions
function UP(v: number = 1): Point { return [0, v]; }
function DOWN(v: number = 1): Point { return [0, -v]; }
function LEFT(v: number = 1): Point { return [-v, 0]; }
function RIGHT(v: number = 1): Point { return [v, 0]; }
function UL(v: number = 1): Point { return [-v, v]; }
function UR(v: number = 1): Point { return [v, v]; }
function DL(v: number = 1): Point { return [-v, -v]; }
function DR(v: number = 1): Point { return [v, -v]; }


export { type Point, type Shift, type Range, type HAlign, type VAlign, type Prettify, UP, DOWN, LEFT, RIGHT, UL, UR, DL, DR, ORIGIN };
