import { Circle, Scene, Line, Text, LEFT, UP, RIGHT, DOWN, ORIGIN, Square, Triangle, Colors, CircleArc, Group, HtmlCanvas, PointShape, Dot, MoveToTarget, Axes, Arrow } from '../dist/out/index.js';


export class VisualTests extends TestSuite {
    // testRenderManimLogo(canvas, done) {
    //     class TestScene extends Scene {
    //         compose() {
    //             const text = new Text({ text: String.raw`\mathbb{M}`, color: '#343434', size: 200, tex: true }).shift(LEFT(2.25), UP(1.5));
    //             const circle = new CircleArc({ color: '#87c2a5', lineColor: '#87c2a5' }).shift(LEFT(1))
    //             const square = new Square({ color: '#525893', lineColor: '#525893' }).shift(UP(1));
    //             const triangle = new Triangle({ color: '#e07a5f', lineColor: '#e07a5f' }).shift(RIGHT(1));

    //             const logo = new Group(triangle, square, circle, text);
    //             logo.moveTo([0, 0]);

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

    testMoveToTargetAnimation(canvas, done) {
        class TestScene extends Scene {
            compose() {
                const d1 = new Dot({ x: -3, y: 0 });
                const d2 = new Dot({ x: 3, y: 0, color: Colors.red() });

                this.add(d1, d2);
                this.add(new MoveToTarget({ target: d1, destination: d2, duration: 2000 }));

                return this;
            }
        }

        new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    }

    testAxesAndArrow(canvas) {
        // https://docs.manim.community/en/stable/examples.html#vectorarrow
        class TestScene extends Scene {
            compose() {
                const dot = new Dot({ x: 0, y: 0 });
                const dot2 = new Dot({ x: 2, y: 2, color: Colors.red() });
                const arrow = new Arrow({ from: ORIGIN, to: [2, 2] });
                const axes = new Axes({ showGridLines: true });
                // const oText = new Text({ text: '(0, 0)', size: 28, baseline: 'bottom' }).nextTo(dot, DOWN());
                // const tText = new Text({ text: '(2, 2)', size: 28, baseline: 'middle' }).nextTo(arrow.to, RIGHT());
                // this.add(axes, dot, dot2, arrow, oText, tText);
                this.add(axes, dot, dot2, arrow);

                return this;
            }
        }

        new TestScene({ canvas: new HtmlCanvas(canvas) }).compose().render();
    }
}
