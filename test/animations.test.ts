import { Animation, ChangeFillColor, MoveAlongPath, MoveToTarget, Orbit, Rotate, Scale, ShiftTarget, Animatable } from '../src/animations/animations';
import { LEFT, Point, Shift } from '../src/base';
import { Square } from '../src/shapes/primitives/square';
import { Colors } from '../src/colors';
import { Easing } from '../src/easing';
import { zip } from '../src/math';
import { Dot } from '../src/shapes/derived_shapes';
import structuredClone from '@ungap/structured-clone'


function expectArraysClose(a1: number[][], a2: number[][]) {
    if (a1.length !== a2.length) {
        throw new Error('Must compare arrays of equal length');
    }

    for (const [p1, p2] of zip(a1, a2)) {
        expect(p1[0]).toBeCloseTo(p2[0]);
        expect(p1[1]).toBeCloseTo(p2[1]);
    }
}


class TestAnimation extends Animation {
    updateVal: number | null = null;
    isReset: boolean | null = null;

    constructor(duration: number) {
        super({ duration, })
    }

    update(delta: number, reversing: boolean): Animatable[] {
        this.updateVal = delta;

        return [];
    }

    resetState(): void {
        this.isReset = true;
    }
}


describe('animations module', () => {

    test('should start not running', () => {
        const test = new TestAnimation(1000);
        expect(test.isRunning()).toBeFalsy();
    });


    test('should be running after calling update', () => {
        const test = new TestAnimation(1000);
        test.tick(1);

        expect(test.isRunning()).toBeTruthy();
    });


    test('update should be called with percentage complete', () => {
        const test = new TestAnimation(1000);
        // The first time sent to tick sets the start time (in this case, 0)
        test.tick(0);

        // Send half the duration
        test.tick(500);

        expect(test.updateVal).toEqual(0.5);
    });


    test('update should be called with percentage complete (100%)', () => {
        const test = new TestAnimation(1000);
        // The first time sent to tick sets the start time (in this case, 0)
        test.tick(0);
        test.tick(1000);

        expect(test.updateVal).toEqual(1.0);
    });


    test('tick should return array', () => {
        const test = new TestAnimation(1000);

        expect(test.tick(0)).toEqual([]);
    });


    test('should report completition status', () => {
        const test = new TestAnimation(1000);

        test.tick(0);
        expect(test.isComplete(0)).toBeFalsy();
        test.tick(1001);
        expect(test.isComplete(1001)).toBeTruthy();
    });


    test('update should not get called beyond duration', () => {
        const test = new TestAnimation(1000);
        // The first time sent to tick sets the start time (in this case, 0)
        test.tick(0);
        test.tick(1000);

        expect(test.updateVal).toEqual(1.0);

        test.tick(2000);
        expect(test.updateVal).toEqual(1.0);
    });


    test('reset should allow update to be called again', () => {
        const test = new TestAnimation(1000);
        test.tick(0);
        test.tick(1000);

        test.reset();

        test.tick(0);
        test.tick(500);
        expect(test.updateVal).toEqual(0.5);
    });

});


describe('scale animation', () => {

    test('should double size', () => {
        const target = new Square({ size: 1 });
        const a = new Scale({ target, scaleAmount: 2, duration: 1000 });

        a.tick(0);
        a.tick(1000);

        expect(target.currentScale).toEqual(2);
    });

    test('should scale object appropriately', () => {
        const target = new Square({ size: 1 });
        const a = new Scale({ target, scaleAmount: 2, duration: 1000, easing: Easing.linear });

        a.tick(0);
        a.tick(250);
        expect(target.currentScale).toEqual(1.25);

        a.tick(500);
        a.tick(1000);

        expect(target.computedPoints()).toEqual([[-1, 1], [1, 1], [1, -1], [-1, -1]]);
    });
});


describe('move to target animation module', () => {

    test('should move the center', () => {
        const target = new Square();
        const destination = new Square({ x: 2, y: 2 });

        const a = new MoveToTarget({ target, destination, duration: 1000, })
        a.tick(0);
        a.tick(500);  // Half way done

        expect(target.center()).toEqual([1, 1]);
    });

    test('should move the center of a dot', () => {
        const target = new Dot();

        const a = new MoveToTarget({ target, destination: [0, 2], duration: 1000 })
        a.tick(0);
        a.tick(1000);

        expect(target.center()).toEqual([0, 2]);
    });
});


describe('change fill color animation module', () => {

    test('should change the fill color', () => {
        const target = new Square();

        const a = new ChangeFillColor({ target, toColor: Colors.white(), duration: 1000, });
        a.tick(0);
        a.tick(1000);

        expect(target.color()).toEqual(Colors.white());
    });

    test('reset should change the fill color back to the original', () => {
        const target = new Square();
        const startColor = structuredClone(target.color());

        const a = new ChangeFillColor({ target, toColor: Colors.white(), duration: 1000, });
        a.tick(0);
        a.tick(1000);

        a.reset();
        expect(target.color()).toEqual(startColor);
    });
});


describe('move along path animation module', () => {

    test('should move the center of the target along a path of points', () => {
        const target = new Square({ x: 0, y: 0 });
        const path = [[0, 0], [0.25, 0], [0.5, 0], [0.75, 0], [1, 0]] as Point[];

        const a = new MoveAlongPath({ target, path, duration: 1000, easing: Easing.linear });
        a.tick(0);
        a.tick(250);
        expect(target.center()).toEqual([0.25, 0]);

        a.tick(500);
        expect(target.center()).toEqual([0.5, 0]);

        a.tick(750);
        expect(target.center()).toEqual([0.75, 0]);

        a.tick(1000);
        expect(target.center()).toEqual([1, 0]);
    });

});


describe('orbit animation module', () => {

    test('should orbit a target around a point', () => {
        const target = new Square({ x: 1, y: 0 });
        const orbitPoint = [0, 0] as Point;

        const a = new Orbit({ target, center: orbitPoint, duration: 1000, easing: Easing.linear });
        a.tick(0);

        // After 25% of elapsed time, the center should be π/2 of the way around
        a.tick(250);
        // Damnit, why won't this stupid shit work?
        // expect(target.center() as number[]).toBeCloseToArray([0, 1]);
        expect(target.center()[0]).toBeCloseTo(0);
        expect(target.center()[1]).toBeCloseTo(1);

        a.tick(500);
        expect(target.center()[0]).toBeCloseTo(-1);
        expect(target.center()[1]).toBeCloseTo(0);

        a.tick(1000);
        expect(target.center()[0]).toBeCloseTo(1);
        expect(target.center()[1]).toBeCloseTo(0);
    });

});


describe('shift target animation module', () => {

    test('should shift', () => {
        const target = new Square({ x: 0, y: 0 });

        const a = new ShiftTarget({ target, shifts: [LEFT(1)], duration: 1000, easing: Easing.linear });
        a.tick(0);
        a.tick(1000);

        expect(target.center()).toEqual([-1, 0]);
    });

});


describe('rotate animation module', () => {

    test('should rotate', () => {
        const target = new Square({ x: 0, y: 0, size: 2 });

        const a = new Rotate({ target, angle: Math.PI * 2, duration: 1000, easing: Easing.linear });
        a.tick(0);

        a.tick(250);
        expectArraysClose(target.computedPoints(), [[-1, -1], [-1, 1], [1, 1], [1, -1]]);

        a.tick(1000);
        expectArraysClose(target.computedPoints(), [[-1, 1], [1, 1], [1, -1], [-1, -1]]);
    });

});
