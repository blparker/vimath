// import { Circle, Scene, Line, Text, LEFT, UP, RIGHT, DOWN, ORIGIN, Square, Triangle, Colors, CircleArc, Group, HtmlCanvas, PointShape, Dot, MoveToTarget, Axes, Arrow } from '../dist/out/index.js';
import * as exports from '../dist/out/index.js';
Object.entries(exports).forEach(([name, exported]) => window[name] = exported);


export class VisualTests extends TestSuite {
    // testRenderManimLogo(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             this.add(new Line({ from: [-7, 0], to: [7, 0], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));
    //             this.add(new Line({ from: [0, 4], to: [0, -4], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));

    //             const text = new Text({ text: String.raw`\mathbb{M}`, color: '#343434', size: 200, tex: true }).shift(LEFT(2.25), UP(1.5));
    //             // const text = new Square({ size: 2, }).shift(LEFT(2.25), UP(1.5));
    //             const circle = new CircleArc({ color: '#87c2a5', lineColor: '#87c2a5' }).shift(LEFT(1))
    //             const square = new Square({ color: '#525893', lineColor: '#525893' }).shift(UP(1));
    //             const triangle = new Triangle({ color: '#e07a5f', lineColor: '#e07a5f' }).shift(RIGHT(1));

    //             const logo = new Group(triangle, square, circle, text);
    //             // const logo = new Group(text);
    //             logo.moveTo(ORIGIN);

    //             this.add(logo);

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }

    // testPointShape(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             const shape = new PointShape({ points: [[0, 1], [1, -1], [-1, -1]], lineColor: Colors.orange(), color: Colors.blue(), lineWidth: 3 }).moveTo([-5, 2]);
    //             this.add(shape);

    //             const shape2 = new PointShape({ points: [[-1, 1], [1, 1], [1, -1], [-1, -1]], lineColor: Colors.green() }).scale(0.5).rotate(Math.PI / 4).moveTo([-3, 2]);
    //             this.add(shape2);

    //             const shape3 = new PointShape({ points: [[-1, 1], [1, 1], [1, -1], [-1, -1]], lineColor: Colors.red(), lineWidth: 8 }).shift(DOWN(1));
    //             this.add(shape3);

    //             this.add(new Text({ text: 'Bottom' }).nextTo(shape3, DOWN(1)));
    //             this.add(new Text({ text: 'Left', align: 'right' }).nextTo(shape3, LEFT(1)));
    //             this.add(new Text({ text: 'Right' }).nextTo(shape3, RIGHT(1)));
    //             this.add(new Text({ text: 'Top' }).nextTo(shape3, UP(1)));

    //             const shape4 = new PointShape({ points: [[-1, 1], [1, 1], [1, -1], [-1, -1]], strokeColor: Colors.red, lineWidth: 4 }).shift(RIGHT(4), UP(2));
    //             this.add(shape4, new PointShape({ points: [[-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]], fill: Colors.orange, lineWidth: 2 }).nextTo(shape4, LEFT()));

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }

    // testText(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             this.add(new Line({ from: [-7, 0], to: [7, 0], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));
    //             this.add(new Line({ from: [0, 4], to: [0, -4], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));

    //             this.add(new Text({ text: 'Hello world', align: 'center' }).shift(UP()));
    //             this.add(new Text({ text: 'Hello world', align: 'left' }));
    //             this.add(new Text({ text: 'Hello world', align: 'right' }).shift(DOWN()));

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }

    // testMoveToTargetAnimation(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             const d1 = new Dot({ x: -3, y: 0 });
    //             const d2 = new Dot({ x: 3, y: 0, color: Colors.red() });

    //             this.add(d1, d2);
    //             this.add(new MoveToTarget({ target: d1, destination: d2, duration: 2000 }));

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }

    // testAxesAndArrow(canvas) {
    //     // https://docs.manim.community/en/stable/examples.html#vectorarrow
    //     class TestScene extends Scene {
    //         compose() {
    //             const dot = new Dot({ x: 0, y: 0 });
    //             const dot2 = new Dot({ x: 2, y: 2, color: Colors.red() });
    //             const arrow = new Arrow({ from: ORIGIN, to: [2, 2] });
    //             const axes = new Axes({ showGridLines: true });
    //             const oText = new Text({ text: '(0, 0)', size: 28, baseline: 'bottom' }).nextTo(dot, DOWN());
    //             const tText = new Text({ text: '(2, 2)', size: 28, baseline: 'middle' }).nextTo(arrow.to, RIGHT());
    //             this.add(axes, dot, dot2, arrow, oText, tText);
    //             // this.add(axes, dot, dot2, arrow);

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }

    // testGroupNextTo(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             this.add(new Line({ from: [-7, 0], to: [7, 0], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));
    //             this.add(new Line({ from: [0, 4], to: [0, -4], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));
    //             this.add(new Line({ from: [1, 4], to: [1, -4], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));

    //             const testGroup = new Group(
    //                 new Square({ x: -0.5, y: 0.5, size: 1 }),
    //                 new Square({ x: 0.5, y: 0.5, size: 1 }),
    //                 new Square({ x: -0.5, y: -0.5, size: 1 }),
    //                 new Square({ x: 0.5, y: -0.5, size: 1 }),
    //             );
    //             const centeredSquare = new Square({ x: 0, y: 0, size: 1 });
    //             testGroup.nextTo(centeredSquare, RIGHT());

    //             this.add(centeredSquare, testGroup);

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }

    // testTextNextTo(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             this.add(new Line({ from: [-7, 0], to: [7, 0], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));
    //             this.add(new Line({ from: [0, 4], to: [0, -4], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));
    //             this.add(new Line({ from: [-7, 2], to: [7, 2], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));
    //             this.add(new Line({ from: [-4, 4], to: [-4, -4], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));

    //             const s1 = new Square({ x: -4, y: 2, size: 2 });
    //             const t1 = new Text({ text: 'LM', align: 'left' }).nextTo(s1, LEFT());
    //             const t2 = new Text({ text: 'RM', align: 'right' }).nextTo(s1, RIGHT());
    //             const t3 = new Text({ text: 'LM', align: 'left' }).nextTo(s1, UP());
    //             const t4 = new Text({ text: 'RM', align: 'right' }).nextTo(s1, DOWN());
    //             this.add(s1, t1, t2, t3, t4);

    //             const s2 = new Square({ x: 0, y: 2, size: 2 });
    //             const t5 = new Text({ text: 'LT', align: 'left', baseline: 'top' }).nextTo(s2, LEFT());
    //             const t6 = new Text({ text: 'RT', align: 'right', baseline: 'top' }).nextTo(s2, RIGHT());
    //             const t7 = new Text({ text: 'LT', align: 'left', baseline: 'top' }).nextTo(s2, UP());
    //             const t8 = new Text({ text: 'CT', align: 'center', baseline: 'top' }).nextTo(s2, DOWN());
    //             this.add(s2, t5, t6, t7, t8);

    //             const s3 = new Square({ x: -2, y: -2, size: 2 });
    //             const t9 = new Text({ text: 'Longer text', align: 'center', }).nextTo(s3, LEFT());
    //             const t10 = new Text({ text: 'Bottom', align: 'center', baseline: 'bottom' }).nextTo(s3, DOWN());
    //             this.add(s3, t9, t10);

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }

    // testNextToAtCenter(canvas) {
    //     // https://docs.manim.community/en/stable/examples.html#vectorarrow
    //     class TestScene extends Scene {
    //         compose() {
    //             const dot = new Dot({ x: 0, y: 0 });
    //             const t = new Text({ text: '(0, 0)', size: 28, baseline: 'bottom' }).nextTo(dot, DOWN());
    //             this.add(dot, t);

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }

    // testPointMovingOnShape(canvas, done) {
    //     // https://docs.manim.community/en/stable/examples.html#pointmovingonshapes
    //     class PointMovingOnShapes extends Scene {
    //         compose() {
    //             this.add(new Line({ from: [-7, 0], to: [7, 0], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));
    //             this.add(new Line({ from: [0, 4], to: [0, -4], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));
    //             this.add(new Line({ from: [2, 4], to: [2, -4], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));

    //             const circle = new CircleArc({ radius: 1, lineColor: Colors.blue() });
    //             const dot = new Dot();
    //             const dot2 = dot.copy().shift(RIGHT());
    //             this.add(dot);

    //             const line = new Line({ from: [3, 0], to: [5, 0] });
    //             this.add(line);

    //             this.add(circle, new Grow({ shape: circle, duration: 500 }));
    //             this.add(new MoveToTarget({ target: dot, destination: dot2 }));
    //             this.add(new MoveAlongPath({ target: dot, path: circle, easing: Easing.linear }));
    //             this.add(new Orbit({ target: dot, center: [2, 0], easing: Easing.linear }));

    //             return this;
    //         }
    //     }

    //     new PointMovingOnShapes({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }

    // testMovingAndMorphing(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             // this.add(new Line({ from: [-7, 0], to: [7, 0], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));
    //             // this.add(new Line({ from: [0, 4], to: [0, -4], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));
    //             // this.add(new Line({ from: [2, 4], to: [2, -4], lineColor: Colors.gray({ opacity: 0.3 }), lineWidth: 2 }));

    //             const square = new Square({ color: Colors.blue(), lineColor: Colors.transparent() });
    //             this.add(square);

    //             this.add(new ShiftTarget({ target: square, shifts: LEFT() }));
    //             this.add(new ChangeFillColor({ target: square, toColor: Colors.orange(), duration: 500 }));
    //             this.add(new Scale({ target: square, scaleAmount: 0.5, duration: 500 }));
    //             this.add(new Rotate({ target: square, angle: Math.PI / 4 }));

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }

    // testAxesNotFullWidth(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             this.add(new GridLines());
    //             // const axes = new Axes({ showGridLines: true, xLength: 8, yLength: 4 });
    //             // const axes = new Axes2({ xLength: 8, yLength: 4, xRange: [-2, 6] });
    //             // this.add(axes);

    //             // this.add(new Axes3({ xLength: 8, yLength: 4, xRange: [-20, 60], yRange: [-2, 2], showAxisTicks: true, showAxisLabels: true, xAxisTickStep: 10 }));
    //             // this.add(new Axes3({ xLength: 8, yLength: 4, xRange: [-2, 6], yRange: [-1, 3], showAxisLabels: false, showAxisTicks: false }));
    //             // this.add(new Axes3({ xLength: 8, yLength: 6, xRange: [-4, 4], yRange: [-1, 5], showAxisTicks: true, showAxisLabels: true, xAxisTickStep: 1 }));

    //             // const axes2 = new Axes2({ /*xLength: 8, yLength: 4,*/ xRange: [-20, 60], yRange: [-10, 10], showAxisTicks: true, showAxisLabels: true, labelSize: 10, xAxisTickStep: 10, yAxisTickStep: 4 });
    //             // this.add(axes2.shift([-1, -1]));
    //             // this.add(axes2);

    //             // this.add(new NumberLine({ length: 8, range: [-20, 60], tickStep: 10, showLabels: true, showAxisTicks: true }).shift(DOWN()));
    //             // this.add(new NumberLine({ length: 6, showTicks: false, showLabels: false, rotation: Math.PI / 2 }));

    //             const a = new Axes({ xLength: 10, yLength: 6, xRange: [-1, 9] });
    //             this.add(a);

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }


    // testAxesPlot(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             this.add(new GridLines());
    //             const a = new Axes({ xLength: 10, yLength: 6, xRange: [-1, 9] });
    //             this.add(a);
    //             this.add(a.plot(x => Math.log(x), { lineColor: Colors.red() }));

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }

    // testUpperAndLowerBounds(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             this.add(new GridLines());
    //             const a = new Axes({});
    //             this.add(a);
    //             this.add(a.plot(x => Math.pow(x, 2), { lineColor: Colors.red() }));
    //             this.add(a.plot(x => -Math.pow(x, 2), { lineColor: Colors.green() }));

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }


    // testAxesPlotWithArea(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             this.add(new GridLines());
    //             const a = new Axes({ xLength: 10, yLength: 6, xRange: [-1, 9] });
    //             this.add(a);

    //             const plot = a.plot(x => Math.log(x), { lineColor: Colors.red() });
    //             const area = a.area({ plot, xRange: [2, 4] })
    //             this.add(plot, area);

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }


    // testTangentLine(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             this.add(new GridLines());
    //             const a = new Axes({ xLength: 10, yLength: 6 });
    //             this.add(a);

    //             // const plot = a.plot(x => Math.log(x), { lineColor: Colors.red() });
    //             // const area = a.area({ plot, xRange: [2, 4] })
    //             // this.add(plot, area);
    //             const p = a.plot(x => -Math.pow(x / 1.5 - 1, 2) + 2);
    //             this.add(p);

    //             const tangent = new TangentLine({ shape: p, x: 2 });
    //             this.add(tangent);

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }


    // /*testShouldHover(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             const line = new Square({ size: 2 });
    //             const t = new Text({ text: 'Hello', x: 0, y: 0, color: Colors.black({ opacity: 0 }) });

    //             this.add(line, t);
    //             // this.add(new FadeIn({ target: t }))
    //             this.add(new Hoverable({
    //                 target: line,
    //                 actions: [
    //                     new ChangeLineColor({ target: line, toColor: Colors.red(), duration: 500 }),
    //                     new FadeIn({ target: t, duration: 500 }),
    //                 ],
    //             }));

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }*/


    // testShouldRepeatAnimation(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             const s = new Square({ size: 2 });

    //             this.add(s)
    //             this.add(new MoveToTarget({ target: s, destination: [2, 2], repeat: true, yoyo: true }))

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }

    // testAxesWithFullWidth(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             this.add(new GridLines({ lineColor: Colors.blue({ opacity: 0.3 }) }));

    //             const axes1 = new Axes({
    //                 xLength: 5,
    //                 yLength: 5,
    //                 xRange: [0, 1],
    //                 yRange: [0, 50],
    //                 xAxisTickStep: 0.25,
    //                 yAxisTickStep: 12.5,
    //                 xAxisLabel: 'time (h)',
    //                 yAxisLabel: 'mph',
    //             });

    //             const plot1 = axes1.plot(x => 50 * x);

    //             const axes2 = new Axes({
    //                 xLength: 5,
    //                 yLength: 5,
    //                 xRange: [0, 1],
    //                 yRange: [0, 50],
    //                 xAxisTickStep: 0.25,
    //                 yAxisTickStep: 12.5,
    //                 xAxisLabel: 'time (h)',
    //                 yAxisLabel: 'miles',
    //             });

    //             const plot2 = axes1.plot(x => 25 * x * x);

    //             // const axes = new Axes({ 
    //             //     xRange: [-1, 20],
    //             //     xAxisTickStep: 2,
    //             //     yRange: [-1, 20],
    //             //     yAxisTickStep: 2,
    //             //     showGridLines: true,
    //             // })
    //             // const axes = new Axes({ 
    //             //     xLength: 8,
    //             //     yLength: 6,
    //             //     xRange: [-2, 10],
    //             //     xAxisTickStep: 2,
    //             //     yRange: [-2, 10],
    //             //     yAxisTickStep: 2,
    //             //     showGridLines: true,
    //             // })

    //             // const plot = axes.plot(x => x);

    //             // this.add(axes1, plot1);
    //             // const g = new HGroup(new Group(axes2, plot2))
    //             // this.add(g);
    //             const g = new HGroup(
    //                 new Group(axes1, plot1),
    //                 new Group(axes2, plot2),
    //             );
    //             // const g = axes1;

    //             this.add(g);
    //             // this.add(axes1);
    //             // console.log("#### CALLING TOP 1");
    //             // axes1.top();
    //             // console.log('Axes1 top:', axes1.top());
    //             // console.log("#### CALLING TOP 2");
    //             // axes2.top();
    //             // console.log('*#*#*#*')

    //             // console.log('Axes2 top:', axes2.top());

    //             // console.log('Center:', axes1.center());
    //             // // console.log('Left:', axes1.left());
    //             // // console.log('Right:', axes1.right());
    //             // // console.log('Top:', axes1.top());
    //             // // console.log('Bottom:', axes1.bottom());
    //             // // // console.log('Height:', axes1.height());
    //             // // // console.log('Width:', axes1.width());
    //             // const [cX, cY] = g.center();
    //             // const [lX, lY] = axes1.left();
    //             // const [tX, tY] = g.top();
    //             // const [bX, bY] = g.bottom();
    //             // const [rX, rY] = g.right();

    //             // const [c1X, c1Y] = axes1.center();
    //             // const [c2X, c2Y] = axes2.center();

    //             // this.add(new Dot({ x: c1X, y: c1Y, color: Colors.red() }))
    //             // this.add(new Dot({ x: c2X, y: c2Y, color: Colors.blue() }))

    //             // this.add(new Dot({ x: cX, y: cY }))
    //             // this.add(new Dot({ x: lX, y: lY, color: Colors.red() }))
    //             // this.add(new Dot({ x: tX, y: tY, color: Colors.blue() }))
    //             // this.add(new Dot({ x: rX, y: rY, color: Colors.red() }))
    //             // this.add(new Dot({ x: bX, y: bY, color: Colors.blue() }))

    //             // this.add(new Dot({ x: cX, y: cY }))

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }

    // testHGroup(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             this.add(new HGroup(
    //                 new Square({ size: 2 }),
    //                 new Square({ size: 2 }),
    //                 new Square({ size: 2 }),
    //             ));
    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }


    // testAnimationsShouldRepeat(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             const c1 = new CircleArc({ radius: 1, x: -5, y: 2 });
    //             const c2 = new CircleArc({ radius: 1, x: -2, y: 2 });
    //             const c3 = new CircleArc({ radius: 1, x: 1, y: 2 });
    //             const c7 = new Square({ size: 1, x: 4, y: 2 });

    //             const c4 = new CircleArc({ radius: 1, x: -4, y: -2 });
    //             const c5 = new CircleArc({ radius: 0.25, x: -1, y: -2 });
    //             const c5Path = new CircleArc({ radius: 1, x: -1, y: -2 });
    //             const c6 = new CircleArc({ radius: 1, x: 2, y: -2 });

    //             this.add(c1, c2, c3, c4, c5, c6, c7);
    //             this.add(
    //                 new ChangeFillColor({ target: c1, toColor: Colors.red(), repeat: true }),
    //                 new ShiftTarget({ target: c2, shifts: DOWN(), repeat: true }),
    //                 new Scale({ target: c3, scaleAmount: 2, repeat: true }),
    //                 new ChangeLineColor({ target: c4, toColor: Colors.red(), repeat: true }),
    //                 new MoveAlongPath({ target: c5, path: c5Path, repeat: true, }),
    //                 new Grow({ shape: c6, repeat: true, }),
    //                 new Rotate({ target: c7, angle: Math.PI / 2, repeat: true, }),
    //             );

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }

    // testAxes(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             const axes = new Axes({
    //                 xLength: 10,
    //                 yLength: 6,
    //                 xRange: [0, 1],
    //                 xAxisTickStep: 0.25,
    //                 yRange: [0, 50],
    //                 yAxisTickStep: 5,
    //                 xAxisLabel: 'time',
    //                 yAxisLabel: 'distance (miles)'
    //             });

    //             const p = axes.plot(x => 50 * x, { lineColor: Colors.green() });

    //             this.add(axes, p);

    //             const p1 = axes.relativePoint([0.25, 12.5]);
    //             const p2 = axes.relativePoint([0.5, 25]);
    //             const p3 = axes.relativePoint([0.75, 37.5]);
    //             const p4 = axes.relativePoint([1, 50]);

    //             this.add(
    //                 new Dot({ x: p1[0], y: p1[1], color: Colors.green() }),
    //                 new Dot({ x: p2[0], y: p2[1], color: Colors.green() }),
    //                 new Dot({ x: p3[0], y: p3[1], color: Colors.green() }),
    //                 new Dot({ x: p4[0], y: p4[1], color: Colors.green() }),
    //             );

    //             return this;
    //         }
    //     }

    //     new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    // }


    testRelativeArea(canvas, done) {
        class TestScene extends Scene {
            compose() {
                this.add(new GridLines());
                const axes = new Axes({
                    xLength: 10,
                    yLength: 6,
                    xRange: [0, 1],
                    xAxisTickStep: 0.25,
                    yRange: [0, 60],
                    yAxisTickStep: 5,
                    xAxisLabel: 'time (h)',
                    yAxisLabel: 'speed (mph)'
                });
                
                const p = axes.plot(x => 50, { lineColor: Colors.red() });

                this.add(axes, p);

                const p1 = axes.relativePoint([0.25, 50]);
                const p2 = axes.relativePoint([0.5, 50]);
                const p3 = axes.relativePoint([0.75, 50]);
                const p4 = axes.relativePoint([1, 50]);

                this.add(
                    new Dot({ x: p1[0], y: p1[1], color: Colors.red() }),
                    new Dot({ x: p2[0], y: p2[1], color: Colors.red() }),
                    new Dot({ x: p3[0], y: p3[1], color: Colors.red() }),
                    new Dot({ x: p4[0], y: p4[1], color: Colors.red() }),
                    //new Square({ color: Colors.red({ opacity: 0.2 }) })
                    axes.area({ plot: p, xRange: [0.25, 0.5] })
                );

                return this;
            }
        }

        new TestScene({ canvas: new HtmlCanvas(canvas), staticScene: true, }).compose().render();
    }
}
