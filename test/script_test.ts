import { Scene } from '../src/scene';
import { Line } from '../src/shapes/primitives/line';
import { BaseAnimation } from '../src/animation/animation';
import { FadeIn } from '../src/animation/fade_in';
import { Line2 } from '../src/shapes/primitives/connected_shape';
import { Arc } from '../src/shapes/primitives/arc';
import { Arrow } from '../src/shapes/composed/arrow';
import { Triangle } from '../src/shapes/derived/triangle';
import { Tex } from '../src/shapes/derived/tex';
import { NumberLine } from '../src/shapes/composed/number_line';
import { Text } from '../src/shapes/primitives/text';
import { LEFT, DOWN, UP, RIGHT, UL, UR, DL, DR, ORIGIN } from '../src/base';
import { Axes } from '../src/shapes/composed/axes';
import { Colors } from '../src/colors';
import { GridLines } from '../src/shapes/composed/grid_lines';
import { Brace } from '../src/shapes/composed/brace';
import { Circle, Dot, PointShape } from '../src/shapes';
import { TangentLine } from '../src/shapes/derived/tangent_line';
import { Square } from '../src/shapes/derived/square';
import math from '../src/math';


const cvs = document.getElementById('cvs') as HTMLCanvasElement;

class TestAnimation extends BaseAnimation {
    update(pctComplete: number, starting: boolean): void {
        console.log(pctComplete);
    }
}


class TestScene extends Scene {
    compose() {
        this.add(new GridLines());

        // const c = this.add(new Circle({ radius: 4, lineColor: Colors.blue() }));
        // const pt45 = c.pointAtAngle(Math.PI / 4);

        // const d = this.add(new Dot(pt45));
        // const o = this.add(new Dot(ORIGIN));
        // this.add(new Tex('\\text{O}').nextTo(o, DOWN()));
        // this.add(new Tex('\\text{P}').nextTo(d, UR()));

        // const triangle = this.add(new PointShape({ points: [ORIGIN, pt45, [pt45[0], 0]], lineWidth: 2 }));
        // this.add(triangle.texOnEdge('1', 0, UL()));
        // this.add(triangle.texOnEdge('\\sin \\theta', 1, LEFT()));
        // this.add(triangle.texOnEdge('\\cos \\theta', 2, UP()));

        // const b = this.add(new Brace({ from: [0, 0], to: [0, 3], direction: DOWN() }));

        /**** TODO:
         * 
         *  Need to rework how a brace is formed. What Manim currently does is the following:
         *      - if direction is not provided, it infers the direction from the points
         *      - if the direction is provided, the direction is used, but it doesn't follow the direction of the points. For example, for
         *        the points [0, 0] to [3, 2] and the direction is DOWN(), the brace doesn't follow the direction of the points. It is completely 
         *        horizontal spanning the X-distance between the points
        */

        const sq = this.add(new Square());
        this.add(new Brace(sq, DOWN()));

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

        // const b5 = this.add(new Brace({ from: [0, 0], to: [-3, 0], direction: DOWN() }));

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
    }
}

new TestScene({ canvas: cvs }).render();
