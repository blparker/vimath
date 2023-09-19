import { Axes, AxesConfig } from "../../src/shapes/axes";
import { TestTextMetrics } from '../utils';
import { Text } from '../../src/shapes/text';
import { Line, PointShape, Shape } from "../../src/shapes/base_shapes";


function findLabel({ cs, x, y }: { cs: Shape[], x?: number, y?: number }) {
    for (const shape of cs) {
        if (!(shape instanceof Text)) continue;

        const [cX, cY] = shape.center();

        if (x !== undefined && cX === x) {
            return shape;
        } else if (y !== undefined && cY === y) {
            return shape;
        }
    }

    throw new Error(`Could not find shape for [${x}, ${y}]`);
}


function findTick({ cs, x, y }: { cs: Shape[], x?: number, y?: number }) {
    for (const shape of cs) {
        if (!(shape instanceof Line)) continue;

        const [cX, cY] = shape.center();

        if (x !== undefined && cX === x) {
            return shape;
        } else if (y !== undefined && cY === y) {
            return shape;
        }
    }

    throw new Error(`Could not find shape for [${x}, ${y}]`);
}


describe('axes module', function() {
    test('should use provided ranges', () => {
        const a = new Axes({ xRange: [-5, 5], yRange: [-2, 2] } as AxesConfig);

        expect(a.xRange).toEqual([-5, 5]);
        expect(a.yRange).toEqual([-2, 2]);
    });

    // test('should compute ranges from length', () => {
    //     const a = new Axes({ xLength: 8, yLength: 4 } as AxesConfig);

    //     expect(a.xRange).toEqual([-4, 4]);
    //     expect(a.yRange).toEqual([-2, 2]);
    // });

    test('should determine origin', () => {
        expect(new Axes().relativeOrigin()).toEqual([0, 0]);
        expect(new Axes({ xRange: [-5, 5], yRange: [-2, 2] } as AxesConfig).relativeOrigin()).toEqual([0, 0]);
        expect(new Axes({ xRange: [0, 5], yRange: [-2, 2] } as AxesConfig).relativeOrigin()).toEqual([-7, 0]);
    });

    test('should create correct number of ticks', () => {
        const a = new Axes({ xRange: [-5, 5], yRange: [-2, 2] } as AxesConfig);
        const numTicks = 5 + 5 + 2 + 2;
        expect(a.composedShapes().length).toEqual(numTicks + 2); // +2 for the axes lines
    });

    test('should create X-ticks at correct locations', () => {
        const a = new Axes({ xRange: [-2, 2], yRange: [-2, 2] } as AxesConfig);
        const cs = a.composedShapes();

        expect(findTick({ cs, x: -7 }).center()).toEqual([-7, 0])
        expect(findTick({ cs, x: -3.5 }).center()).toEqual([-3.5, 0])
        expect(findTick({ cs, x: 3.5 }).center()).toEqual([3.5, 0])
        expect(findTick({ cs, x: 7 }).center()).toEqual([7, 0])
    });

    test('should create Y-ticks at correct locations', () => {
        const a = new Axes({ xRange: [-2, 2], yRange: [-2, 2] } as AxesConfig);
        const cs = a.composedShapes();

        // First 4 ticks are X-ticks
        expect(findTick({ cs, y: -4 }).center()).toEqual([0, -4])
        expect(findTick({ cs, y: -2 }).center()).toEqual([0, -2])
        expect(findTick({ cs, y: 2 }).center()).toEqual([0, 2])
        expect(findTick({ cs, y: 4 }).center()).toEqual([0, 4])
    });

    test('should create X-labels', () => {
        const a = new Axes({ xRange: [-2, 2], yRange: [-2, 2], showXAxisLabels: true, textMetrics: new TestTextMetrics(100, 10) } as AxesConfig);
        const cs = a.composedShapes();

        const labelBottom = -0.3869565217391305;

        expect(findLabel({ cs, x: -7 }).center()).toEqual([-7, labelBottom])
        expect(findLabel({ cs, x: -7 }).text).toEqual('-2');
        expect(findLabel({ cs, x: -3.5 }).center()).toEqual([-3.5, labelBottom])
        expect(findLabel({ cs, x: -3.5 }).text).toEqual('-1');
        expect(findLabel({ cs, x: 3.5 }).center()).toEqual([3.5, labelBottom])
        expect(findLabel({ cs, x: 3.5 }).text).toEqual('1');
        expect(findLabel({ cs, x: 7 }).center()).toEqual([7, labelBottom])
        expect(findLabel({ cs, x: 7 }).text).toEqual('2');
    });

    test('should create Y-labels', () => {
        const a = new Axes({ xRange: [-2, 2], yRange: [-2, 2], showYAxisLabels: true, textMetrics: new TestTextMetrics(100, 10) } as AxesConfig);
        const cs = a.composedShapes();

        const labelLeft = -1.303658536585366;

        expect(findLabel({ cs, y: -4 }).center()).toEqual([labelLeft, -4])
        expect(findLabel({ cs, y: -4 }).text).toEqual('-2');
        expect(findLabel({ cs, y: -2 }).center()).toEqual([labelLeft, -2])
        expect(findLabel({ cs, y: -2 }).text).toEqual('-1');
        expect(findLabel({ cs, y: 2 }).center()).toEqual([labelLeft, 2])
        expect(findLabel({ cs, y: 2 }).text).toEqual('1');
        expect(findLabel({ cs, y: 4 }).center()).toEqual([labelLeft, 4])
        expect(findLabel({ cs, y: 4 }).text).toEqual('2');
    });

    test('should draw x and y-axes', () => {
        const a = new Axes({ xRange: [0, 8], yRange: [0, 8], xLength: 8, yLength: 8, showAxisLabels: false, showAxisTicks: false } as AxesConfig);
        const cs = a.composedShapes();

        expect((cs[0] as PointShape).computedPoints()).toEqual([[-4, -4], [4, -4]]);
        expect((cs[1] as PointShape).computedPoints()).toEqual([[-4, -4], [-4, 4]]);
    });

    test('should create origin in bottom left of available space', () => {
        const a = new Axes({ xRange: [0, 8], yRange: [0, 8], xLength: 8, yLength: 8 } as AxesConfig);
        const cs = a.composedShapes();

        // expect(findTick({ cs,  }))
        expect(a.relativeOrigin()).toEqual([-4, -4]);
    });
});
