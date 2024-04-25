import { BezierSegment, Point, RIGHT } from '@/base';
import math from '@/math';
import { PointShape, ShapeStyles } from '@/shapes/primitives/bezier_point_shape';
import { Shape, isShape, defaultShapeStyles } from '@/shapes';
import { config } from '@/config';
import utils from '@/utils';
import { Colors } from '@/colors';


type BraceArgs = { from: Point, to: Point, standoff?: number, direction?: Point } & ShapeStyles;


class Brace extends PointShape {
    private _from: Point;
    private _to: Point;
    private _standoff: number;
    private _direction: Point;


    constructor(from: Point, to: Point, direction?: Point);
    constructor(shape: Shape, direction?: Point);
    constructor(args: BraceArgs);
    constructor(fromOrArgs: Shape | Point | BraceArgs, to?: Point, direction?: Point) {
        let from: Point;
        let braceStyles = Object.assign({}, defaultShapeStyles, { color: defaultShapeStyles.lineColor, lineColor: Colors.transparent() });
        const defaultDirection: Point = [0, 0];
        let standoff: number = config.standoff;

        if (Array.isArray(fromOrArgs) && to) {
            from = fromOrArgs;
        } else if (isShape(fromOrArgs)) {
            direction = to !== undefined ? to : defaultDirection;

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

            from = [fromX, fromY];
            to = [toX, toY];
        } else if (typeof fromOrArgs === 'object' && !Array.isArray(fromOrArgs)) {
            from = fromOrArgs.from;
            to = fromOrArgs.to;
            standoff = fromOrArgs.standoff ?? config.standoff;
            direction = fromOrArgs.direction;
            braceStyles = { ...braceStyles, ...utils.extractType<ShapeStyles>(fromOrArgs) };
        } else {
            throw new Error('Invalid arguments for brace. Must be a Shape, two Points, or an object with the properties from and to.');
        }

        direction = direction ?? defaultDirection;

        const points = Brace.calculateBezierPoints(from, to, direction);
        super({ points, ...braceStyles });

        this._from = from;
        this._to = to;
        this._standoff = standoff;
        this._direction = direction;
    }

    private static calculateBezierPoints(from: Point, to: Point, direction: Point): BezierSegment[] {
        [from, to] = Brace.getToAndFrom(from, to, direction);

        const len = math.dist(from, to);
        const [fX, fY] = [-len / 2, 0];
        const [tX, tY] = [len / 2, 0];
        const midX = (fX + tX) / 2;
        const midY = (fY + tY) / 2;
        const standoff = 0.15;

        const braceWidth = len <= 2 ? 0.3 : 0.5;
        const thickness = len <= 2 ? 0.1 : 0.15;
        const angle = math.angleVec(from, to);

        const rotate = (x: number, y: number): Point => {
            return math.rotateAboutPoint([x, y], angle, [midX, midY]);
        };

        const rotateAndTranslate = (x: number, y: number): Point => {
            const [cX, cY] = math.midpoint(from, to);

            [x, y] = math.addVec([x, y], [0, -standoff]);
            return math.addVec([cX, cY], rotate(x, y));
        };

        return [
            [rotateAndTranslate(midX, midY - braceWidth), rotateAndTranslate(midX, midY), rotateAndTranslate(fX, fY - braceWidth), rotateAndTranslate(fX, fY)],
            [null, rotateAndTranslate(fX, fY - braceWidth - thickness), rotateAndTranslate(midX - braceWidth, midY - thickness), rotateAndTranslate(midX, midY - braceWidth)],
            [rotateAndTranslate(midX, midY - braceWidth), rotateAndTranslate(midX, midY), rotateAndTranslate(tX, tY - braceWidth), rotateAndTranslate(tX, tY)],
            [null, rotateAndTranslate(tX, tY - braceWidth - thickness), rotateAndTranslate(midX + braceWidth, midY - thickness), rotateAndTranslate(midX, midY - braceWidth)]
        ];
    }

    private static getToAndFrom(from: Point, to: Point, direction: Point): [Point, Point] {
        const [dX, dY] = direction;

        if (dX === 0 && dY === 0) {
            return [from, to];
        } else {
            const [minX, minY] = [Math.min(from[0], to[0]), Math.min(from[1], to[1])];
            const [maxX, maxY] = [Math.max(from[0], to[0]), Math.max(from[1], to[1])];

            if (dY < 0) {
                // Down
                return [
                    [minX, minY],
                    [maxX, minY]
                ];
            } else if (dY > 0) {
                // Up
                return [
                    [maxX, maxY],
                    [minX, maxY]
                ];
            } else if (dX > 0) {
                // Right
                return [
                    [maxX, minY],
                    [maxX, maxY]
                ];
            } else {
                // Left
                return [
                    [minX, maxY],
                    [minX, minY]
                ];
            }
        }
    }
}


export { Brace };
