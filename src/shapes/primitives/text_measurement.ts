import { Canvas } from '@/canvas';
import { Text } from '@/shapes/primitives/text';
import { Translation } from '@/translation';
import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { LiteElement } from 'mathjax-full/js/adaptors/lite/Element';
import { TexGenerator } from '@/tex_generator';


const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor);

const mjDocument = mathjax.document('', {
    InputJax: new TeX(),
    OutputJax: new SVG({ fontCache: 'local' })
});


class TextMeasurement {
    private _canvas: OffscreenCanvas;
    private t: Translation;
    private _tex: boolean;

    constructor(canvas: Canvas, tex: boolean = false) {
        this._canvas = new OffscreenCanvas(canvas.width(), canvas.height());
        this.t = new Translation(canvas);
        this._tex = tex;
    }

    textWidth(text: string, size: number, font: string): number {
        return this._tex 
            ? this.texTextDimensions(text, size).width
            : this.textDimensions(text, size, font).width;
    }

    textHeight(text: string, size: number, font: string): number {
        return this._tex 
            ? this.texTextDimensions(text, size).height
            : this.textDimensions(text, size, font).height;
    }

    textDimensions(text: string, size: number, font: string): { width: number; height: number; } {
        if (this._tex) {
            return this.texTextDimensions(text, size);
        } else {
            const ctx = this._canvas.getContext('2d')!;
            ctx.font = `${size}px ${font}`;

            const tm = ctx.measureText(text);

            console.log(`text: "${text}", height: ${tm.actualBoundingBoxAscent + tm.actualBoundingBoxDescent}`)
            return {
                width: this.t.translateAbsWidth(tm.width),
                height: this.t.translateAbsHeight(tm.actualBoundingBoxAscent + tm.actualBoundingBoxDescent)
            };
        }
    }

    boundingBox(text: Text): { minX: number; maxX: number; minY: number; maxY: number; height: number; width: number; } {
        if (this._tex) {
            return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 };
        } else {
            const ctx = this._canvas.getContext('2d')!;
            ctx.font = `${text.fontSize()}px ${text.fontFamily()}`;
            ctx.textAlign = text.align();
            ctx.textBaseline = text.baseline();

            const tm = ctx.measureText(text.text());

            const [x, y] = this.t.translateRelative(...text.position());

            const minX = x - tm.actualBoundingBoxLeft;
            const maxX = x + tm.actualBoundingBoxRight;
            const minY = y - tm.actualBoundingBoxAscent;
            const maxY = y + tm.actualBoundingBoxDescent;

            return { minX, maxX, minY, maxY, height: maxY - minY, width: tm.width };
        }

        // const { x, y } = text;
        // const { width, height } = text.size;
        // const { width: textWidth, height: textHeight } = text.size;
        // const { baseline } = text;

        // const minX = x;
        // const maxX = x + width;
        // const minY = y - height;
        // const maxY = y;

        // return { minX, maxX, minY, maxY };
    }

    textDimensionWithCss(text: string, size: number, font: string) {
        const div = document.createElement('div');
        div.style.font = `${size}px ${font}`;
        div.style.position = 'absolute';
        div.style.visibility = 'hidden';
        // div.style.height = 'auto';
        // div.style.width = 'auto';
        div.style.whiteSpace = 'nowrap';
        div.textContent = text;
        document.body.appendChild(div);
        const height = div.clientHeight;
        const width = div.clientWidth;
        // const cssInfo = window.getComputedStyle(div, null);

        document.body.removeChild(div);
        return { width, height };
    }

    private texTextDimensions(text: string, size: number, scale: number = 1): { width: number; height: number; } {
        // const node = mjDocument.convert(text, { display: false });
        // const svgNode = node.children[0] as LiteElement;
        // const width = parseFloat(adaptor.getAttribute(svgNode, 'width'));
        // const height = parseFloat(adaptor.getAttribute(svgNode, 'height'));

        // const scaleFactor = 0.415;
        // const adjustedWidth = width * size * scaleFactor;
        // const adjustedHeight = height * size * scaleFactor;

        // return { width: this.t.translateAbsWidth(adjustedWidth), height: this.t.translateAbsHeight(adjustedHeight) };
        // const node = mjDocument.convert(text);
        // const svgNode = node.children[0] as LiteElement;
        // const width = parseFloat(adaptor.getAttribute(svgNode, 'width'));
        // const height = parseFloat(adaptor.getAttribute(svgNode, 'height'));

        // const exToPixels = 1.25;
        // const scaleFactor = size / (height * exToPixels);

        // const adjustedWidth = width * scale * scaleFactor
        // const adjustedHeight = height * scale * scaleFactor
        // const f = 0.075;
        // const adjustedWidth = width * f * size * exToPixels;
        // const adjustedHeight = height * f * size * exToPixels;

        const { width, height } = TexGenerator.getImage({ text, size, scale });

        return {
            width: this.t.translateAbsWidth(width),
            height: this.t.translateAbsHeight(height)
        };
    }
}


export { TextMeasurement };
