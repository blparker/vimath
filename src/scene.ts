import { Shape, isShape } from './shapes/base_shapes';
import { Animation } from './animations/animations';
import { Canvas, HtmlCanvas } from './renderers/renderer';
import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from './base';
import { getRenderer } from './renderers/renderer_factory';


export class DOM {
    static createCanvas(width = DEFAULT_CANVAS_WIDTH, height = DEFAULT_CANVAS_HEIGHT): HTMLCanvasElement {
        const cvs = document.createElement('canvas');
        cvs.width = width;
        cvs.height = height;

        document.body.appendChild(cvs);

        return cvs;
    }
}


export class SceneRunner {
    constructor(private scene: Scene) {}

    run() {
        const loop = (time: number) => {
            this.scene.nextTick(time);
            // requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }
}


type Renderable = Shape | Animation;

export abstract class Scene {
    private els: Renderable[][];
    private canvas: Canvas;
    private runner: SceneRunner;
    private runningAnims: Animation[] = [];

    constructor({ canvas }: { canvas?: Canvas } = {}) {
        this.els = [];
        this.canvas = canvas ?? new HtmlCanvas(DOM.createCanvas());
        this.runner = new SceneRunner(this);
    }

    add(...els: Renderable[]): Scene {
        this.els.push([...els]);
        return this;
    }

    render(): Scene {
        this.runner.run();

        return this;
    }

    nextTick(time: number): void {
        this.canvas.clear();

        // let hasRunningAnims = false;

        for (const els of this.els) {
            // const hasRunningAnims = els.some(el => isShape(el) ? false : el.isRunning() && !el.isComplete(time));
            // console.log("### Has running?", hasRunningAnims)
            // if (hasRunningAnims) {
            //     continue;
            // }

            for (const el of els) {
                // console.log("#### ", el, this.runningAnim, el == this.runningAnim)

                if (isShape(el)) {
                    getRenderer(this.canvas, el).render(el);
                } else {
                    el.tick(time);

                    // if (!this.runningAnim) {
                    //     this.runningAnim = el;
                    // }
                }
            }

            const hasRunningAnims = els.some(el => isShape(el) ? false : el.isRunning() && !el.isComplete(time));
            if (hasRunningAnims) {
                break;
            }
        }
    }

    abstract compose(): Scene;
}
