<<<<<<< HEAD
// @ts-nocheck
import { describe, test, expect } from 'vitest';
import { Point, HAlign } from '../src/base';
import { RGBA } from '../src/colors';
import { Canvas } from '../src/renderers/renderer';
import { Scene } from '../src/scene';
import { TextBaseline } from '../src/shapes/primitives/text';
import { Animation, Animatable } from '../src/animations/animations';
import { SvgCommand } from '../src/shapes/brace';

class TestCanvas implements Canvas {
    /* ts:ignore */
    onMouseMove(listener: (pt: Point) => void): void;
    onMouseMove(listener: (pt: Point) => void): void;
    onMouseMove(listener: unknown): void {
        throw new Error('Method not implemented.');
    }
    onMouseUp(listener: (pt: Point) => void): void {
        throw new Error('Method not implemented.');
    }
    onMouseOut(listener: () => void): void {
        throw new Error('Method not implemented.');
    }

    arc({ center, radius, angle, lineWidth, color }: { center: Point; radius: number; angle: number; lineWidth: number; color: RGBA; }): void {}

    line({ from, to, lineWidth, color }: { from: Point; to: Point; lineWidth: number; color: RGBA; }): void {}

    path({ points, lineWidth, lineColor, color }: { points: Point[]; lineWidth: number; lineColor: RGBA; color: RGBA; }): void {}

    text({ text, x, y, size, color, align, baseline, vertical }: { text: string; x: number; y: number; size: number; color: RGBA; align: HAlign; baseline: TextBaseline; vertical?: boolean | undefined; }): void {}

    image({ image, x, y, align }: { image: HTMLImageElement; x: number; y: number; align: HAlign; }): void {}

    svgPath({ path, lineWidth }: { path: SvgCommand[]; lineWidth: number; }): void {}

    clear(): void {}
}


class TestAnimation extends Animation {
    update(pctComplete: number, reversing: boolean): Animatable[] {
        return [];
    }

    resetState(): void {
        
    }
}


describe('scene module', () => {

    // test('should clear and render scene items', () => {
    //     const anim = new TestAnimation({ duration: 1000 });

    //     class TestScene extends Scene {
    //         compose(): Scene {
    //             const line = new Line({ from: [0, 0], to: [1, 0] });
    //             this.add(line, anim);

    //             return this;
    //         }
    //     }

    //     const canvas = new TestCanvas();
    //     const clearSpy = jest.spyOn(canvas, 'clear');
    //     const lineSpy = jest.spyOn(canvas, 'line');
    //     const pathSpy = jest.spyOn(canvas, 'path');
    //     const animSpy = jest.spyOn(anim, 'tick');

    //     const scene = new TestScene({ canvas }).compose();
    //     scene.nextTick(0);

    //     expect(clearSpy).toHaveBeenCalledTimes(1);
    //     expect(pathSpy).toHaveBeenCalledTimes(1);
    //     expect(animSpy).toHaveBeenCalledTimes(1);
    //     expect(animSpy.mock.calls[0][0]).toBe(0);
    //     expect(animSpy.mock.results[0].value).toBe(false);

    //     scene.nextTick(1000);
    //     expect(animSpy.mock.calls[1][0]).toBe(1000);
    //     expect(animSpy.mock.results[1].value).toBe(true);
    // });


    test('should wait until animation is done before starting next', () => {
        const anim1 = new TestAnimation({ duration: 1000 });
        const anim2 = new TestAnimation({ duration: 1000 });

        class TestScene extends Scene {
            compose(): Scene {
                this.add(anim1);
                this.add(anim2);

                return this;
            }
        }

        const canvas = new TestCanvas();
        const scene = new TestScene({ canvas }).compose();

        // Start the thing
        scene.nextTick(0);

        expect(anim1.isRunning()).toBe(true);
        expect(anim2.isRunning()).toBe(false);

        scene.nextTick(500);

        expect(anim1.isRunning()).toBe(true);
        expect(anim2.isRunning()).toBe(false);

        scene.nextTick(1000);

        expect(anim1.isComplete(1000)).toBe(true);
        expect(anim2.isRunning()).toBe(true);
    });
});
=======
import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import { Scene } from '../src/scene';
import { Line } from '../src/shapes/primitives/line';
import { Canvas } from '../src/canvas';
import { BezierCurve, Shape, PointShape } from '../src/shapes';
import { BaseAnimation } from '../src/animation/animation';
import { Arc } from '../src/shapes/primitives/arc';
import { getTestCanvas } from './test_utils';


let rafCallback: FrameRequestCallback = () => {};


beforeEach(() => {
    vi.useFakeTimers();

    globalThis.requestAnimationFrame = cb => {
        rafCallback = cb;
        return 0;
    };

    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(cb => {
        rafCallback = cb;
        return 0;
    });
});

afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();

    rafCallback = () => {};
});


test('should render shape', () => {
    const l = new Line({ from: [-2, 0], to: [2, 0] });
    const testCanvas = getTestCanvas();

    const scene = new class extends Scene {
        constructor({ canvas = testCanvas }: { canvas?: Canvas } = { canvas: testCanvas }) {
            super({ canvas });
        }

        compose(): void {
            this.add(l);
        }
    };

    vi.spyOn(testCanvas, 'renderShape');

    scene.render();

    rafCallback(0);
    rafCallback(500);

    expect(testCanvas.renderShape).toHaveBeenCalled();
    expect(testCanvas.renderShape).toHaveBeenCalledWith(l);
});


test('should render animation', () => {
    const mockUpdate = vi.fn();

    class TestAnimation extends BaseAnimation {
        update = mockUpdate;
    }

    const testAnimation = new TestAnimation();
    const testCanvas = getTestCanvas();

    const scene = new class extends Scene {
        constructor({ canvas = testCanvas }: { canvas?: Canvas } = { canvas: testCanvas }) {
            super({ canvas });
        }

        compose(): void {
            this.add(testAnimation);
        }
    };

    vi.spyOn(testAnimation, 'update');

    scene.render();

    rafCallback(0);
    rafCallback(500);

    // // Should call update on the animation
    expect(testAnimation.update).toHaveBeenCalled();

    rafCallback(1000);
    rafCallback(1001);

    // After the duration, the animation is complete
    expect(testAnimation.isComplete()).toBeTruthy();
});


test('should play two animations back to back', () => {
    const mockUpdate = vi.fn();

    class TestAnimation extends BaseAnimation {
        update = mockUpdate;
    }

    const testCanvas = getTestCanvas();
    const anim1 = new TestAnimation();
    const anim2 = new TestAnimation();

    const scene = new class extends Scene {
        constructor({ canvas = testCanvas }: { canvas?: Canvas } = { canvas: testCanvas }) {
            super({ canvas });
        }

        compose(): void {
            this.add(anim1);
            this.add(anim2);
        }
    };
});
>>>>>>> refactor/master
