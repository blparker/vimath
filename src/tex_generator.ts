import { LiteElement } from 'mathjax-full/js/adaptors/lite/Element';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { TeX } from 'mathjax-full/js/input/tex';
import { mathjax } from 'mathjax-full/js/mathjax';
import { SVG } from 'mathjax-full/js/output/svg';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import { RGBA, rgbaToString } from '@/colors';


const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor);

const mjDocument = mathjax.document('', {
    InputJax: new TeX({ packages: AllPackages }),
    OutputJax: new SVG({
        fontCache: 'local',
    })
});


class TexGenerator {
    static _cache: Map<string, HTMLImageElement> = new Map();

    static getImage({ text, size, color, scale = 1, angle = 0 }: { text: string; size: number; color?: RGBA; scale?: number; angle?: number;}): { width: number; height: number; imageData: string; } {
        if (color) {
            text = String.raw`\color{${rgbaToString(color)}}{${text}}`;
        }

        const node = mjDocument.convert(text);
        const svgNode = node.children[0] as LiteElement;
        const width = parseFloat(adaptor.getAttribute(svgNode, 'width'));
        const height = parseFloat(adaptor.getAttribute(svgNode, 'height'));

        const pixelsPerEx = 2;
        const scaleFactor = size / pixelsPerEx;

        const adjustedWidth = width * scaleFactor;
        const adjustedHeight = height * scaleFactor;

        adaptor.setAttribute(svgNode, 'width', adjustedWidth + 'px');
        adaptor.setAttribute(svgNode, 'height', adjustedHeight + 'px');

        const image64 = 'data:image/svg+xml;base64,' + btoa(adaptor.outerHTML(svgNode));
        return { width: adjustedWidth, height: adjustedHeight, imageData: image64 };
    }

    static async generate({ text, size, color, scale = 1, angle = 0 }: { text: string; size: number; color?: RGBA; scale?: number; angle?: number;}): Promise<HTMLImageElement> {
        const cacheKey = `${text}-${size}-${color}-${scale}-${angle}`;
        if (this._cache.has(cacheKey)) {
            return Promise.resolve(this._cache.get(cacheKey)!);
        }

        const { imageData } = this.getImage({ text, size, color, scale, angle });

        const image = new Image();

        return new Promise((resolve, reject) => {
            image.onload = () => {
                // this.imageCache.set(tex, image);
                this._cache.set(cacheKey, image);
                resolve(image)
            };

            image.onerror = err => reject(err);
            image.src = imageData;
        });
    }
}


export { TexGenerator };
