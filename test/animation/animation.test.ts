import { expect, test, vi } from 'vitest';
import { BaseAnimation } from '../../src/animation/animation';


class TestAnimation extends BaseAnimation {
    update(pctComplete: number, starting: boolean): void {
        
    }
}


test('should set animation start ', () => {
    const a = new TestAnimation();
    // An animation that hasn't started yet should not be running
    expect(a.isRunning()).toBeFalsy();

    // Start the animation
    a.tick(0);

    expect(a.isRunning()).toBeTruthy();
});


test('should call update with percentage complete', () => {
    const a = new TestAnimation();
    const update = vi.spyOn(a, 'update');

    a.tick(0);
    a.tick(500);
    a.tick(1001);

    expect(update).toHaveBeenCalledTimes(3);
    expect(update).toHaveBeenNthCalledWith(1, 0, true);
    expect(update).toHaveBeenNthCalledWith(2, 0.5, false);
    expect(update).toHaveBeenNthCalledWith(3, 1, false);

    expect(a.isComplete()).toBeTruthy();
});


// test('should reverse', () => {
//     const a = new TestAnimation({ reverse: true, yoyo: false });
//     const update = vi.spyOn(a, 'update');

//     a.tick(0);
//     a.tick(1000);

//     expect(update).toHaveBeenNthCalledWith(2, 1, false);

//     // Begin reversing. Percent complete starts back over at 25%
//     a.tick(1250);

//     expect(update).toHaveBeenNthCalledWith(3, 0.25, false);
//     expect(a.isReversing()).toBeTruthy();

//     a.tick(1750);

//     expect(update).toHaveBeenNthCalledWith(4, 0.75, false);
//     expect(a.isReversing()).toBeTruthy();

//     // Reverse again. Percent complete starts back over at 25%
//     a.tick(2000);
//     a.tick(2250);

//     expect(update).toHaveBeenNthCalledWith(6, 0.25, false);
//     expect(a.isReversing()).toBeFalsy();
// });


// test('should reverse with yoyo', () => {
//     const a = new TestAnimation({ reverse: true, yoyo: true });
//     const update = vi.spyOn(a, 'update');

//     a.tick(0);
//     a.tick(1000);

//     a.tick(1250);

//     expect(update).toHaveBeenNthCalledWith(3, 0.75, false);
//     expect(a.isReversing()).toBeTruthy();
// });
