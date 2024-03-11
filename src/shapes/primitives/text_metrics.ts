import { Point, Config, X_TICKS, Y_TICKS } from '@/base';
import * as math from '@/math';

import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { LiteElement } from 'mathjax-full/js/adaptors/lite/Element';


/**
 * @internal
 */
export interface TextMetrics {
    measureText(text: string, size: number): [number, number];
}


/**
 * @internal
 */
export abstract class BaseCanvasTextMetrics implements TextMetrics {
    protected canvas: OffscreenCanvas;

    constructor() {
        this.canvas = new OffscreenCanvas(Config.canvasWidth, Config.canvasHeight);
    }

    abstract measureText(text: string, size: number): [number, number];

    protected untranslate(point: Point): Point {
        const padding = Config.canvasPadding;

        const [xTicks, yTicks] = [
            (this.canvas.width - 2 * padding) / X_TICKS,
            (this.canvas.height - 2 * padding) / Y_TICKS
        ];

        const [oX, oY] = [X_TICKS / 2 * xTicks, Y_TICKS / 2 * yTicks];

        return [(point[0] - oX - padding) / xTicks, -(point[1] - oY - padding) / yTicks];
    }

    protected translate(point: Point): Point {
        const padding = Config.canvasPadding;

        const [xTicks, yTicks] = [
            (this.canvas.width - 2 * padding) / X_TICKS,
            (this.canvas.height - 2 * padding) / Y_TICKS
        ];

        const [oX, oY] = [X_TICKS / 2 * xTicks, Y_TICKS / 2 * yTicks];
        return [padding + oX + point[0] * xTicks, padding + oY - point[1] * yTicks];
    }
}


/**
 * @internal
 */
export class CanvasTextMetrics extends BaseCanvasTextMetrics {
    measureText(text: string, size: number): [number, number] {
        const ctx = this.canvas.getContext('2d');

        if (ctx === null) {
            throw new Error('Context of offscreen canvas is null');
        }

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.font = `${size}px Iowan Old Style, Apple Garamond, Baskerville, Times New Roman, Droid Serif, Times, Source Serif Pro, serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol`;

        const metrics = ctx.measureText(text);
        const dimensions = [
            metrics.width,
            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
        ] as Point;

        const origin = this.untranslate([0, 0]);
        return math.abs(math.subtract(origin, this.untranslate(dimensions))) as Point;
    }
}


export const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor);

export const mjDocument = mathjax.document('', {
    InputJax: new TeX(),
    OutputJax: new SVG({ fontCache: 'local' })
});

// const mjOptions = {
//     em: 16,
//     ex: 8,
//     // em: 32,
//     // ex: 16,
//     containerWidth: 1280,
// };


/**
 * @internal
 */
export class TexTextMetrics extends BaseCanvasTextMetrics {
    measureText(text: string, size: number): [number, number] {
        const node = mjDocument.convert(text, { display: false });
        const svgNode = node.children[0] as LiteElement;
        const width = parseFloat(adaptor.getAttribute(svgNode, 'width'));
        const height = parseFloat(adaptor.getAttribute(svgNode, 'height'));

        const scaleFactor = 0.415;
        const adjustedWidth = width * size * scaleFactor;
        const adjustedHeieght = height * size * scaleFactor;

        const origin = this.untranslate([0, 0]);
        return math.abs(math.subtract(origin, this.untranslate([adjustedWidth, adjustedHeieght]))) as [number, number];
    }
}
