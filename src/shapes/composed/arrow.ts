import { ComposedShape } from './composed_shape';
import { Locatable, ShapeStyles, locatableToPoint } from '@/shapes/shape';
import { Text } from '@/shapes/primitives/text';
import { Line } from '@/shapes/primitives/line';
import { LEFT, Point, Prettify } from '@/base';
import { Triangle } from '@/shapes/derived/triangle';
import { config } from '@/config';
import math from '@/math';


type ArrowArgs = {
    from?: Locatable;
    to?: Locatable;
    tipSize?: number;
    bothEnds?: boolean;
    standoff?: number;
};


class Arrow extends ComposedShape {
    private _from: Point;
    private _to: Point;
    private _tipSize: number;
    private _bothEnds: boolean;
    private _standoff: number;

    constructor({ from = [-1, 0], to = [1, 0], tipSize = config.arrowTipSize, bothEnds = false, standoff = config.standoff, ...styleArgs }: Prettify<ArrowArgs & ShapeStyles> = {}) {
        super({ ...styleArgs });

        this._from = locatableToPoint(from);
        this._to = locatableToPoint(to);
        this._tipSize = tipSize;
        this._bothEnds = bothEnds;
        this._standoff = standoff;

        // Move the `to` location back by the standoff amount so that the arrow doesn't land awkwardly directly on whatever it's pointing to
        const u = math.unitVec(this._from, this._to);
        const t = math.subVec(this._to, math.multScalar(u, this._standoff));

        this._to = t;
    }

    compose(): this {
        /*
         * Might be an easier way to do this. Need to "pull in" the ends so that the ends don't peek out of the arrowhead. Calculate the unit vector and 
         * move the "to" and "from" point in the direction of the unit vector by the "contractBy" amount
         */
        const contractBy = 0.1;
        const u = math.unitVec(this._from, this._to);

        // Only contract the from end if we want arrows on both ends
        const from = this._bothEnds ? math.addVec(this._from, math.multScalar(u, contractBy)) : this._from;
        const to = math.subVec(this._to, math.multScalar(u, contractBy));

        // The angle of the line
        const angle = Math.PI / 2 - math.angleVec(from, to);

        const styles = Object.assign({}, this.styles(), {
            color: this.styles().color || this.styles().lineColor
        });
        const arrowHead = new Triangle({ width: this._tipSize, height: this._tipSize, ...Object.assign({}, styles, { adjustForLineWidth: true }) });

        /* Calculate the new center of the arrow head. By default, when moving the arrow to the "to" point, the arrow head will be centered at the "to" point.
         * Pull it down the line by using the unit vector the the geometric center of the triangle (i.e., 2/3 the height) */
        const arrowCenter = math.subVec(this._to, math.multScalar(u, (2 / 3) * this._tipSize));

        this.add(
            new Line({ from, to, ...styles }),
            arrowHead.moveTo(arrowCenter).rotate(-angle)
        );

        if (this._bothEnds) {
            const otherArrowHead = arrowHead.copy();
            const arrowCenter = math.addVec(this._from, math.multScalar(u, (2 / 3) * this._tipSize));

            this.add(otherArrowHead.moveTo(arrowCenter).rotate(Math.PI));
        }

        return this;
    }

    text(text: string, direction: Point = LEFT(), standoff: number = config.standoff): Text {
        return new Text({ text }).nextTo(this, direction, standoff);
    }
}


export { Arrow };
