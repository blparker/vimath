import { NativeRenderer, ShapeRenderer } from './renderer';
import { Text } from '../shapes/primitives/text';
import { TextMetrics } from '../shapes/text_metrics';

import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { LiteElement } from 'mathjax-full/js/adaptors/lite/Element';


export const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor);

export const mjDocument = mathjax.document('', {
    InputJax: new TeX(),
    OutputJax: new SVG({ fontCache: 'local' })
});

const mjOptions = {
    em: 16,
    ex: 8,
    // em: 32,
    // ex: 16,
    containerWidth: 1280,
};


class TexImageRenderer {
    private static imageCache: Map<string, HTMLImageElement> = new Map();

    static async getImage(tex: string, size: number): Promise<HTMLImageElement> {
        if (this.imageCache.has(tex)) {
            return this.imageCache.get(tex) as HTMLImageElement;
        }

        const node = mjDocument.convert(tex, {display: false});
        const svgNode = node.children[0] as LiteElement;
        const width = parseFloat(adaptor.getAttribute(svgNode, 'width'));
        const height = parseFloat(adaptor.getAttribute(svgNode, 'height'));

        const scaleFactor = 0.415;
        adaptor.setAttribute(svgNode, 'width', (width * size * scaleFactor) + 'px');
        adaptor.setAttribute(svgNode, 'height', (height * size * scaleFactor) + 'px');

        const image64 = 'data:image/svg+xml;base64,' + btoa(adaptor.outerHTML(svgNode));
        const image = new Image();

        return new Promise((resolve, reject) => {
            image.onload = e => {
                this.imageCache.set(tex, image);
                resolve(image)
            };
            image.onerror = err => reject(err);
            image.src = image64;
        });
    }
}


export class TextRenderer extends NativeRenderer<Text> {
    async render(shape: Text): Promise<ShapeRenderer<Text>> {
        return shape.tex
            ? await this.renderTex(shape)
            : this.renderText(shape);
    }

    private async renderTex(shape: Text) {
        const image = await this.getTextImage(shape);

        const [x, y] = shape.center();
        this.canvas.image({ image, x, y, align: shape.align, verticalAlign: shape.baseline });

        return this;
    }

    private getTextImage(shape: Text): Promise<HTMLImageElement> {
        return TexImageRenderer.getImage(shape.text, shape.size);
    }

    private renderText(shape: Text) {
        // const [x, y] = shape.center();
        const [x, y] = shape.location;

        this.canvas.text({
            text: shape.text,
            x,
            y,
            size: shape.size,
            color: shape.color(),
            align: shape.align,
            baseline: shape.baseline,
            vertical: shape.vertical
        });

        return this;
    }
}