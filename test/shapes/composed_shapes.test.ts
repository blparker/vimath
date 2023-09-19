// import { describe, expect, test } from '@jest/globals';
// import { describe, expect, test } from '../node_modules/@jest/globals/build/index';
import { PointShape, Line, Triangle, Square } from '../../src/shapes/base_shapes';
import { Point, LEFT, UP } from '../../src/base';
import { ComposableShape } from '../../src/shapes/composed_shape';


class TestShape extends ComposableShape {
    compose(): ComposableShape {
        this.add(
            new Square({ x: -1, y: 0, size: 2 }),
            new Square({ x: 1, y: 1, size: 2 }),
        );
        return this;
    }
}


describe('composable shape module', function() {

    test('should get sizes of composed shape', () => {
        const s = new TestShape().compose();

        expect(s.height()).toEqual(3);
        expect(s.width()).toEqual(4);
    });

    test('should get sides of composed shape', () => {
        const s = new TestShape().compose();

        expect(s.left()).toEqual([ -2, 0.5 ]);
        expect(s.right()).toEqual([ 2, 0.5 ]);
        expect(s.top()).toEqual([ 0, 2 ]);
        expect(s.bottom()).toEqual([ 0, -1 ]);
        expect(s.center()).toEqual([ 0, 0.5 ]);
    });

    test('should shift composed shape', () => {
        const s = new TestShape().compose().shift(LEFT(1), UP(1));

        expect(s.left()).toEqual([ -3, 1.5 ]);
        expect(s.right()).toEqual([ 1, 1.5 ]);
        expect(s.top()).toEqual([ -1, 3 ]);
        expect(s.bottom()).toEqual([ -1, 0 ]);
        expect(s.center()).toEqual([ -1, 1.5 ]);
    });

    test('should move an object', () => {
        const s = new TestShape().compose().moveTo([ -1, 1 ]);

        expect(s.center()).toEqual([ -1, 1 ]);
    });

    test('should put a composed shape next to another shape defaulted to the right', () => {
        // const s = new TestShape().compose().nextTo(s1);
        class ComposedSquare extends ComposableShape {
            compose(): ComposableShape {
                this.add(new Square({ x: 0, y: 0, size: 2 }));
                return this;
            }
        }

        const s1 = new Square({ x: 0, y: 0, size: 2 });
        const s2 = new ComposedSquare().compose().nextTo(s1);

        const offsetGutter = 0.2;

        const newLeft = s2.left();

        // expect(s2.left()).toEqual([ 1 + offsetGutter, 0 ]);
        expect(newLeft[0]).toBeCloseTo(1 + offsetGutter);
        expect(newLeft[1]).toBeCloseTo(0);
    });

    test('should put a composed shape next to another shape with direction', () => {
        // const s = new TestShape().compose().nextTo(s1);
        class ComposedSquare extends ComposableShape {
            compose(): ComposableShape {
                this.add(new Square({ x: 0, y: 0, size: 2 }));
                return this;
            }
        }

        const s1 = new Square({ x: 0, y: 0, size: 2 });
        const s2 = new ComposedSquare().compose().nextTo(s1, UP());

        const offsetGutter = 0.2;

        const newTop = s2.center();

        // expect(s2.left()).toEqual([ 1 + offsetGutter, 0 ]);
        expect(newTop[0]).toBeCloseTo(0);
        expect(newTop[1]).toBeCloseTo(2 + offsetGutter);
    });

    test('should scale a composed shape', () => {
        class ComposedSquare extends ComposableShape {
            compose(): ComposableShape {
                this.add(
                    new Square({ x: -0.5, y: 0.5, size: 1 }),
                    new Square({ x: 0.5, y: 0.5, size: 1 }),
                    new Square({ x: 0.5, y: -0.5, size: 1 }),
                    new Square({ x: -0.5, y: -0.5, size: 1 })
                );

                return this;
            }
        }

        const s = new ComposedSquare().compose().scale(2) as ComposableShape;
        expect(s.width()).toEqual(4);
        expect(s.composedShapes()[0].center()).toEqual([-1, 1]);
        expect(s.composedShapes()[1].center()).toEqual([1, 1]);
        expect(s.composedShapes()[2].center()).toEqual([1, -1]);
        expect(s.composedShapes()[3].center()).toEqual([-1, -1]);
    });

    test('should rotate a composed shape', () => {
        class ComposedSquare extends ComposableShape {
            compose(): ComposableShape {
                this.add(new Square({ x: 1, y: 1, size: 1 }));
                this.add(new Square({ x: -1, y: -1, size: 1 }));
                return this;
            }
        }

        const s = new ComposedSquare().compose().rotate(Math.PI / 4) as ComposableShape;
        const actual = s.composedShapes()[0].center();
        const expected = [0, Math.sqrt(2)];

        actual.forEach((a, i) => expect(a).toBeCloseTo(expected[i]));
    });

    test('should move center of composed shape', () => {
        class ComposedSquare extends ComposableShape {
            compose(): ComposableShape {
                this.add(new Square({ x: 1, y: 1, size: 1 }));
                this.add(new Square({ x: -1, y: -1, size: 1 }));
                return this;
            }
        }

        const s = new ComposedSquare().compose();
        expect(s.center()).toEqual([0, 0]);
        expect(s.moveCenter([2, 2]).center()).toEqual([2, 2]);
    });
});
