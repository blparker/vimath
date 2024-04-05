import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import { Scene } from '../src/scene';
import { Line } from '../src/shapes/derived/line';
import { Canvas } from '../src/canvas';
import { Shape } from '../src/shapes';
import { Interaction } from '../src/canvas';
import { BaseAnimation } from '../src/animation/animation';


function getTestCanvas() {
    return new class implements Canvas {
        renderShape(shape: Shape): void {
        }

        line(line: Line): void {
        }

        clear(): void {
        }

        addInteraction(interation: Interaction): void {
        }

        width(): number {
            return 0;
        }

        height(): number {
            return 0;
        }
    };
}


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


test.skip('should render shape', () => {
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


test.skip('should render animation', () => {
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
