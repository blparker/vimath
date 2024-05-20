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
import { Scene, BaseAnimation, GridLines, Square, Text, RIGHT, LEFT, UP, DOWN, UR, DR, DL, UL, Tex, Axes, Triangle, NumberLine, Colors, Dot, Line, Arrow, Circle, Group, TangentLine, PointShape, Point, Updater, Easing, Brace } from '../src';
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

        function rectangle(w: number, h: number): PointShape {
            return new PointShape({
                points: [
                    [-w / 2, h / 2],
                    [w / 2, h / 2],
                    [w / 2, -h / 2],
                    [-w / 2, -h / 2],
                    [-w / 2, h / 2],
                ],
            })
        }

        const rect = rectangle(3, 3);

        this.add(rect);
        const b = this.add(new Brace(rect, LEFT()));
        this.add(b.tex('x'))

        const b2 = this.add(new Brace(rect, RIGHT()));
        this.add(new Text({ text: 'Y', baseline: 'top' }).nextTo(b2, RIGHT()));
    }
}

// new TestScene({ canvas: cvs }).render();
new TestScene().render();
