export type Point = [number, number];
export type Shift = [number, number];
export type Range = [number, number];
export type HAlign = 'left' | 'center' | 'right';
export type VAlign = 'top' | 'middle' | 'bottom';

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
