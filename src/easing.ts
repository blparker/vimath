export type EasingFunction = (x: number) => number;


export class Easing {
    static easeInOutCubic(x: number): number {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    static linear(x: number): number {
        return x;
    }
}
