import { Square } from '../../src/shapes/primitives/square';
import { Group } from '../../src/shapes/group';
import { LEFT, OFFSET_GUTTER, RIGHT, UP, DOWN } from '../../src/base';


describe('group shape', function() {
    // test('should get center', () => {
    //     const g = new Group(
    //         new Square({ x: -0.5, y: 0.5, size: 1 }),
    //         new Square({ x: 0.5, y: 0.5, size: 1 }),
    //         new Square({ x: -0.5, y: -0.5, size: 1 }),
    //         new Square({ x: 0.5, y: -0.5, size: 1 }),
    //     );

    //     expect(g.center()).toEqual([0, 0]);
    // });
    let testGroup: Group;

    beforeEach(() => {
        testGroup = new Group(
            new Square({ x: -0.5, y: 0.5, size: 1 }),
            new Square({ x: 0.5, y: 0.5, size: 1 }),
            new Square({ x: -0.5, y: -0.5, size: 1 }),
            new Square({ x: 0.5, y: -0.5, size: 1 }),
        );
    });

    test('should get top', () => {
        expect(testGroup.top()).toEqual([0, 1]);
    });

    test('should get right', () => {
        expect(testGroup.right()).toEqual([1, 0]);
    });

    test('should get bottom', () => {
        expect(testGroup.bottom()).toEqual([0, -1]);
    });

    test('should get left', () => {
        expect(testGroup.left()).toEqual([-1, 0]);
    });

    test('should get center', () => {
        expect(testGroup.center()).toEqual([0, 0]);
    });

    test('should get width', () => {
        expect(testGroup.width()).toEqual(2);
    });

    test('should get height', () => {
        expect(testGroup.height()).toEqual(2);
    });

    test('should move center', () => {
        testGroup.moveCenter([-1, 1]);

        // Moving the center should place left [-2, 0.5]
        expect(testGroup.center()).toEqual([-1, 1]);
        expect(testGroup.left()).toEqual([-2, 1]);
    });

    test('should put group next to the right of another shape', () => {
        const centeredSquare = new Square({ x: 0, y: 0, size: 1 });
        testGroup.nextTo(centeredSquare, RIGHT());

        /*
         * The total width of the group is 2, and by default is the left is at [-1, 0]. The square has a right side at [0.5, 0], so by putting
         * the group to the right of the square, the new left of the group should be [-0.5 + OFFSET_GUTTER, 0]
         */
        expect(testGroup.left()).toEqual([0.5 + OFFSET_GUTTER, 0]);
    });

    test('should put group next to the left of another shape', () => {
        const centeredSquare = new Square({ x: 0, y: 0, size: 1 });
        testGroup.nextTo(centeredSquare, LEFT());
        expect(testGroup.right()).toEqual([-0.5 - OFFSET_GUTTER, 0]);
    });

    test('should put group next to the top of another shape', () => {
        const centeredSquare = new Square({ x: 0, y: 0, size: 1 });
        testGroup.nextTo(centeredSquare, UP());
        expect(testGroup.bottom()).toEqual([0, 0.5 + OFFSET_GUTTER]);
    });

    test('should put group next to the bottom of another shape', () => {
        const centeredSquare = new Square({ x: 0, y: 0, size: 1 });
        testGroup.nextTo(centeredSquare, DOWN());
        expect(testGroup.top()).toEqual([0, -0.5 - OFFSET_GUTTER]);
    });
});
