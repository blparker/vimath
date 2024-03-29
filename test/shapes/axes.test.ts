import { describe, test, expect } from 'vitest';
import { X_TICKS, Y_TICKS } from '../../src/base';
import { Colors } from '../../src/colors';
import { Axes } from '../../src/shapes/axes';
import { NumberLine } from '../../src/shapes/number_line';
import { Line } from '../../src/shapes/primitives/line';
import { PointShape } from '../../src/shapes/primitives/point_shape';
import { Text } from '../../src/shapes/primitives/text';
import { expectArraysClose } from '../utils';


// function findLabel({ cs, x, y }: { cs: Shape[], x?: number, y?: number }) {
//     for (const shape of cs) {
//         if (!(shape instanceof Text)) continue;

//         const [cX, cY] = shape.center();

//         if (x !== undefined && cX === x) {
//             return shape;
//         } else if (y !== undefined && cY === y) {
//             return shape;
//         }
//     }

//     throw new Error(`Could not find shape for [${x}, ${y}]`);
// }


// function findTick({ cs, x, y }: { cs: Shape[], x?: number, y?: number }) {
//     for (const shape of cs) {
//         if (!(shape instanceof Line)) continue;

//         const [cX, cY] = shape.center();

//         if (x !== undefined && cX === x) {
//             return shape;
//         } else if (y !== undefined && cY === y) {
//             return shape;
//         }
//     }

//     throw new Error(`Could not find shape for [${x}, ${y}]`);
// }


// describe('axes module', function() {
//     test('should use provided ranges', () => {
//         const a = new Axes({ xRange: [-5, 5], yRange: [-2, 2] } as AxesConfig);

//         expect(a.xRange).toEqual([-5, 5]);
//         expect(a.yRange).toEqual([-2, 2]);
//     });

//     // test('should compute ranges from length', () => {
//     //     const a = new Axes({ xLength: 8, yLength: 4 } as AxesConfig);

//     //     expect(a.xRange).toEqual([-4, 4]);
//     //     expect(a.yRange).toEqual([-2, 2]);
//     // });

//     test('should determine origin', () => {
//         expect(new Axes().relativeOrigin()).toEqual([0, 0]);
//         expect(new Axes({ xRange: [-5, 5], yRange: [-2, 2] } as AxesConfig).relativeOrigin()).toEqual([0, 0]);
//         expect(new Axes({ xRange: [0, 5], yRange: [-2, 2] } as AxesConfig).relativeOrigin()).toEqual([-7, 0]);
//     });

//     test('should create correct number of ticks', () => {
//         const a = new Axes({ xRange: [-5, 5], yRange: [-2, 2] } as AxesConfig);
//         const numTicks = 5 + 5 + 2 + 2;
//         expect(a.composedShapes().length).toEqual(numTicks + 2); // +2 for the axes lines
//     });

//     test('should create X-ticks at correct locations', () => {
//         const a = new Axes({ xRange: [-2, 2], yRange: [-2, 2] } as AxesConfig);
//         const cs = a.composedShapes();

//         expect(findTick({ cs, x: -7 }).center()).toEqual([-7, 0])
//         expect(findTick({ cs, x: -3.5 }).center()).toEqual([-3.5, 0])
//         expect(findTick({ cs, x: 3.5 }).center()).toEqual([3.5, 0])
//         expect(findTick({ cs, x: 7 }).center()).toEqual([7, 0])
//     });

//     test('should create Y-ticks at correct locations', () => {
//         const a = new Axes({ xRange: [-2, 2], yRange: [-2, 2] } as AxesConfig);
//         const cs = a.composedShapes();

//         // First 4 ticks are X-ticks
//         expect(findTick({ cs, y: -4 }).center()).toEqual([0, -4])
//         expect(findTick({ cs, y: -2 }).center()).toEqual([0, -2])
//         expect(findTick({ cs, y: 2 }).center()).toEqual([0, 2])
//         expect(findTick({ cs, y: 4 }).center()).toEqual([0, 4])
//     });

//     test('should create X-labels', () => {
//         const a = new Axes({ xRange: [-2, 2], yRange: [-2, 2], showXAxisLabels: true, textMetrics: new TestTextMetrics(100, 10) } as AxesConfig);
//         const cs = a.composedShapes();

//         const labelBottom = -0.3869565217391305;

//         expect(findLabel({ cs, x: -7 }).center()).toEqual([-7, labelBottom])
//         expect(findLabel({ cs, x: -7 }).text).toEqual('-2');
//         expect(findLabel({ cs, x: -3.5 }).center()).toEqual([-3.5, labelBottom])
//         expect(findLabel({ cs, x: -3.5 }).text).toEqual('-1');
//         expect(findLabel({ cs, x: 3.5 }).center()).toEqual([3.5, labelBottom])
//         expect(findLabel({ cs, x: 3.5 }).text).toEqual('1');
//         expect(findLabel({ cs, x: 7 }).center()).toEqual([7, labelBottom])
//         expect(findLabel({ cs, x: 7 }).text).toEqual('2');
//     });

//     test('should create Y-labels', () => {
//         const a = new Axes({ xRange: [-2, 2], yRange: [-2, 2], showYAxisLabels: true, textMetrics: new TestTextMetrics(100, 10) } as AxesConfig);
//         const cs = a.composedShapes();

//         const labelLeft = -1.303658536585366;

//         expect(findLabel({ cs, y: -4 }).center()).toEqual([labelLeft, -4])
//         expect(findLabel({ cs, y: -4 }).text).toEqual('-2');
//         expect(findLabel({ cs, y: -2 }).center()).toEqual([labelLeft, -2])
//         expect(findLabel({ cs, y: -2 }).text).toEqual('-1');
//         expect(findLabel({ cs, y: 2 }).center()).toEqual([labelLeft, 2])
//         expect(findLabel({ cs, y: 2 }).text).toEqual('1');
//         expect(findLabel({ cs, y: 4 }).center()).toEqual([labelLeft, 4])
//         expect(findLabel({ cs, y: 4 }).text).toEqual('2');
//     });

//     test('should draw x and y-axes', () => {
//         const a = new Axes({ xRange: [0, 8], yRange: [0, 8], xLength: 8, yLength: 8, showAxisLabels: false, showAxisTicks: false } as AxesConfig);
//         const cs = a.composedShapes();

//         expect((cs[0] as PointShape).computedPoints()).toEqual([[-4, -4], [4, -4]]);
//         expect((cs[1] as PointShape).computedPoints()).toEqual([[-4, -4], [-4, 4]]);
//     });

//     test('should create origin in bottom left of available space', () => {
//         const a = new Axes({ xRange: [0, 8], yRange: [0, 8], xLength: 8, yLength: 8 } as AxesConfig);
//         const cs = a.composedShapes();

//         // expect(findTick({ cs,  }))
//         expect(a.relativeOrigin()).toEqual([-4, -4]);
//     });
// });


// describe('axes 2', () => {
//     test('should create x and y axes at (0, 0) that are 14 and 8 units long respectively', () => {
//         const axes = new Axes3();
//         axes.compose();

//         expect(axes.width()).toBeCloseTo(X_TICKS, 0);
//         expect(axes.height()).toBeCloseTo(Y_TICKS), 0;
//         expect(axes.center()).toEqual([0, 0]);
//     });

//     test('should create x and y axes with specific length', () => {
//         const axes = new Axes3({ xLength: 8, yLength: 4 });
//         axes.compose();

//         expect(axes.width()).toEqual(8);
//         expect(axes.height()).toEqual(4);
//         expect(axes.center()).toEqual([0, 0]);
//     });

//     test('should not create ticks', () => {
//         const axes = new Axes3({ xLength: 8, yLength: 4, showAxisTicks: false });
//         const cs = axes.composedShapes();

//         expect(cs.length).toEqual(2);
//         expect(cs[0]).toBeInstanceOf(NumberLine);
//         expect(cs[1]).toBeInstanceOf(NumberLine);

//         const xAxisShapes = (cs[0] as NumberLine).composedShapes();
//         const yAxisShapes = (cs[1] as NumberLine).composedShapes();

//         expect(xAxisShapes.length).toEqual(1 + 8);
//         // expect((xAxisShapes[0] as PointShape).computedPoints()).toEqual([[-4, 0], [4, 0]]);
//         // expect((cs[1] as PointShape).computedPoints()).toEqual([[0, -2], [0, 2]]);
//     });

//     // test('should not create labels', () => {
//     //     // Create a test to ensure that the labels are not created
//     //     const axes = new Axes2({ xLength: 8, yLength: 4, showAxisLabels: false });
//     //     const cs = axes.composedShapes();

//     //     expect(cs.length).toEqual(2);
//     //     expect(cs[0]).toBeInstanceOf(Line);
//     //     expect(cs[1]).toBeInstanceOf(Line);
//     // });

//     // test('should create ticks', () => {
//     //     // Create a test to ensure that the ticks are created
//     //     const axes = new Axes2({ xLength: 8, yLength: 4, showAxisTicks: true });
//     //     const cs = axes.composedShapes();

//     //     // 2 axes, 8 ticks for X-axis, 4 ticks for Y-axis
//     //     expect(cs.length).toEqual(14);
//     //     cs.forEach(e => expect(e).toBeInstanceOf(Line));
//     // });

//     // test('should create ticks and labels', () => {
//     //     // Create a test to ensure that the ticks are created
//     //     const axes = new Axes2({ xLength: 8, yLength: 4, showAxisTicks: true, showAxisLabels: true });
//     //     const cs = axes.composedShapes();

//     //     // 2 axes, 8 ticks for X-axis, 4 ticks for Y-axis, 8 labels for X-axis, 4 labels for Y-axis
//     //     expect(cs.length).toEqual(26);

//     //     // First 14 are ticks
//     //     cs.slice(0, 14).forEach(e => expect(e).toBeInstanceOf(Line));

//     //     // Next 12 are labels
//     //     cs.slice(14).forEach(e => expect(e).toBeInstanceOf(Text));

//     //     expect((cs[14] as Text).text).toEqual('-4');
//     //     expect((cs[14 + 7] as Text).text).toEqual('4');
//     //     expect((cs[22] as Text).text).toEqual('-2');
//     //     expect((cs[25] as Text).text).toEqual('2');
//     // });

//     // test('should create shifted origin if range is skewed', () => {
//     //     const axes = new Axes2({ xLength: 8, yLength: 4, xRange: [-2, 6] });
//     //     const cs = axes.composedShapes();

//     //     expect((cs[0] as PointShape).computedPoints()).toEqual([[-4, 0], [4, 0]]);
//     //     expect((cs[1] as PointShape).computedPoints()).toEqual([[-2, -2], [-2, 2]]);
//     // });

//     // test('should shift axes', () => {
//     //     const axes = new Axes2({ xLength: 8, yLength: 4 });
//     //     const cs = axes.composedShapes();

//     //     axes.shift([1, 2]);

//     //     expect((cs[0] as PointShape).computedPoints()).toEqual([[-3, 2], [5, 2]]);
//     //     expect((cs[1] as PointShape).computedPoints()).toEqual([[1, 0], [1, 4]]);
//     // });
// });


describe('axes module', () => {

    test('should create default axes with the origin at (0, 0) and have full width and height', () => {
        const a = new Axes();
        const cs = a.composedShapes();

        expect(cs.length).toEqual(2);
        expect(cs[0]).toBeInstanceOf(NumberLine);
        expect(cs[1]).toBeInstanceOf(NumberLine);

        expect(a.width()).toBeCloseTo(X_TICKS, 0);
        expect(a.height()).toBeCloseTo(Y_TICKS, 0);

        expectArraysClose([a.center()], [[0, 0]], 0);
    });


    test('should create X-axis with length, ticks, and labels', () => {
        const a = new Axes({ xLength: 6 });
        const cs = (a.composedShapes()[0] as NumberLine).composedShapes();

        expect(cs[0]).toBeInstanceOf(Line);

        for (let i = 1; i < cs.length; i += 2) {
            expect(cs[i]).toBeInstanceOf(Line);
            expect(cs[i + 1]).toBeInstanceOf(Text);
        }

        expect((cs[0] as Line).computedPoints()).toEqual([[-3, 0], [3, 0]]);
    });


    test('should create Y-axis with length, ticks, and labels', () => {
        const a = new Axes({ yLength: 4 });
        const cs = (a.composedShapes()[1] as NumberLine).composedShapes();

        expect(cs[0]).toBeInstanceOf(Line);

        for (let i = 1; i < cs.length; i += 2) {
            expect(cs[i]).toBeInstanceOf(Line);
            expect(cs[i + 1]).toBeInstanceOf(Text);
        }

        expectArraysClose((cs[0] as Line).computedPoints(), [[0, -2], [0, 2]], 0);
    });


    test('should move origin', () => {
        const a = new Axes({ xLength: 8, yLength: 4, xRange: [-2, 6], yRange: [-1, 3], showAxisLabels: false, showAxisTicks: false });
        const cs = a.composedShapes();

        const xShapes = (cs[0] as NumberLine).composedShapes();
        const yShapes = (cs[1] as NumberLine).composedShapes();

        expectArraysClose((xShapes[0] as Line).computedPoints(), [[-4, -1], [4, -1]], 0);
        expectArraysClose((yShapes[0] as Line).computedPoints(), [[-2, -2], [-2, 2]], 0);
    });


    test('should determine origin being offset', () => {
        const a = new Axes({ xLength: 8, yLength: 4, xRange: [0, 8], yRange: [0, 4], showAxisLabels: false, showAxisTicks: false });
        const cs = a.composedShapes();

        const xShapes = (cs[0] as NumberLine).composedShapes();
        const yShapes = (cs[1] as NumberLine).composedShapes();

        expectArraysClose((xShapes[0] as Line).computedPoints(), [[-4, -2], [4, -2]], 0);
        expectArraysClose((yShapes[0] as Line).computedPoints(), [[-4, -2], [-4, 2]], 0);
    });


    test('should determine origin being offset when start of range is is not 0', () => {
        const a = new Axes({ xLength: 8, yLength: 4, xRange: [2, 8], yRange: [0, 4], showAxisLabels: false, showAxisTicks: false });
        const cs = a.composedShapes();

        const xShapes = (cs[0] as NumberLine).composedShapes();
        const yShapes = (cs[1] as NumberLine).composedShapes();

        expectArraysClose((xShapes[0] as Line).computedPoints(), [[-4, -2], [4, -2]], 0);
        expectArraysClose((yShapes[0] as Line).computedPoints(), [[-4, -2], [-4, 2]], 0);
    });


    test('should use provided color for area under axes', () => {
        const a = new Axes({ xLength: 8, yLength: 4, xRange: [2, 8], yRange: [0, 4], showAxisLabels: false, showAxisTicks: false });
        const p = a.plot(() => 2, { color: Colors.red() }) as PointShape;
        const area = a.area({ plot: p, xRange: [1, 3], color: Colors.blue({ opacity: 0.5 }) });

        expect(area.color()).toEqual(Colors.blue({ opacity: 0.5 }));
    });


    test('should use plot color for area under axes', () => {
        const a = new Axes({ xLength: 8, yLength: 4, xRange: [2, 8], yRange: [0, 4], showAxisLabels: false, showAxisTicks: false });
        const p = a.plot(() => 2, { color: Colors.red() }) as PointShape;
        const area = a.area({ plot: p, xRange: [1, 3] });

        expect(area.color()).toEqual(Colors.red({ opacity: 0.3 }));
    });
});
