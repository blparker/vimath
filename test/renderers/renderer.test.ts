// import { createCanvas, Canvas as NodeCanvas } from '../../node_modules/canvas/index';
import { Circle, Colors, DEFAULT_PADDING, Group, Line, Point, PointShape, RGBA, Square, X_TICKS, Y_TICKS } from '../../src/index';
import { Canvas, HtmlCanvas } from '../../src/renderers/renderer';
import { TextRenderer } from '../../src/renderers/text';
import { PointShapeRenderer } from '../../src/renderers/shape';
// import { TextRenderer } from '../../src/renderers/text';
import { Text } from '../../src/shapes/text';
import { TestTextMetrics } from '../utils';
import { getRenderer } from '../../src/renderers/renderer_factory';
// import { JSDOM } from '../../node_modules/jsdom/lib/api.js';
// import { JSDOM } from 'jsdom';
// import { setupJestCanvasMock } from '../../node_modules/jest-canvas-mock/lib/index';


// class TestCanvas implements Canvas {
//     private canvas: NodeCanvas;

//     constructor() {
//         this.canvas = createCanvas(200, 200);
//     }

//     line({ from, to, lineColor, color }: { from: Point; to: Point; lineColor: RGBA; color: RGBA; }): void {
//         throw new Error('Method not implemented.');
//     }
// }

function calcAbsPosition(canvas: HtmlCanvas, relPoint: Point): { x: number, y: number } {
    const left = (X_TICKS / 2) + relPoint[0];
    const top = (Y_TICKS / 2) - relPoint[1];

    return {
        x: Math.floor(DEFAULT_PADDING + left * canvas.xIncrements),
        y: Math.floor(DEFAULT_PADDING + top * canvas.yIncrements),
    };
}


function createTestCanvas(cvsWidth = 400, cvsHeight = 200) {
    const cvs: HTMLCanvasElement = document.createElement('canvas');
    cvs.width = cvsWidth; cvs.height = cvsHeight;

    return new HtmlCanvas(cvs);
}



describe('renderer module', () => {
    test('should render set of points at appropriate absolute location based off of relative points', () => {
        const canvas = createTestCanvas(400, 200);
        const r = new PointShapeRenderer(canvas);
        // Because size is 2, the points are [[-1, 1], [1, 1], [1, -1], [-1, -1]]
        const s = new Square({ x: 0, y: 0, size: 2 });
        r.render(s);

        const drawCalls = canvas.ctx.__getDrawCalls();
        const path = drawCalls[1].props.path;

        /* The first draw call is a moveTo which moves the path to [-1, 1], which needs to be translated into an absolute position. 
           X = -1 is 6 units away from the left, Y = 1 is 3 units away from the top */
        expect(path[0].type).toEqual('moveTo');
        expect(path[0].props).toEqual(calcAbsPosition(canvas, s.computedPoints()[0]));

        // Where the moveTo command was moving the path to points[i], the next draw call is drawing the line to points[i + 1]
        expect(path[1].type).toEqual('lineTo');
        expect(path[1].props).toEqual(calcAbsPosition(canvas, s.computedPoints()[1]));

        // Same concept for the other points
        expect(path[2].type).toEqual('lineTo');
        expect(path[2].props).toEqual(calcAbsPosition(canvas, s.computedPoints()[2]));

        expect(path[3].type).toEqual('lineTo');
        expect(path[3].props).toEqual(calcAbsPosition(canvas, s.computedPoints()[3]));

        expect(path[4].type).toEqual('closePath');
    });

    test('should render a PointShape with two points correctly', () => {
        const canvas = createTestCanvas(400, 200);
        const spy = jest.spyOn(canvas, 'line');

        const line = new Line({ from: [-1, 0], to: [1, 0] });
        const r = new PointShapeRenderer(canvas);
        r.render(line);

        // Line should only be called once, from -> to
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0].from).toEqual([-1, 0]);
        expect(spy.mock.calls[0][0].to).toEqual([1, 0]);
    });

    test('should render text', () => {
        const ctx = new OffscreenCanvas(256, 256).getContext('2d');
        ctx!.font = '20px Iowan Old Style';

        // console.log('### ', ctx?.measureText('foo'))

        const canvas = createTestCanvas(400, 200);
        const spy = jest.spyOn(canvas, 'text');

        const text = new Text({ text: 'Hello world', x: 0, y: 0, size: 20, align: 'center', baseline: 'top', color: Colors.white(), textMetrics: new TestTextMetrics(100, 10) })
        const r = new TextRenderer(canvas).render(text);

        // text should only be called once, from -> to
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0].text).toEqual('Hello world');
        expect(spy.mock.calls[0][0].size).toEqual(20);
        expect(spy.mock.calls[0][0].align).toEqual('center');
        expect(spy.mock.calls[0][0].baseline).toEqual('top');
        expect(spy.mock.calls[0][0].vertical).toEqual(false);
        expect(spy.mock.calls[0][0].color).toEqual(Colors.white());
    });

    test('should render tex', async () => {
        const t = new Text({ text: String.raw`\mathbb{M}`, tex: true });
        const canvas = createTestCanvas(400, 200);
        const r = await new TextRenderer(canvas).render(t);
    });

    test('renderer factory should return renderer for point shape', () => {
        const line = new Line({ from: [-1, 0], to: [1, 0] });
        const renderer = getRenderer(createTestCanvas(400, 200), line);
        expect(renderer).toBeInstanceOf(PointShapeRenderer);
    });

    test('renderer factory should return renderer for text', () => {
        const text = new Text({ text: 'Test' });
        const renderer = getRenderer(createTestCanvas(400, 200), text);
        expect(renderer).toBeInstanceOf(TextRenderer);
    });
});


describe('html canvas module', () => {
    test('it should translate from relative points to absolute', () => {
        const canvas = createTestCanvas(400, 200);
        canvas.line({ from: [-1, 0], to: [1, 0], lineWidth: 2, color: [0, 0, 0, 0], lineStyle: 'solid' })

        const drawCalls = canvas.ctx.__getDrawCalls();
        expect(drawCalls.length).toEqual(1);

        expect(drawCalls[0].props.path[0].props).toEqual(calcAbsPosition(canvas, [-1, 0]));
        expect(drawCalls[0].props.path[1].props).toEqual(calcAbsPosition(canvas, [1, 0]));
    });

    test('it should pass line color', () => {
        const canvas = createTestCanvas(400, 200);
        canvas.line({ from: [-1, 0], to: [1, 0], lineWidth: 2, color: Colors.blue(), lineStyle: 'solid' });

        const drawCalls = canvas.ctx.__getDrawCalls();
        // console.log(canvas.ctx.__getEvents())
        // expect(drawCalls[0].props.path[0].props).toEqual(calcAbsPosition(canvas, [-1, 0]));
    });
});
