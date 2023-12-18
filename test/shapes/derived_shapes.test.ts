import { Colors } from '../../src/colors';
import { Dot } from '../../src/shapes/derived_shapes';


describe('dot tests', function() {
    test('dot should be created with a point', () => {
        const d = new Dot({ pt: [1, 2] });

        expect(d.center()).toEqual([1, 2]);
    });


    test('dot should be created with an x/y', () => {
        const d = new Dot({ x: 1, y: 2 });

        expect(d.center()).toEqual([1, 2]);
    });


    test('dot should be created at origin by default', () => {
        const d = new Dot();

        expect(d.center()).toEqual([0, 0]);
    });


    test('dot should be solid color', () => {
        const d = new Dot({ color: Colors.red() });

        expect(d.lineColor()).toEqual(Colors.red());
        expect(d.color()).toEqual(Colors.red());
    });
});
