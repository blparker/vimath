import { ORIGIN, Point, Shift } from '../base.js';
import { Colors, RGBA } from '../colors.js';
import { Line, Triangle } from './base_shapes.js';
import { ComposableShape } from './composed_shape.js';
import * as math from '../math.js';



export class Arrow extends ComposableShape {
    private from: Point;
    private to: Point;
    private tipSize: number;
    private color: RGBA;

    constructor({ from, to, tipSize = 0.2, color = Colors.black() }: { from: Point; to: Point; tipSize?: number; color?: RGBA; }) {
        super();

        this.from = from;
        this.to = to;
        this.tipSize = tipSize;
        this.color = color;
    }

    compose(): ComposableShape {
        const line = new Line({ from: this.from, to: this.to });
        // console.log(this.from, this.to, math.subtract(ORIGIN, this.from), math.subtract(ORIGIN, this.to));
        // const shift = math.subtract(ORIGIN, this.from);
        // const [tX, tY] = math.add(this.to, shift);

        // // Determine the orientation of the arrow tip
        // // const theta = Math.atan2(this.to[1], this.to[0]);
        // const theta = Math.atan2(tY, tX);
        // const tipCenterX = this.to[0] - this.tipSize / 2 * Math.cos(theta);
        // const tipCenterY = this.to[1] - this.tipSize / 2 * Math.sin(theta);

        // const tip = new Triangle({ x: tipCenterX, y: tipCenterY, height: this.tipSize, color: this.color }).rotate(-Math.PI / 2 + theta);
        // const tip = new Triangle({ x: tipCenterX, y: tipCenterY, height: this.tipSize, color: Colors.black() }).rotate(theta);

        // this.add(line, tip);

        // let shift: Shift;
        // let theta: number;
        // const tip = new Triangle({ height: this.tipSize, color: this.color });

        // if (math.distance(ORIGIN, this.from) > math.distance(ORIGIN, this.to)) {
        //     shift = math.subtract(ORIGIN, this.to) as Shift;

        //     const [x, y] = math.add(this.from, shift);
        //     theta = Math.atan2(y, x);

        //     // new Line({ from: math.add(this.from, [sX, sY]) as Point, to: math.add(this.to, [sX, sY]) as Point }),
        // } else {
        //     shift = math.subtract(ORIGIN, this.from) as Shift;
        //     const [x, y] = math.add(this.to, shift);
        //     theta = Math.atan2(y, x);
        // }

        // const tipCenterX = this.to[0] - this.tipSize / 2;
        // const tipCenterY = this.to[1] - this.tipSize / 2;

        const shift = math.subtract(ORIGIN, this.from) as Shift;
        const [sX, sY] = math.add(this.to, shift);
        const theta = -Math.PI / 2 + Math.atan2(sY, sX);

        const tipCenterX = this.to[0] - this.tipSize / 2 * Math.cos(Math.atan2(sY, sX));
        const tipCenterY = this.to[1] - this.tipSize / 2 * Math.sin(Math.atan2(sY, sX));
        const tip = new Triangle({ x: tipCenterX, y: tipCenterY, height: this.tipSize, color: this.color }).rotate(theta);

        this.add(line, tip);

        return this;
    }
}
