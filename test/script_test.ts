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
        // this.add(new Tex('x^2 + 2').nextTo(n2, LEFT(), 0.5))
        // this.add(new Tex('(x^2 + 2)^3').nextTo(n1, LEFT(), 0.5))

        // const f1 = x => x;
        // const f2 = x => x * x + 2;
        // const f3 = x => Math.pow(f2(x), 3);

        // const d3 = this.add(new Dot(n1.pointOnLine(8)));
        // const d2 = this.add(new Dot(n2.pointOnLine(2)));
        // const d1 = this.add(new Dot(n3.pointOnLine(0)));

        // this.add(new Updater((pctComplete: number, starting: boolean) => {
        //     const x = math.lerp(0, 1, pctComplete);

        //     console.log(pctComplete, x, f1(x), f2(x), f3(x));

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

        const center = [-4, -3] as Point;
        const c = new Circle({ radius: 8, center, lineWidth: 2, lineColor: Colors.gray() });
        this.add(c);
        const segment = this.add(new Arc({ radius: 8, center, startAngle: 0, endAngle: Math.PI / 4, lineColor: Colors.blue() }));

        // this.add(new Tex('\\theta').nextTo(segment.pointAtAngle(Math.PI / 8), RIGHT(), 0.2).changeColor(Colors.blue()));

        // const o = this.add(new Dot());
        const p = this.add(new Dot(c.pointAtAngle(Math.PI / 4)));

        function triangle(p: Point) {
            return [center, p, [p[0], center[1]], center];
        }

        this.add(new Line({ from: center, to: c.pointAtAngle(0), lineStyle: 'dashed', lineWidth: 2, lineColor: Colors.gray() }));
        const t = this.add(new PointShape({
            points: triangle(c.pointAtAngle(Math.PI / 4)),
        }));

        // const hypText = this.add(t.texOnEdge('1', 0, UP(), 0.2));
        // const sineText = this.add(t.texOnEdge('\\sin \\theta', 1, LEFT(), 0.2));
        // const angleText = this.add(new Tex('\\theta').shift(RIGHT(0.5), UP(0.25)));

        // function triangle(p: Point) {
        //     return [[-6, -3], p, [p[0], -3], [-6, -3]];
        // }

        // const tri = this.add(new PointShape({
        //     points: triangle([0, 3])
        // }));

        // this.add(new Arc({
        //     center: [-6, -3],
        //     radius: 8.5,
        //     startAngle: 0,
        //     endAngle: Math.PI / 4,
        //     lineColor: Colors.blue(),
        // }));

        this.add(new Updater((pctComplete: number, starting: boolean) => {
            const x = Math.PI / 4 - math.lerp(0, Math.PI / 4, pctComplete);
            p.moveTo(c.pointAtAngle(x));
            // tri.changePoints(triangle(p.center()));
            // hypText.nextTo(t.edgeMidpoint(0), UP(), 0.2);
            // sineText.nextTo(t.edgeMidpoint(1), RIGHT(), 0.2);
        }, { duration: 5000, easing: x => Easing.easeStep(x, 10), repeat: true, }));


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
