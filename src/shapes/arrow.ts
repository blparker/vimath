import { Point } from '../base.js';
import { Colors } from '../colors.js';
import { Line, Triangle } from './base_shapes.js';
import { ComposableShape } from './composed_shape.js';



export class Arrow extends ComposableShape {
    private from: Point;
    private to: Point;
    private tipSize: number;

    constructor({ from, to, tipSize = 0.2 }: { from: Point; to: Point; tipSize?: number; }) {
        super();

        this.from = from;
        this.to = to;
        this.tipSize = tipSize;
    }

    compose(): ComposableShape {
        const line = new Line({ from: this.from, to: this.to });

        // Determine the orientation of the arrow tip
        const theta = Math.atan2(this.to[1], this.to[0]);
        const tipCenterX = this.to[0] - this.tipSize / 2 * Math.cos(theta);
        const tipCenterY = this.to[1] - this.tipSize / 2 * Math.sin(theta);

        const tip = new Triangle({ x: tipCenterX, y: tipCenterY, height: this.tipSize, color: Colors.black() }).rotate(-Math.PI / 2 + theta);

        this.add(line, tip);

        return this;
    }
}
