import { Square } from '../../src/index';
import { Group } from '../../src/shapes/group';


const testGroup = new Group(
    new Square({ x: -0.5, y: 0.5, size: 1 }),
    new Square({ x: 0.5, y: 0.5, size: 1 }),
    new Square({ x: -0.5, y: -0.5, size: 1 }),
    new Square({ x: 0.5, y: -0.5, size: 1 }),
);


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
});
