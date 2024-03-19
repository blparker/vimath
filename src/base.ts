export type Point = [number, number];
export type Shift = [number, number];
export type Range = [number, number];
export type HAlign = 'left' | 'center' | 'right';
export type VAlign = 'top' | 'middle' | 'bottom';

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

/*
* Constants
*/

export const X_TICKS = 14;
export const Y_TICKS = 8;
export const DEFAULT_PADDING = 20;  // In pixels
export const FONT_STACK = ['Iowan Old Style', 'Apple Garamond', 'Baskerville', 'Times New Roman', 'Droid Serif', 'Times', 'Source Serif Pro', 'serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'];
export const DEFAULT_CANVAS_WIDTH = 860;
export const DEFAULT_CANVAS_HEIGHT = 500;
export const CANVAS_ASPECT_RATIO =  DEFAULT_CANVAS_HEIGHT / DEFAULT_CANVAS_WIDTH;

export const ORIGIN = [0, 0] as Point;


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


export class Config {
    private static _canvasWidth: number = DEFAULT_CANVAS_WIDTH;
    private static _canvasHeight: number = DEFAULT_CANVAS_HEIGHT;
    private static _canvasPadding: number = DEFAULT_PADDING;

    static get canvasWidth(): number {
        return Config._canvasWidth;
    }

    static set canvasWidth(newWidth: number) {
        Config._canvasWidth = newWidth;
    }

    static get canvasHeight(): number {
        return Config._canvasHeight;
    }

    static set canvasHeight(newHeight: number) {
        Config._canvasHeight = newHeight;
    }

    static get canvasPadding(): number {
        return Config._canvasPadding;
    }

    static set canvasPadding(newPadding: number) {
        Config._canvasPadding = newPadding;
    }
}
