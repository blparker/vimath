import { BezierSegment, Point, RIGHT } from '@/base';
import { Colors } from '@/colors';
import math from '@/math';
import { PointShape } from '@/shapes/primitives/point_shape';


class Brace extends PointShape {
    constructor(from: Point, to: Point, direction?: Point) {
        const bezierPoints = Brace.calculateBezierPoints(from, to);
        super({ points: [], bezierPoints, color: Colors.black(), lineColor: Colors.transparent() });
    }

    private static calculateBezierPoints(from: Point, to: Point): BezierSegment[] {
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
}


export { Brace };
