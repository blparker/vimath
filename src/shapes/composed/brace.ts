import { Point, RIGHT } from '@/base';
import { Shape, ShapeStyles, isShape } from '@/shapes/shape';
import { ComposedShape } from '@/shapes/composed/composed_shape';
import { Colors } from '@/colors';
import { Drawable } from '@/shapes/primitives/drawable';
import math from '@/math';
import { config } from '@/config';


type BraceArgs = { from: Point, to: Point, standoff?: number, direction?: Point } & ShapeStyles;


class Brace extends ComposedShape {
    private _from: Point;
    private _to: Point;
    private _standoff: number;
    private _direction: Point;

    constructor(from: Point, to: Point, direction?: Point);
    constructor(shape: Shape, direction?: Point);
    constructor(args: BraceArgs);
    constructor(fromOrArgs: Shape | Point | BraceArgs, to?: Point, direction?: Point) {
        if (Array.isArray(fromOrArgs) && to) {
            super();

            this._from = fromOrArgs;
            this._to = to;
            this._standoff = config.standoff;
            this._direction = direction ?? [0, 0];
        } else if (isShape(fromOrArgs)) {
            super();

            const direction = to !== undefined ? to : [0, 0] as Point;
            const [dX, dY] = direction;
            let [fromX, fromY] = [0, 0];
            let [toX, toY] = [0, 0];

            if (dX !== 0) {
                const top = fromOrArgs.top();
                const bottom = fromOrArgs.bottom();

                fromY = bottom[1];
                toY = top[1];

                if (dX > 0) {
                    const right = fromOrArgs.right();
                    fromX = toX = right[0];
                } else {
                    const left = fromOrArgs.left();
                    fromX = toX = left[0];
                }
            }

            if (dY !== 0) {
                const left = fromOrArgs.left();
                const right = fromOrArgs.right();

                fromX = left[0];
                toX = right[0];

                if (dY > 0) {
                    const top = fromOrArgs.top();
                    fromY = toY = top[1];
                } else {
                    const bottom = fromOrArgs.bottom();
                    fromY = toY = bottom[1];
                }
            }

            this._from = [fromX, fromY];
            this._to = [toX, toY];
            this._standoff = config.standoff;
            this._direction = direction ?? [0, 0];
        } else if (typeof fromOrArgs === 'object' && !Array.isArray(fromOrArgs)) {
            const {from, to, standoff, direction, ...styles} = fromOrArgs;
            super(styles);

            this._from = from;
            this._to = to;
            this._standoff = standoff ?? config.standoff;
            this._direction = direction ?? [0, 0];
        } else {
            throw new Error('Invalid arguments');
        }
    }

    compose(): Shape {
        const [dX, dY] = this._direction;
        let from: Point, to: Point;
        if (dX === 0 && dY === 0) {
            from = this._from;
            to = this._to;
        } else {
            const [minX, minY] = [Math.min(this._from[0], this._to[0]), Math.min(this._from[1], this._to[1])];
            const [maxX, maxY] = [Math.max(this._from[0], this._to[0]), Math.max(this._from[1], this._to[1])];

            if (dY < 0) {
                // Down
                from = [minX, minY];
                to = [maxX, minY];
            } else if (dY > 0) {
                // Up
                from = [maxX, maxY];
                to = [minX, maxY];
            } else if (dX > 0) {
                // Right
                from = [maxX, minY];
                to = [maxX, maxY];
            } else {
                // Left
                from = [minX, maxY];
                to = [minX, minY];
            }
        }

        const len = math.dist(from, to);
        const [fX, fY] = [-len / 2, 0];
        const [tX, tY] = [len / 2, 0];
        const midX = (fX + tX) / 2;
        const midY = (fY + tY) / 2;

        const braceWidth = len <= 2 ? 0.3 : 0.5;
        const thickness = len <= 2 ? 0.1 : 0.15;
        const angle = math.angleVec(from, to);

        const rotate = (x: number, y: number): Point => {
            return math.rotateAboutPoint([x, y], angle, [midX, midY]);
        };

        const rotateAndTranslate = (x: number, y: number): Point => {
            const [cX, cY] = math.midpoint(from, to);

            [x, y] = math.addVec([x, y], [0, -this._standoff]);
            return math.addVec([cX, cY], rotate(x, y));
        };

        const leftDrawable = new Drawable();

        leftDrawable.bezierCurve({
            start: rotateAndTranslate(midX, midY - braceWidth),
            control1: rotateAndTranslate(midX, midY),
            control2: rotateAndTranslate(fX, fY - braceWidth),
            end: rotateAndTranslate(fX, fY)
        });
        leftDrawable.bezierCurve({
            control1: rotateAndTranslate(fX, fY - braceWidth - thickness),
            control2: rotateAndTranslate(midX - braceWidth, midY - thickness),
            end: rotateAndTranslate(midX, midY - braceWidth)
        });

        leftDrawable.fill(Colors.black());
        // leftDrawable.stroke(Colors.black());
        this.add(leftDrawable);


        const rightDrawable = new Drawable();

        rightDrawable.bezierCurve({
            start: rotateAndTranslate(midX, midY - braceWidth),
            control1: rotateAndTranslate(midX, midY),
            control2: rotateAndTranslate(tX, tY - braceWidth),
            end: rotateAndTranslate(tX, tY)
        });
        rightDrawable.bezierCurve({
            control1: rotateAndTranslate(tX, tY - braceWidth - thickness),
            control2: rotateAndTranslate(midX + braceWidth, midY - thickness),
            end: rotateAndTranslate(midX, midY - braceWidth)
        });

        rightDrawable.fill(Colors.black());
        this.add(rightDrawable);

        // const len = math.dist(this._from, this._to);
        // const [minX, minY] = [Math.min(this._from[0], this._to[0]), Math.min(this._from[1], this._to[1])];
        // const [maxX, maxY] = [Math.max(this._from[0], this._to[0]), Math.max(this._from[1], this._to[1])];
        // const [midX, midY] = [(minX + maxX) / 2, (minY + maxY) / 2];
        // const [dX, dY] = this._direction;

        // // Define the brace dimensions based on the length and direction
        // const braceWidth = len <= 2 ? 0.3 : 0.5;
        // const thickness = len <= 2 ? 0.1 : 0.15;
    
        // // Function to rotate and translate based on the calculated angle and direction
        // const angle = dX === 0 && dY === 0 ? math.angleVec(this._from, this._to) : Math.atan2(dY, dX);
    
        // const rotateAndTranslate = (x: number, y: number): Point => {
        //     return math.rotateAboutPoint([x, y], angle, [midX, midY]);
        // };
    
        // // Calculate the adjusted midpoints for start and end of the brace based on direction
        // const horizontalShift = (dX === 0 ? len : dX * len) / 2;
        // const verticalShift = (dY === 0 ? 0 : dY * len / 2);
    
        // // Create drawables for each side of the brace
        // const leftDrawable = new Drawable();
        // leftDrawable.bezierCurve({
        //     start: rotateAndTranslate(-horizontalShift, midY - braceWidth),
        //     control1: rotateAndTranslate(-horizontalShift, midY),
        //     control2: rotateAndTranslate(-len / 2, -braceWidth),
        //     end: rotateAndTranslate(-len / 2, 0)
        // });
    
        // // Continue the curve smoothly
        // leftDrawable.bezierCurve({
        //     control1: rotateAndTranslate(-len / 2, -braceWidth - thickness),
        //     control2: rotateAndTranslate(0, -thickness * 2),
        //     end: rotateAndTranslate(0, -braceWidth)
        // });
    
        // leftDrawable.fill(Colors.black());
        // this.add(leftDrawable);

        return this;
    }
}


export { Brace };