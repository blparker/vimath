import { Point, Prettify, RIGHT } from '@/base';
import { RGBA } from '@/colors';
import { Locatable, Shape, ShapeStyles, defaultShapeStyles, isShape } from '@/shapes/shape';
import { locatableToPoint } from './point_shape';
import { config } from '@/config';
import { TextMeasurement } from '@/shapes/primitives/text_measurement';
import utils from '@/utils';


type TextBaseline = 'top' | 'middle' | 'bottom';
type TextAlign = 'left' | 'center' | 'right';

type TextArgs = {
    text: string;
    x?: number;
    y?: number;
    center?: Locatable;
    size?: number;
    font?: string;
    baseline?: TextBaseline;
    align?: TextAlign;
    tex?: boolean;
};


class Text implements Shape {
    private _text: string = 'Vimath';
    private _x: number = 0;
    private _y: number = 0;
    private _size: number = 20;
    private _font: string = 'monospace';
    private _styles: ShapeStyles = Object.assign({}, defaultShapeStyles);
    private _baseline: TextBaseline = 'middle';
    private _align: TextAlign = 'center';
    private _tex: boolean = false;
    private _textWidth: number;
    private _textHeight: number;
    private _textMeasurement: TextMeasurement;
    private _angle = 0;
    private _scale = 1;

    // constructor({ text, x = 0, y = 0, center, size = 20, font = 'monospace', baseline = 'middle', align = 'center', tex = false, ...styleArgs }: TextArgs & Prettify<ShapeStyles> = { text: '' }) {
    constructor();
    constructor(text: string);
    constructor(args: Prettify<TextArgs & ShapeStyles>);
    constructor(args?: Prettify<TextArgs & ShapeStyles> | string) {
        if (typeof args === 'string') {
            this._text = args;
        } else if (args !== undefined) {
            const { text, x, y, center, size, font, baseline, align, tex, ...styleArgs } = args;

            this._text = text;
            this._size = size ?? this._size;
            this._font = font ?? this._font;
            this._baseline = baseline ?? this._baseline;
            this._align = align ?? this._align;
            this._tex = tex ?? this._tex;
            this._styles = Object.assign({}, defaultShapeStyles, styleArgs);

            if (center !== undefined) {
                [this._x, this._y] = locatableToPoint(center);
            } else {
                this._x = x ?? this._x;
                this._y = y ?? this._y;
            }
        }

        this._textMeasurement = new TextMeasurement(config.canvasInstance!, this._tex);
        this._textWidth = this._textMeasurement.textWidth(this._text, this._size, this._font);
        this._textHeight = this._textMeasurement.textHeight(this._text, this._size, this._font);

        // if (this._align === 'center' && this._tex) {
        //     this._x -= this._textWidth / 2;
        // } else if (this._align === 'right' && this._tex) {
        //     this._x -= this._textWidth;
        // }
    }

    center(): Point {
        const { minX, maxX, minY, maxY } = this.boundingBox();
        return [(minX + maxX) / 2, (minY + maxY) / 2];
    }

    top(): Point {
        const { minX, maxX, maxY } = this.boundingBox();
        return [(minX + maxX) / 2, maxY];
    }

    right(): Point {
        const { maxX, minY, maxY } = this.boundingBox();
        return [maxX, (minY + maxY) / 2];
    }

    bottom(): Point {
        const { minX, maxX, minY } = this.boundingBox();
        return [(minX + maxX) / 2, minY];
    }

    left(): Point {
        const { minX, minY, maxY } = this.boundingBox();
        return [minX, (minY + maxY) / 2];
    }

    width(): number {
        return this._textWidth;
    }

    height(): number {
        return this._textHeight;
    }

    moveTo(point: Point): Shape {
        const [cX, cY] = this.position();

        this._x += (point[0] - cX);
        this._y += (point[1] - cY);

        return this;
    }

    shift(...shifts: Point[]): Shape {
        for (const [x, y] of shifts) {
            this._x += x;
            this._y += y;
        }

        return this;
    }

    scale(factor: number): Shape {
        this._scale += factor;
        return this;
    }

    rotate(angle: number): Shape {
        this._angle += angle;
        return this;
    }

    nextTo(other: Locatable, direction: Point = RIGHT()): Shape {
        let [toX, toY] = locatableToPoint(other);
        let [sW, sH] = [0, 0];
        const [w, h] = [this.width(), this.height()];

        if (isShape(other)) {
            sW = other.width();
            sH = other.height();
        }

        const [dX, dY] = direction;

        if (dX > 0) {
            toX += sW / 2 + config.standoff;

            if (this._align === 'center') {
                toX += w / 2;
            } else if (this._align === 'right') {
                toX += w;
            }
        } else if (dX < 0) {
            toX -= sW / 2 + config.standoff;

            if (this._align === 'center') {
                toX -= w / 2;
            } else if (this._align === 'left') {
                toX -= w;
            }
        }

        if (dY > 0) {
            toY += sH / 2 + config.standoff;

            if (this._baseline === 'middle') {
                toY += h / 2;
            } else if (this._baseline === 'top') {
                toY += h;
            }
        } else if (dY < 0) {
            toY -= sH / 2 + config.standoff;

            if (this._baseline === 'middle') {
                toY -= h / 2;
            } else if (this._baseline === 'bottom') {
                toY -= h;
            }
        }



        if (dX > 0 && dY === 0) {
            // Right
            // toX += sW / 2 + config.standoff;

            // if (this._align === 'center') {
            //     toX += w / 2;
            // } else if (this._align === 'right') {
            //     toX += w;
            // }

            if (this._baseline === 'top') {
                toY += h / 2;
            } else if (this._baseline === 'bottom') {
                toY -= h / 2;
            }
        } else if (dX < 0 && dY === 0) {
            // Left
            // toX -= sW / 2 + config.standoff;

            // if (this._align === 'center') {
            //     toX -= w / 2;
            // } else if (this._align === 'left') {
            //     toX -= w;
            // }

            if (this._baseline === 'top') {
                toY += h / 2;
            } else if (this._baseline === 'bottom') {
                toY -= h / 2;
            }
        } else if (dX === 0 && dY > 0) {
            // Up
            // toY += sH / 2 + config.standoff;

            // if (this._baseline === 'middle') {
            //     toY += h / 2;
            // } else if (this._baseline === 'top') {
            //     toY += h;
            // }

            if (this._align === 'right') {
                toX += w / 2;
            } else if (this._align === 'left') {
                toX -= w / 2;
            }
        } else if (dX === 0 && dY < 0) {
            // Down
            // toY -= sH / 2 + config.standoff;

            // if (this._baseline === 'middle') {
            //     toY -= h / 2;
            // } else if (this._baseline === 'bottom') {
            //     toY -= h;
            // }

            if (this._align === 'right') {
                toX += w / 2;
            } else if (this._align === 'left') {
                toX -= w / 2;
            }
        } else if (dX > 0 && dY > 0) {
            // Upper right
            // toY += sH / 2 + config.standoff;

            // if (this._baseline === 'middle') {
            //     toY += h / 2;
            // } else if (this._baseline === 'top') {
            //     toY += h;
            // }

            // toX += sW / 2 + config.standoff;

            // if (this._align === 'center') {
            //     toX += w / 2;
            // } else if (this._align === 'right') {
            //     toX += w;
            // }
        } else if (dX > 0 && dY < 0) {
            // Lower right
            // toX += w + config.standoff;
            // toY += h + config.standoff;
        } else if (dX < 0 && dY > 0) {
            // Upper left
            // toX -= w + config.standoff;
            // toY -= h + config.standoff;
        } else if (dX < 0 && dY < 0) {
            // Lower left
            // toX -= w + config.standoff;
            // toY += h + config.standoff;
        }





        // if (direction[0] > 0) {
        //     toX += sW / 2 + config.standoff;

        //     if (this._align === 'center') {
        //         toX += w / 2;
        //     } else if (this._align === 'right') {
        //         toX += w;
        //     }
        // } else if (direction[0] < 0) {
        //     toX -= sW / 2 + config.standoff;

        //     if (this._align === 'center') {
        //         toX -= w / 2;
        //     } else if (this._align === 'left') {
        //         toX -= w;
        //     }
        // }

        // if (direction[1] > 0) {
        //     toY += sH / 2 + config.standoff;

        //     if (this._baseline === 'middle') {
        //         toY += h / 2;
        //     }

        //     // toY += h / 2 + sH + config.standoff;
        //     // toY += config.standoff;
        // } else if (direction[1] < 0) {
        //     // toY -= h / 2 + sH + config.standoff;
        //     // toY -= config.standoff;
        // }

        const adjStandoff = Math.sqrt(config.standoff ** 2 / 2);

        if (direction[0] !== 0 && direction[1] !== 0) {
            const xDir = Math.sign(direction[0]);
            const yDir = Math.sign(direction[1]);

            toX += -xDir * config.standoff;
            toY += -yDir * config.standoff;

            toX += xDir * adjStandoff;
            toY += yDir * adjStandoff;
        }

        this.moveTo([toX, toY]);

        return this;
    }

    angle(): number {
        return this._angle;
    }

    currentScale(): number {
        return this._scale;
    }

    styles(): ShapeStyles {
        return this._styles;
    }

    changeColor(color: RGBA): Shape {
        this.styles().color = color;
        return this;
    }

    changeLineColor(color: RGBA): Shape {
        this.styles().lineColor = color;
        return this;
    }

    text(): string {
        return this._text;
    }

    copy(): this {
        return utils.deepCopy(this);
    }

    baseline(): TextBaseline {
        return this._baseline;
    }

    align(): TextAlign {
        return this._align;
    }

    fontSize(): number {
        return this._size;
    }

    fontFamily(): string {
        return this._font;
    }

    position(): Point {
        return [this._x, this._y];
    }

    isTex(): boolean {
        return this._tex;
    }

    private boundingBox(): { minX: number, maxX: number, minY: number, maxY: number } {
        const left = this._align === 'left' ? this._x : this._align === 'center' ? this._x - this._textWidth / 2 : this._x - this._textWidth;
        const top = this._baseline === 'top' ? this._y : this._baseline === 'middle' ? this._y - this._textHeight / 2 : this._y - this._textHeight;

        return {
            minX: left,
            maxX: left + this._textWidth,
            minY: top,
            maxY: top + this._textHeight
        };
    }
}

export { Text, type TextBaseline, type TextAlign, type TextArgs };
