import { Shape, isShape } from './shapes/base_shapes';
import { Animation, isAnimation } from './animations/animations';
import { Canvas, HtmlCanvas } from './renderers/renderer';
import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT, Point } from './base';
import { getRenderer } from './renderers/renderer_factory';
import { Interaction } from './animations/interactivity';


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
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }
}

type Renderable = Shape | Animation | Interaction;


class Interactivity {
    private mousePosition?: Point;
    // private mouseMoveListeners: ((point: Point) => void)[] = [];

    constructor(private canvas: Canvas) {
        canvas.onMouseMove((point: Point) => {
            this.mousePosition = point;
            // this.mouseMoveListeners.forEach(listener => listener(point));
        });

        canvas.onMouseOut(() => this.mousePosition = undefined);
    }

    // onMouseMove(listener: (point: Point) => void): void {
    //     this.mouseMoveListeners.push(listener);
    // }

    interact(el: Interaction, time: number) {
        if (!this.mousePosition) {
            return;
        }

        // console.log(el, this.mousePosition)
        el.mouseInteraction(this.mousePosition, time);
    }
}


export abstract class Scene {
    private els: Renderable[][];
    private canvas: Canvas;
    private runner: SceneRunner;
    private interactivity: Interactivity;


    constructor({ canvas }: { canvas?: Canvas } = {}) {
        this.els = [];
        this.canvas = canvas ?? new HtmlCanvas(DOM.createCanvas());
        this.runner = new SceneRunner(this);
        this.interactivity = new Interactivity(this.canvas);
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

        for (const els of this.els) {
            for (const el of els) {
                if (isShape(el)) {
                    getRenderer(this.canvas, el).render(el);
                } else if (isAnimation(el)) {
                    el.tick(time);
                } else {
                    this.interactivity.interact(el, time);
                }
            }

            const hasRunningAnims = els.some(el => isAnimation(el) ? (el.isRunning() && !el.isComplete(time)) : false);
            if (hasRunningAnims) {
                break;
            }
        }
    }

    abstract compose(): Scene;
}
