import { Canvas } from '@/canvas';
import { Text } from '@/shapes/primitives/text';
import { Translation } from '@/translation';
import { TexGenerator } from '@/tex_generator';


class TextMeasurement {
    private _canvas: OffscreenCanvas;
    private t: Translation;
    private _tex: boolean;

    constructor(canvas: Canvas, tex: boolean = false) {
        this._canvas = new OffscreenCanvas(canvas.width(), canvas.height());
        this.t = new Translation(canvas);
        this._tex = tex;
    }

    textWidth(text: string, size: number, font: string, scale: number = 1): number {
        return this._tex 
            ? this.texTextDimensions(text, size, scale).width
            : this.textDimensions(text, size, font, scale).width;
    }

    textHeight(text: string, size: number, font: string, scale: number = 1): number {
        return this._tex 
            ? this.texTextDimensions(text, size, scale).height
            : this.textDimensions(text, size, font, scale).height;
    }

    textDimensions(text: string, size: number, font: string, scale: number = 1): { width: number; height: number; } {
        if (this._tex) {
            return this.texTextDimensions(text, size, scale);
        } else {
            const ctx = this._canvas.getContext('2d')!;
            ctx.font = `${size * scale}px ${font}`;

            const tm = ctx.measureText(text);

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
            ctx.font = `${text.fontSize() * text.currentScale()}px ${text.fontFamily()}`;
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
    }

    // textDimensionWithCss(text: string, size: number, font: string) {
    //     const div = document.createElement('div');
    //     div.style.font = `${size}px ${font}`;
    //     div.style.position = 'absolute';
    //     div.style.visibility = 'hidden';
    //     // div.style.height = 'auto';
    //     // div.style.width = 'auto';
    //     div.style.whiteSpace = 'nowrap';
    //     div.textContent = text;
    //     document.body.appendChild(div);
    //     const height = div.clientHeight;
    //     const width = div.clientWidth;
    //     // const cssInfo = window.getComputedStyle(div, null);

    //     document.body.removeChild(div);
    //     return { width, height };
    // }

    private texTextDimensions(text: string, size: number, scale: number = 1): { width: number; height: number; } {
        const { width, height } = TexGenerator.getImage({ text, size, scale });

        return {
            width: this.t.translateAbsWidth(width),
            height: this.t.translateAbsHeight(height)
        };
    }
}


export { TextMeasurement };
