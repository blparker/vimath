import { Point, HAlign } from "../src/base";
import { RGBA } from "../src/colors";
import { Canvas } from "../src/renderers/renderer";
import { Scene } from "../src/scene";
import { TextBaseline } from "../src/shapes/text";
import { Line } from "../src/shapes/base_shapes";
import { Animation } from '../src/animations/animations';


class TestCanvas implements Canvas {
    arc({ center, radius, angle, lineWidth, color }: { center: Point; radius: number; angle: number; lineWidth: number; color: RGBA; }): void {}

    line({ from, to, lineWidth, color }: { from: Point; to: Point; lineWidth: number; color: RGBA; }): void {}

    path({ points, lineWidth, lineColor, color }: { points: Point[]; lineWidth: number; lineColor: RGBA; color: RGBA; }): void {}

    text({ text, x, y, size, color, align, baseline, vertical }: { text: string; x: number; y: number; size: number; color: RGBA; align: HAlign; baseline: TextBaseline; vertical?: boolean | undefined; }): void {}

    image({ image, x, y, align }: { image: HTMLImageElement; x: number; y: number; align: HAlign; }): void {}

    clear(): void {}
}


class TestAnimation extends Animation {
    update(pctComplete: number): void {
        
    }

    resetState(): void {
        
    }
}


describe('scene module', () => {

    test('should clear and render scene items', () => {
        const anim = new TestAnimation({ duration: 1000 });

        class TestScene extends Scene {
            compose(): Scene {
                const line = new Line({ from: [0, 0], to: [1, 0] });
                this.add(line, anim);

                return this;
            }
        }

        const canvas = new TestCanvas();
        const clearSpy = jest.spyOn(canvas, 'clear');
        const lineSpy = jest.spyOn(canvas, 'line');
        const pathSpy = jest.spyOn(canvas, 'path');
        const animSpy = jest.spyOn(anim, 'tick');

        const scene = new TestScene({ canvas }).compose();
        scene.nextTick(0);

        expect(clearSpy).toHaveBeenCalledTimes(1);
        expect(pathSpy).toHaveBeenCalledTimes(1);
        expect(animSpy).toHaveBeenCalledTimes(1);
        expect(animSpy.mock.calls[0][0]).toBe(0);
        expect(animSpy.mock.results[0].value).toBe(false);

        scene.nextTick(1000);
        expect(animSpy.mock.calls[1][0]).toBe(1000);
        expect(animSpy.mock.results[1].value).toBe(true);
    });

});
