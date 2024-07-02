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
import { Scene, createScene, BaseAnimation, GridLines, Square, Text, RIGHT, LEFT, UP, DOWN, UR, DR, DL, UL, Tex, Axes, Triangle, NumberLine, Colors, Dot, Line, Arrow, Circle, Group, TangentLine, PointShape, Point, Updater, Easing, Brace, ORIGIN, Arc } from '../src';
import math from '../src/math';
import utils from '../src/utils';


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

        // const a = this.add(new Axes({
        //     xRange: [-1, 5],
        //     yRange: [-1, 4],
        // }));

        // const f = x => Math.sin(2 * (x + 2)) + 0.5 * (x + 1);
        // const p = this.add(a.plot(x => f(x)).changeLineColor(Colors.red()));

        // const tangent = this.add(new TangentLine({ plot: p, x: 1.5, length: 5 }));
        // const dot = this.add(new Dot(p.pointAtX(1.5)));

        // const fromX = 1.5;
        // const toX = 2.5;

        // this.add((pctComplete: number, starting: boolean) => {
        //     const newX = math.lerp(fromX, toX, pctComplete);
        //     dot.moveTo(p.pointAtX(newX));
        //     tangent.updateX(newX);
        // });

        // const a = this.add(new Axes({
        //     xRange: [-0.5, 1],
        //     yRange: [-0.5, 3],
        //     xStep: 0.25,
        //     yStep: 0.5,
        //     xLength: 10,
        // }));

        // const p1 = this.add(a.plot(x => 2 * x).changeLineColor(Colors.red()));
        // const p2 = this.add(a.plot(x => 3 * x * x).changeLineColor(Colors.blue()));
        // const p3 = this.add(a.plot(x => 2 * x + 3 * x * x).changeLineColor(Colors.green()));

        // this.add((pctComplete: number, starting: boolean) => {
        //     const x = math.lerp(0, 2, pctComplete);

        //     p1.setDomain([-0.5, x]);
        //     p2.setDomain([-0.5, x]);
        // });
        // this.add(new Updater((pctComplete: number, starting: boolean) => {
        //     const x = math.lerp(0, 2, pctComplete);
        //     p1.setDomain([-0.5, x]);
        //     p2.setDomain([-0.5, x]);
        // }, 5000, x => Easing.easeStep(x, 20)));

        // p1.setDomain([-0.5, 0]);
        // p2.setDomain([-0.5, 0.5]);

        // const a = this.add(new Axes());
        // this.add(a.plot(x => 1 / x));

        // function rectangle(w: number, h: number): PointShape {
        //     return new PointShape({
        //         points: [
        //             [-w / 2, h / 2],
        //             [w / 2, h / 2],
        //             [w / 2, -h / 2],
        //             [-w / 2, -h / 2],
        //             [-w / 2, h / 2]
        //         ],
        //     })
        // }

        // const rect = rectangle(3, 3);

        // this.add(rect);
        // const b = this.add(new Brace(rect, LEFT()));
        // this.add(b.tex('x'))

        // const b2 = this.add(new Brace(rect, RIGHT()));
        // this.add(new Text({ text: 'Y', baseline: 'top' }).nextTo(b2, RIGHT()));

        // const t = new Tex('\\text{HELLO}');
        // this.add(t);

        // t.changeFontSize(12);


        // const config = { length: 8, range: [0, 30], tickStep: 2, labelSize: 16, }
        // const n1 = new NumberLine(config);
        // const n2 = new NumberLine(config);
        // const n3 = new NumberLine(config);

        // this.add(new Group(n1, n2, n3).arrange(UP(), 2));

        // this.add(new Tex('x').nextTo(n3, LEFT(), 0.5))
        // this.add(new Tex('2x + 1').nextTo(n2, LEFT(), 0.5))
        // this.add(new Tex('(2x + 1)^2').nextTo(n1, LEFT(), 0.5))

        // const f1 = x => x;
        // const f2 = x => 2 * x + 1;
        // const f3 = x => Math.pow(f2(x), 2);

        // const d3 = this.add(new Dot(n1.pointOnLine(f3(0))));
        // const d2 = this.add(new Dot(n2.pointOnLine(f2(0))));
        // const d1 = this.add(new Dot(n3.pointOnLine(f1(0))));

        // this.add(new Updater((pctComplete: number, starting: boolean) => {
        //     const x = math.lerp(0, 2, pctComplete);

        //     d1.moveTo(n3.pointOnLine(f1(x)));
        //     d2.moveTo(n2.pointOnLine(f2(x)));
        //     d3.moveTo(n1.pointOnLine(f3(x)));
        // }, 5000, x => Easing.easeStep(x, 10)));


        // const n = this.add(new NumberLine({
        //     showLabels: false,
        //     length: 6,
        //     range: [0, 6],
        //     rotation: Math.PI / 2,
        // }));

        // this.add(new Dot(n.pointOnLine(0)));

        // console.log(n.from());

        // const c = this.add(new Circle(4).changeLineColor(Colors.gray()));

        // const center = [-4, -3] as Point;
        // const c = new Circle({ radius: 8, center, lineWidth: 2, lineColor: Colors.gray() });
        // this.add(c);
        // const segment = this.add(new Arc({ radius: 8, center, startAngle: 0, endAngle: Math.PI / 4, lineColor: Colors.blue() }));

        // const startPoint = c.pointAtAngle(Math.PI / 4);
        // const zeroPoint = c.pointAtAngle(0);
        // const p = this.add(new Dot(startPoint));

        // function triangle(p: Point): [Point, Point, Point, Point] {
        //     return [center, p, [p[0], center[1]], center];
        // }

        // const dashedLine = this.add(new Line({ from: center, to: zeroPoint, lineWidth: 2, lineColor: Colors.red() }));
        // const t = this.add(new PointShape({
        //     points: triangle(startPoint),
        // }));

        // const sineText = this.add(t.texOnEdge('\\cos \\theta', 2, DOWN(), 0.2));
        // const angleText = this.add(new Tex('\\theta').nextTo(c.pointAtAngle(Math.PI / 8), RIGHT(), 0.2).changeColor(Colors.blue()));

        // console.log(startPoint, zeroPoint);
        // const b = this.add(new Brace([startPoint[0], -3], [4, -3], DOWN()));
        // const bt = this.add(b.tex('1 - \\cos \\theta'))

        // this.add(new Updater((pctComplete: number, starting: boolean) => {
        //     const x = Math.PI / 4 - math.lerp(0, Math.PI / 4, pctComplete);
        //     const newPoint = c.pointAtAngle(x);
        //     p.moveTo(newPoint);
        //     t.changePoints(triangle(p.center()));
        //     segment.changeAngle(x);
        //     sineText.nextTo(t.edgeMidpoint(1), LEFT(), 0.2);
        //     angleText.nextTo(segment.pointAtAngle(x / 2), RIGHT(), 0.2);
        //     b.changeFrom([newPoint[0], -3]);
        //     bt.nextTo(b, DOWN(), 0.2);
        // }, { duration: 5000, easing: Easing.linear, repeat: true, }));


        // this.add(new Updater((pctComplete: number, starting: boolean) => {
        //     const x = Math.PI / 4 - math.lerp(0, Math.PI / 4, pctComplete);
        //     p.moveTo(c.pointAtAngle(x));
        //     t.changePoints(triangle(p.center()));
        //     hypText.nextTo(t.edgeMidpoint(0), UP(), 0.2);
        //     sineText.nextTo(t.edgeMidpoint(1), RIGHT(), 0.2);
        // }, { duration: 5000, easing: x => Easing.easeStep(x, 10), repeat: true, }));

        // this.add(new Arrow({ from: DOWN(), to: ORIGIN }).shift(RIGHT(0.25), UP(0.25)));


        // const n1 = new NumberLine({ length: 4, range: [0, 10], center: [2, 2], showLabels: false, showTicks: false, });
        // this.add(n1);

        // // n1.shift(UP(2));

        // this.add(new Dot(n1.pointOnLine(0)));

        // const n2 = new NumberLine({ length: 4, range: [0, 10], center: [-2, 1], rotation: Math.PI / 2, showLabels: false, showTicks: false, });
        // // const n2 = new NumberLine({ length: 4, range: [0, 10], center: [-2, 1], });
        // this.add(n2);
        // this.add(new Dot(n2.pointOnLine(0)));

        // const a = this.add(new Axes({
        //     xRange: [-1, 5],
        //     yRange: [-1, 4],
        //     xLength: 8,
        //     yLength: 6,
        // }));

        // this.add(a.plot(x => x));

        // const a = this.add(new Axes({
        //     xLength: 8,
        //     yLength: 8,
        //     yRange: [-1, 5],
        // }));

        // this.add(a.plot(x => x * x));

        // const ground = this.add(new Line({ from: [-4, -3], to: [4, -3], lineColor: Colors.blue() }));
        // const wall = this.add(new Line({ from: [4, -3], to: [4, 4], lineColor: Colors.blue() }));

        // // 4^2 + 5^2 = c^2
        // // 16 + 25 = c^2
        // // 41 = c^2
        // // c = sqrt(41)
        // const ladder = this.add(new Line({ from: [0, -3], to: [4, 2] }))
        // const groundBrace = this.add(new Brace({ from: ladder.from(), to: [4, -3], direction: DOWN() }));
        // const xText = this.add(groundBrace.tex('x'));

        // const wallBrace = this.add(new Brace({ from: [4, -3], to: ladder.to(), direction: RIGHT() }));
        // const yText = this.add(wallBrace.tex('y'));

        // const hText = this.add(ladder.texOnEdge('5', 0, UL()));

        // this.add(new Updater((pctComplete: number, starting: boolean) => {
        //     const newY = math.lerp(2, -3, pctComplete);
        //     const newX = math.lerp(0, 4 - Math.sqrt(41), pctComplete);
        //     ladder.changePoints([[newX, -3], [4, newY]]);

        //     groundBrace.changeFrom([newX, -3]);
        //     wallBrace.changeTo([4, newY]);

        //     xText.nextTo(groundBrace, DOWN(), 0.2);
        //     yText.nextTo(wallBrace, RIGHT(), 0.2);
        //     hText.nextTo(ladder.edgeMidpoint(0), UL(), 0.2);
        // }, { duration: 3000, easing: Easing.linear, repeat: true, }));


        // const aConfig = {
        //     xRange: [0, 2],
        //     yRange: [0, 2],
        //     xLength: 3,
        //     yLength: 3,
        //     xStep: 0.5,
        //     showTicks: false,
        //     showLabels: false,
        // };
        
        // const a1 = new Axes(aConfig);
        // const a2 = new Axes(aConfig);
        // const a3 = new Axes(aConfig);
        // const a4 = new Axes(aConfig);
        
        // const fn = x => x * x * x;
        
        // const p1 = a1.plot(fn);
        // const p2 = a2.plot(fn);
        // const p3 = a3.plot(fn);
        // const p4 = a4.plot(fn);
        
        // function centerPoint(a) {
        //     const pt = a.point(0.8, fn(0.8));
        //     return new Dot({ x: pt[0], y: pt[1], radius: 0.05, color: Colors.blue() });
        // }
        
        // function pointsAndLine(a, x1, x2) {
        //     const pt1 = a.point(x1, fn(x1));
        //     const pt2 = a.point(x2, fn(x2));
        
        //     return [
        //         new Line({ from: pt1, to: pt2, lineColor: Colors.red(), }),
        //         new Dot({ x: pt1[0], y: pt1[1], radius: 0.05, color: Colors.red() }),
        //         new Dot({ x: pt2[0], y: pt2[1], radius: 0.05, color: Colors.red() }),
        //         centerPoint(a)
        //     ];
        // }

        // this.add(
        //     new Group(a1, p1, ...pointsAndLine(a1, 0.5, 1)).shift(LEFT(3), UP(2)),
        //     new Group(a2, p2, ...pointsAndLine(a2, 0.1, 0.75)).shift(RIGHT(3), UP(2)),
        //     new Group(a3, p3, ...pointsAndLine(a3, 0.7, 1.2)).shift(LEFT(3), DOWN(2)),
        //     new Group(a4, p4, ...pointsAndLine(a4, 1, 1.25)).shift(RIGHT(3), DOWN(2)),
        // );

        // const aConfig = {
        //     xRange: [0, 2],
        //     yRange: [0, 20],
        //     xLength: 5,
        //     yLength: 5,
        //     xStep: 0.5,
        //     showTicks: false,
        //     showLabels: false,
        // };

        // const a1 = new Axes(aConfig);
        // const a2 = new Axes(aConfig);

        // const leftP1 = a1.point(0.5, 10 * 0.5);
        // const leftP2 = a1.point(1.5, 10 * 1.5);
        // const leftMid = a1.point(1, 10);

        // const endpointStyles = { radius: 0.05, color: Colors.red() };
        // const midpointStyles = { radius: 0.05, color: Colors.blue() };

        // const rightP1 = a2.point(0.5, 5 * 0.5 * 0.5);
        // const rightP2 = a2.point(1.5, 5 * 1.5 * 1.5);
        // const rightMid = a2.point(1, 5 * 1 * 1);

        // const left = this.add(new Group(
        //     a1, a1.plot(x => 10 * x),
        //     new Line({ from: leftP1, to: leftP2, lineColor: Colors.red() }),
        //     new Dot({ center: leftP1, ...endpointStyles }),
        //     new Dot({ center: leftP2, ...endpointStyles }),
        //     new Dot({ center: leftMid, ...midpointStyles }),
        //     new Text('(a)').nextTo(a1, DOWN()),
        // ).shift(LEFT(3)));

        // const right = this.add(new Group(
        //     a2, a2.plot(x => 5 * x * x),
        //     new Line({ from: rightP1, to: rightP2, lineColor: Colors.red() }),
        //     new Dot({ center: rightP1, ...endpointStyles }),
        //     new Dot({ center: rightP2, ...endpointStyles }),
        //     new Dot({ center: rightMid, ...midpointStyles }),
        //     new Text('(b)').nextTo(a2, DOWN()),
        // ).shift(RIGHT(3)));

        // this.add(
        //     new Line({ from: rightP1, to: rightP2, lineColor: Colors.red() }),
        //     new Dot({ center: rightP1, ...endpointStyles }),
        //     new Dot({ center: rightP2, ...endpointStyles }),
        //     new Dot({ center: rightMid, ...midpointStyles }),
        // );

        // this.add(axes.shift(LEFT(2)), p);
        // this.add(new Group(axes, p).shift(LEFT(2)));

        // this.add(axes.shift(LEFT(2)))
        // this.add(axes.plot(x => x));

        // const fn = x => x * x * x;

        // const p1 = a1.plot(fn);
        // const p2 = a2.plot(fn);

        // function centerPoint(a) {
        //     const pt = a.point(0.8, fn(0.8));
        //     return new Dot({ x: pt[0], y: pt[1], radius: 0.05, color: Colors.blue() });
        // }
        
        // function pointsAndLine(a, x1, x2) {
        //     const pt1 = a.point(x1, fn(x1));
        //     const pt2 = a.point(x2, fn(x2));
        
        //     return [
        //         new Line({ from: pt1, to: pt2, lineColor: Colors.red(), }),
        //         new Dot({ x: pt1[0], y: pt1[1], radius: 0.05, color: Colors.red() }),
        //         new Dot({ x: pt2[0], y: pt2[1], radius: 0.05, color: Colors.red() }),
        //         centerPoint(a)
        //     ];
        // }

        // this.add(
        //     new Group(a1, p1, ...pointsAndLine(a1, 0.5, 1)).shift(LEFT(3), UP(2)),
        //     new Group(a2, p2, ...pointsAndLine(a2, 0.1, 0.75)).shift(RIGHT(3), UP(2)),
        //     new Group(a3, p3, ...pointsAndLine(a3, 0.7, 1.2)).shift(LEFT(3), DOWN(2)),
        //     new Group(a4, p4, ...pointsAndLine(a4, 1, 1.25)).shift(RIGHT(3), DOWN(2)),
        // );

        const axes = new Axes({
            xLength: 10,
            yLength: 6,
            xRange: [0, 1],
            xStep: 0.25,
            yRange: [0, 50],
            yStep: 5,
            xLabel: 'time (h)',
            yLabel: 'distance (miles)'
        });
        
        const p = axes.plot(x => 25 * x * x).changeLineColor(Colors.green());
        
        const d1 = new Dot({ center: p.pointAtX(0.0), color: Colors.red() });
        const d2 = new Dot({ center: p.pointAtX(0.5), color: Colors.red() });
        const d3 = new Dot({ center: p.pointAtX(0.5), color: Colors.green() });
        const l = new Line(d1, d2).changeLineColor(Colors.red());
        
        this.add(
            axes, p,
            d3,
            d1,
            d2,
            l,
        );

        this.add(new Updater((pctComplete: number, starting: boolean) => {
            const x1 = math.lerp(0, 0.5, pctComplete);
            const x2 = math.lerp(0.5, 1, pctComplete);

            d1.moveTo(p.pointAtX(x1));
            d2.moveTo(p.pointAtX(x2));
            l.changeEndpoints(d1, d2);
        }, { duration: 3000, easing: Easing.linear, repeat: true, yoyo: true, }));
    }
}

// new TestScene({ canvas: cvs }).render();
new TestScene().render();

// createScene(() => {
//     this.add(new GridLines());
// });

// createScene(scene => {
//     scene.add(new GridLines());
// });

// createScene(function(scene) {
//     scene.add(new GridLines());
// });
