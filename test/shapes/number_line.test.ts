import { X_TICKS } from '../../src/base';
import { Line } from '../../src/shapes/primitives/line';
import { Text } from '../../src/shapes/primitives/text';
import { NumberLine } from '../../src/shapes/number_line';
import { expectArraysClose } from '../utils';


describe('number line module', function() {
    test('should create a number line with defaults', () => {
        const n = new NumberLine();
        const cs = n.composedShapes();

        // Labels are shown by default, so the width isn't _exactly_ X_TICKS, but slightly above
        expect(n.width()).toBeCloseTo(X_TICKS, 0);
        // 1 shape for line, X_TICKS + 1 for ticks, and S_TICKS
        expect(cs.length).toEqual(1 + 2 * (X_TICKS + 1));
        // Verify that there are ticks and labels
        expect(cs[0]).toBeInstanceOf(Line);

        for (let i = 0; i < X_TICKS; i += 2) {
            expect(cs[i + 1]).toBeInstanceOf(Line);
            expect(cs[i + 2]).toBeInstanceOf(Text);
        }
    });


    test('should default to center and full width', () => {
        const n = new NumberLine({ showLabels: false, showTicks: false });
        const cs = n.composedShapes();

        expect(n.width()).toEqual(X_TICKS);
        expect(n.center()).toEqual([0, 0]);
    });


    test('should create with specified length', () => {
        const n = new NumberLine({ length: 10, showLabels: false, showTicks: false });
        const cs = n.composedShapes();

        expect(n.width()).toEqual(10);
    });


    test('should create with range', () => {
        const startRange = -20;
        const endRange = 60;

        const n = new NumberLine({ range: [startRange, endRange], showTicks: false });
        const cs = n.composedShapes();

        expect(cs[0]).toBeInstanceOf(Line);
        for (let i = 0; i <= Math.abs(startRange) + Math.abs(endRange); i += 2) {
            const l = cs[i + 1];

            expect(l).toBeInstanceOf(Text);
            expect((l as Text).text).toEqual(`${startRange + i}`);
        }
    });


    test('should create with specified tick step', () => {
        const length = 8;
        const tickStep = 2;
        const n = new NumberLine({ length, tickStep });
        const cs = n.composedShapes();

        // Width = 10, step size = 2, plus 1 for the end, resulting in 6 ticks
        // const numTicks = length / 2 + 1;
        const startRange = -length / 2;

        for (let i = 1; i < cs.length; i += 2) {
            expect(cs[i]).toBeInstanceOf(Line);
            expect(cs[i + 1]).toBeInstanceOf(Text);

            const expectedX = startRange + (i - 1);
            expect((cs[i] as Line).points()).toEqual([[expectedX, -0.1], [expectedX, 0.1]]);
            expect((cs[i + 1] as Text).text).toEqual(`${expectedX}`);
        }
    });


    test('should create with a specified center', () => {
        const n = new NumberLine({ center: [1, 2], length: 6, showTicks: false, showLabels: false });
        const cs = n.composedShapes();

        // When centered at (0, 0), the left is at (-3, 0) and the right is at (3, 0). Changing the center to (1, 2) shifts the endpoints by (1, 2)
        expect((cs[0] as Line).points()).toEqual([[-2, 2], [4, 2]]);
    });


    test('should rotate by specified angle', () => {
        const n = new NumberLine({ rotation: Math.PI / 2, length: 6, showTicks: false, showLabels: false });
        const cs = n.composedShapes();

        expectArraysClose((cs[0] as Line).points(), [[0, -3], [0, 3]]);
    });

});
