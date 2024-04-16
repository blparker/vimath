import { Point } from '@/base';
import { Shape, ShapeStyles } from '@/shapes/shape';
import { ComposedShape } from '@/shapes/composed/composed_shape';
import { Colors } from '@/colors';
import { Drawable } from '@/shapes/primitives/drawable';
import math from '@/math';
import { config } from '@/config';


type BraceArgs = { from: Point, to: Point, standoff?: number } & ShapeStyles;


class Brace extends ComposedShape {
    private _from: Point;
    private _to: Point;
    private _standoff: number;

    constructor(from: Point, to: Point);
    constructor(args: BraceArgs);
    constructor(fromOrArgs: Point | BraceArgs, to?: Point) {
        if (Array.isArray(fromOrArgs) && to) {
            super();

            this._from = fromOrArgs;
            this._to = to;
            this._standoff = config.standoff;
        } else if (typeof fromOrArgs === 'object' && !Array.isArray(fromOrArgs)) {
            const {from, to, standoff, ...styles} = fromOrArgs;
            super(styles);

            this._from = from;
            this._to = to;
            this._standoff = standoff ?? config.standoff;
        } else {
            throw new Error('Invalid arguments');
        }
    }

    compose(): Shape {
        const len = math.dist(this._from, this._to);
        const [fX, fY] = [-len / 2, 0];
        const [tX, tY] = [len / 2, 0];
        const midX = (fX + tX) / 2;
        const midY = (fY + tY) / 2;

        const braceWidth = len <= 2 ? 0.3 : 0.5;
        const thickness = len <= 2 ? 0.1 : 0.15;

        const angle = math.angleVec(this._from, this._to);

        const rotate = (x: number, y: number): Point => {
            return math.rotateAboutPoint([x, y], angle, [midX, midY]);
        };

        const rotateAndTranslate = (x: number, y: number): Point => {
            const [cX, cY] = math.midpoint(this._from, this._to);

            return math.addVec([cX, cY], rotate(...math.addVec([x, y], [0, -this._standoff])));
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

        return this;
    }
}


export { Brace };