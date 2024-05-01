// import { Scene } from '../src/scene';
// // import { Line } from '../src/shapes/primitives/line';
// import { BaseAnimation, Create } from '../src/animation';
// import { FadeIn } from '../src/animation/fade_in';
// // import { Arc } from '../src/shapes/primitives/arc';
// import { Arrow } from '../src/shapes/composed/arrow';
// import { Triangle } from '../src/shapes/derived/triangle';
// import { Tex } from '../src/shapes/derived/tex';
// import { NumberLine } from '../src/shapes/composed/number_line';
// import { Text } from '../src/shapes/primitives/text';
// import { LEFT, DOWN, UP, RIGHT, UL, UR, DL, DR, ORIGIN } from '../src/base';
// import { Axes } from '../src/shapes/composed/axes';
// import { Colors } from '../src/colors';
// import { GridLines } from '../src/shapes/composed/grid_lines';
// // import { Brace } from '../src/shapes/composed/brace';
// // import { Circle, Dot, PointShape } from '../src/shapes';
// import { TangentLine } from '../src/shapes/derived/tangent_line';
// // import { Square } from '../src/shapes/derived/square';
// // import { PointShape as PointShape2 } from '../src/shapes/primitives/bezier_point_shape';
// import { PointShape, Dot, Circle } from '../src/shapes'
// import { GrowFromCenter } from '../src/animation/grow_from_center';
// import math from '../src/math';
import { Scene, BaseAnimation, GridLines, Square, Text, RIGHT, LEFT, UP, DOWN, UR, DR, DL, UL, Tex, Axes, Triangle, NumberLine, Colors, Dot, Line, Arrow, Circle, Group, TangentLine, PointShape, Point } from '../src';
import math from '../src/math';


// const cvs = document.getElementById('cvs') as HTMLCanvasElement;

class TestAnimation extends BaseAnimation {
    update(pctComplete: number, starting: boolean): void {
        console.log(pctComplete);
    }
}


// Call this Mavis (MAth VIS or MAth VIsualization System)?


class TestScene extends Scene {
    compose() {
        this.add(new GridLines());

        // const c2 = this.add(new Circle({ radius: 4, lineColor: Colors.blue() }));
        // const pt452 = c2.pointAtAngle(Math.PI / 4);

        // const triangle = this.add(new PointShape({ points: [ORIGIN, pt452, [pt452[0], 0]], lineWidth: 2 }));
        // this.add(triangle.texOnEdge('1', 0, UP()));

        // this.add(triangle.texOnEdge('\\sin \\theta', 1, LEFT()));
        // this.add(triangle.texOnEdge('\\cos \\theta', 2, UP()));

        // const b = this.add(new Brace({ from: [0, 0], to: [3, 0], direction: DOWN() }));
        // const b2 = this.add(new Brace({ from: [0, 0], to: [-3, 0], direction: DOWN() }));

        /**** TODO:
         * 
         *  Need to rework how a brace is formed. What Manim currently does is the following:
         *      - if direction is not provided, it infers the direction from the points
         *      - if the direction is provided, the direction is used, but it doesn't follow the direction of the points. For example, for
         *        the points [0, 0] to [3, 2] and the direction is DOWN(), the brace doesn't follow the direction of the points. It is completely 
         *        horizontal spanning the X-distance between the points
        */

        // const sq = this.add(new Square());
        // this.add(new Brace(sq, DOWN()));
        // const sq = this.add(new Square2());


        // const sq = new Circle();
        // const sq = new Arc2({ center: [0, 0], radius: 1, startAngle: 0, endAngle: Math.PI / 2, lineColor: Colors.blue() });
        // this.add(new Create({ target: sq, duration: 1000 }));
        // this.add(sq)
        // this.add(new Arc2({ center: [0, 0], radius: 1, startAngle: 0, endAngle: Math.PI / 2, lineColor: Colors.blue() }));
        // this.add(new Square2({ center: [-4, 0], size: 2, lineColor: Colors.red() }));

        // const b = this.add(new Brace({ from: [0, 0], to: [3, 0], direction: DOWN() }));

        // const b1 = this.add(new Brace({ from: [0, 0], to: [3, 2] }));
        // const b2 = this.add(new Brace({ from: [3, 2], to: [0, 0] }));
        // const b3 = this.add(new Brace({ from: [0, 0], to: [-3, 2] }));
        // const b4 = this.add(new Brace({ from: [0, 0], to: [-3, 2], direction: DOWN() }));

        // const b4 = this.add(new Brace({ from: [-1, 1], to: [-4, 3], direction: RIGHT() }));
        // const b4 = this.add(new Brace({ from: [-1, 1], to: [-4, 3] }));
        // const b4 = this.add(new Brace({ from: [-4, 3], to: [-1, 1] }));
        // const b4 = this.add(new Brace({ from: [-4, 1], to: [-1, 3] }));
        // const b4 = this.add(new Brace({ from: [1, 1], to: [4, 3], direction: DOWN() }));

        // const b5 = this.add(new Brace2({ from: [0, 0], to: [-3, 0] }));
        // const b5 = this.add(new Brace2([0, 0], [-3, 0]));

        // b.shift([1, 0]);
        // b.moveTo([1, 1])

        // const a = new Axes({ xLength: 10, yLength: 8 });
        // this.add(a);

        // const p = a.plot(x => 0.1 * x ** 2);
        // this.add(p);

        // const t = new TangentLine({ plot: p, x: 2, color: Colors.pink() });
        // this.add(t);
        // const s1 = this.add(new Square());
        // const s2 = this.add(new Square().nextTo(s1, RIGHT()));
        // this.add(new Text('test').nextTo(s2, RIGHT()));
        // const b = this.add(new Brace(s1, UP()));

        // const s = new Arc2({ center: [0, 0], radius: 1, startAngle: 0, endAngle: Math.PI / 2, lineColor: Colors.blue() });
        // this.add(s.scale(0.0).scale(100000));
        // const s = new Square();
        // this.add(new GrowFromCenter(s))

        // const shape = new PointShape2({ points: [[1, 1], [1, -1], [-1, -1], [-1, 1], [1, 1]] });
        // this.add(new Create({ target: shape, duration: 1000 }));
        // this.add(shape);


        // const c = this.add(new Circle(4).changeLineColor(Colors.blue()));
        // const pt45 = c.pointAtAngle(Math.PI / 4);

        // const [dotOrigin, dot45] = this.add(new Dot(c.center()), new Dot(pt45));

        // const tri = this.add(new PointShape({ points: [ORIGIN, pt45, [pt45[0], 0]], lineWidth: 2, }));
        // this.add(
        //     tri.texOnEdge('1', 0, UL()),
        //     tri.texOnEdge('\\sin \\theta', 1, LEFT()),
        //     tri.texOnEdge('\\cos \\theta', 2, DOWN()),
        // );

        // this.add(
        //     new Tex('O').nextTo(dotOrigin, DOWN()),
        //     new Tex('P').nextTo(dot45, RIGHT()),
        // );

        // const a = new Axes();
        // // const f = x => (2 * x * x - x - 1) / (x - 1)
        // const p = a.plot(x => 1 / x);
        // // const p = a.plot(f);
        // // const p = a.plot(x => 0.1 * x * x);

        // this.add(a, p);
        // const a = new Axes({
        //     xRange: [-20, 20],
        //     yRange: [-10, 10],
        //     xStep: 2,
        //     yStep: 2,
        //     labelSize: 16,
        //     showGrid: true,
        // });

        // this.add(a);

        // const s = this.add(new Square().moveTo([3, 2]));
        // this.add(new Text({ text: 'hello' }).nextTo(s, UP()));
        // this.add(new Text({ text: 'hello' }).nextTo(s, RIGHT()));
        // this.add(new Text({ text: 'hello' }).nextTo(s, DOWN()));
        // this.add(new Text({ text: 'hello' }).nextTo(s, LEFT()));
        // this.add(new Text({ text: 'hello' }).nextTo(s, UR()));
        // this.add(new Text({ text: 'hello' }).nextTo(s, DR()));
        // this.add(new Text({ text: 'hello' }).nextTo(s, DL()));
        // this.add(new Text({ text: 'hello' }).nextTo(s, UL()));

        // const s2 = this.add(new Square().moveTo([-3, 2]));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, UP()));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, RIGHT()));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, DOWN()));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, LEFT()));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, UR()));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, DR()));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, DL()));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, UL()));

        // const s3 = this.add(new Square().moveTo([3, -2]));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, UP()));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, RIGHT()));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, DOWN()));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, LEFT()));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, UR()));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, DR()));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, DL()));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, UL()));

        // const s = new Square({ size: 1 });

        // const locs = [[-3, 3], [3, 3], [3, -3], [-3, -3]];

        // for (const loc of locs) {
        //     const sc = s.copy().moveTo(loc)
        //     this.add(sc);


        // }
        // const dirs = [UP(), RIGHT(), DOWN(), LEFT(), UR(), DR(), DL(), UL()];
        // // const dirs = [UP()];

        // const s1 = this.add(new Square({ size: 2, center: [-3, 2], selectable: true }));
        // for (const dir of dirs) {
        //     this.add(new Text({ text: 'hello', align: 'left' }).nextTo(s1, dir));
        // }

        // const s2 = this.add(new Square({ size: 2, center: [3, 2] }));
        // for (const dir of dirs) {
        //     this.add(new Text({ text: 'hello', align: 'right' }).nextTo(s2, dir));
        // }

        // const axes = this.add(new Axes({
        //     xLength: 10,
        //     yLength: 6,
        //     xRange: [0, 1],
        //     xStep: 0.25,
        //     yRange: [0, 50],
        //     yStep: 5,
        //     xLabel: 'test',
        //     yLabel: 'test',
        //     tips: true,
        // }));

        // const p = this.add(axes.plot(x => 50 * x).changeLineColor(Colors.red()));
        // const area = this.add(axes.area(p, [0, 0.5]).changeColor(Colors.red({ opacity: 0.3 })).changeLineColor(Colors.transparent()));
        // console.log('-------')

        // for (let i = 0.25; i <= 1; i += 0.25) {
        //     const d = new Dot(axes.point(i, p.valueAtX(i))).changeColor(Colors.red()).changeLineColor(Colors.transparent());
        //     this.add(d);
        // }

        // this.add(new Line({ from: axes.point(0.5, 0), to: axes.point(0.5, p.valueAtX(0.5)), lineColor: Colors.blue() }))
        // console.log(axes.point(0.5, 25));

        // const axes = this.add(new Axes({
        //     xRange: [-8, 8],
        //     yRange: [-4, 10],
        //     xLength: 12,
        //     yLength: 6,
        //     xStep: 2,
        //     yStep: 2,
        // }));

        // const p1 = this.add(axes.plot(x => x * x - 2 * x + 3).changeLineColor(Colors.green()));
        // const p2 = this.add(axes.plot(x => 2 * x - 2).changeLineColor(Colors.blue()));

        // // const a1 = this.add(new Arrow())
        // const pt1e = axes.point(-1, p1.valueAtX(-1));
        // const pt1s = math.subVec(pt1e, [1, 0]);
        // const a1 = this.add(new Arrow({ from: pt1s, to: pt1e }));
        // // this.add(new Tex(String.raw`f(x) = x^2 - 2x + 3`).nextTo(a1, LEFT()));
        // this.add(new Text({ text: String.raw`f(x) = x^2 - 2x + 3`, tex: true }).nextTo(a1, LEFT()));

        // this.add(new Tex('\\lim f(x)'));
        // this.add(new Tex('\\text{foo bar biz baz qux quoo keep going}').moveTo([-3, 0]));
        // this.add(new Tex('\\text{foo}').moveTo([-3, 1]));
        // const size = 30;

        // this.add(new Text({ text: 'hello world, how are you?', size }).moveTo([-3, 3]))
        // // this.add(new Tex('\\text{hello world, how are you?}').moveTo([3, 3]))
        // this.add(new Tex({ text: '\\text{hello world, how are you?}', size }).moveTo([1, 3]))

        // this.add(new Text({ text: 'f(x) = x^2 - 2x + 3', size }).moveTo([-3, 1]))
        // this.add(new Tex({ text: 'f(x) = x^2 - 2x + 3', size }).moveTo([3, 1]))

        // const words = ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog'];

        // for (let i = 0; i < words.length; i++) {
        //     const w = words.slice(0, i + 1).join(' ');

        //     const t = new Text({ text: w, size, align: 'left', x: -7, y: 4 - i });
        //     this.add(t)

        //     const t2 = new Text({ text: '\\text{' + w + '}', size, align: 'left', x: 0, y: 4 - i, tex: true });
        //     this.add(t2)
        // }

        // this.add(new Text({ text: 'f(x) = x^2 - 2x + 3', size }).moveTo([-3, 3]))
        // this.add(new Text({ text: 'f(x) = x^2 - 2x + 3', size, tex: true }).moveTo([3, 3]))


        // const axes = this.add(new Axes({
        //     xRange: [0, 2],
        //     yRange: [0, 2],
        //     xLength: 6,
        //     yLength: 6,
        //     xStep: 0.5,
        //     // showTicks: false,
        //     // showLabels: false,
        // }));

        // const fn = x => 3 * Math.pow(x - 1, 3) + 2 * Math.pow(x - 1, 2) + 0.5;
        // const p = this.add(axes.plot(x => fn(x)));
        // const pt = axes.point(1.25, fn(1.25));
        // const area = this.add(axes.area( p, [0.25, 0.75]).changeColor(Colors.red({ opacity: 0.3 })).changeLineColor(Colors.transparent()));
        // const tangentLine = this.add(new TangentLine({ plot: p, x: 1.25, lineColor: Colors.blue(), length: 2.5 }));
        // this.add(new Text({ text: 'Area' }).moveTo(area.center()));
        // this.add(new Text({ text: 'Tangent line', align: 'left' }).nextTo(pt, RIGHT(), 0.3));

        // this.add(
        //     new Dot(pt),
        //     new Text('P').nextTo(pt, LEFT(), 0.3),
        //     new Text('a').nextTo(area, DL()),
        //     new Text('b').nextTo(area, DR())
        // );

        // const c = this.add(new Circle([2, 0]));
        // this.add(new Dot(c.center()));
        // const points = [[1, 1], [1, -1], [-1, -1], [-1, 1], [0, 2], [1, 1]] as Point[];
        // const shape = new PointShape({ points });

        // this.add(shape);
        // this.add(new Dot(shape.center()));
        // console.log(shape.center());

        // const axes = new Axes({
        //     xLength: 8,
        //     yLength: 6,
        //     xRange: [0, 1],
        //     xStep: 0.25,
        //     yRange: [0, 35],
        //     yStep: 5,
        //     xLabel: 'time (h)',
        //     yLabel: 'distance (miles)'
        // });

        // const p = axes.plot(x => 25 * x * x).changeLineColor(Colors.green());

        // this.add(axes, p);

        // const p1 = axes.point(0.25, 1.5625);
        // const p2 = axes.point(0.5, 6.25);
        // const p3 = axes.point(0.75, 14.0625);
        // const p4 = axes.point(1, 25);

        // this.add(
        //     new TangentLine({ plot: p, x: 0.5, length: 4, color: Colors.pink() }),
        //     new Dot({ center: p1, color: Colors.green() }),
        //     new Dot({ center: p2, color: Colors.green() }),
        //     new Dot({ center: p3, color: Colors.green() }),
        //     new Dot({ center: p4, color: Colors.green() }),
        // );

        const axes = new Axes({
            xLength: 8,
            yLength: 6,
            xRange: [0, 1],
            xStep: 0.25,
            yRange: [0, 35],
            yStep: 5,
            xLabel: 'time (h)',
            yLabel: 'distance (miles)'
        });
        
        const p = axes.plot(x => 25 * x * x).changeLineColor(Colors.green());
        
        const p1 = axes.point(0.25, 1.5625);
        const p2 = axes.point(0.5, 6.25);
        const p3 = axes.point(0.75, 14.0625);
        const p4 = axes.point(1, 25);
        
        const pText = new Text({ text: 'P' }).nextTo(p2, UP(), 0.3);
        const qText = new Text({ text: 'Q' }).nextTo(p3, UP(), 0.3);
        
        this.add(
            axes, p,
            new TangentLine({ plot: p, x: 0.5, length: 4, color: Colors.pink() }),
            new Line({ from: p2, to: p3, length: 5, lineColor: Colors.blue() }),
        
            new Dot({ center: p1, color: Colors.green() }),
            new Dot({ center: p2, color: Colors.pink() }),
            new Dot({ center: p3, color: Colors.green() }),
            new Dot({ center: p4, color: Colors.green() }),
        
            new Dot({ center: p3, color: Colors.blue() }),
            pText, qText
        );
    }
}

// new TestScene({ canvas: cvs }).render();
new TestScene().render();
