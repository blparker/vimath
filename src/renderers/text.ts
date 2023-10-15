import { NativeRenderer, ShapeRenderer } from './renderer';
import { Text, TextBaseline } from '../shapes/text';
// import * as MathJax from '../../node_modules/mathjax/text-svg.js';
// import * as MathJax from '../../node_modules/mathjax/loader';
// import * as MathJax from 'mathjax'
// import { mathjax } from '../../node_modules/mathjax-full/ts/mathjax';
// import { Tex } from '../../node_modules/mathajx-full/ts/input/tex';
// import { SVG } from '../../node_modules/mathajx-full/ts/output/svg';
// import { Tex } from 'mathjax/input/tex';

import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { LiteElement } from 'mathjax-full/js/adaptors/lite/Element';


const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor);

const mjDocument = mathjax.document('', {
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
        const scaleFactor = 0.415;
        // const node = mjDocument.convert(shape.text, mjOptions);
        const node = mjDocument.convert(shape.text, {display: false});
        // console.log("### NODE = ", node.children[0])
        // const c = adaptor.firstChild(node) as LiteElement;
        const svgNode = node.children[0] as LiteElement;
        // const s = new XMLSerializer().serializeToString(svgNode)
        // console.log("### C = ", svgNode)
        // console.log(adaptor.innerHTML(node))
        // console.log(c.attributes.width)
        // console.log(c.attributes.height)
        // adaptor.setAttribute(svgNode, 'width', '20');
        // adaptor.setAttribute(svgNode, 'height', '20');
        // adaptor.setAttribute(c, 'height', c.attributes.height);
        // console.log("### ", adaptor.outerHTML(svgNode))
        const width = parseFloat(adaptor.getAttribute(svgNode, 'width'));
        const height = parseFloat(adaptor.getAttribute(svgNode, 'height'));

        adaptor.setAttribute(svgNode, 'width', (width * shape.size * scaleFactor) + 'px');
        adaptor.setAttribute(svgNode, 'height', (height * shape.size * scaleFactor) + 'px');

        const image64 = 'data:image/svg+xml;base64,' + btoa(adaptor.outerHTML(svgNode));
        const image = new Image();

        return new Promise((resolve, reject) => {
            image.onload = e => {
                resolve(image)
            };
            image.onerror = err => reject(err);
            image.src = image64;
            // setTimeout(() => resolve(image), 2000);
            // resolve(image);
        });
        // console.log('####', c)
        // console.log("### ", adaptor.nodeSize(node))

        // const mjOut = node.getElementsByTagName('svg')[0];
        // console.log("### ", mjOut.getBBox());
        // const width = parseFloat(mjOut.getAttribute('width').slice(0, -2), 10) * scaleFactor;
        // const height = parseFloat(mjOut.getAttribute('height').slice(0, -2), 10) * scaleFactor;

        // const node = await mathjaxDocument.tex2svgPromise(shape.text);
        // const mjOut = node.getElementsByTagName('svg')[0];
        // const width = parseFloat(mjOut.getAttribute('width').slice(0, -2), 10) * scaleFactor;
        // const height = parseFloat(mjOut.getAttribute('height').slice(0, -2), 10) * scaleFactor;

        // mjOut.setAttribute('width', (width * defaultTextSize) + 'px');
        // mjOut.setAttribute('height', (height * defaultTextSize) + 'px');
    }

    private renderText(shape: Text) {
        const [x, y] = shape.center();
        this.canvas.text({
            text: shape.text,
            x,
            y,
            size: shape.size,
            color: shape.color,
            align: shape.align,
            baseline: shape.baseline,
            vertical: shape.vertical
        });

        return this;
    }
}